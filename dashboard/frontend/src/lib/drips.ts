// Drips Network integration for CRYPTO platform
// Handles wallet connection, project funding reads, and streaming setup

import { ethers } from "ethers";

// ─── Type Declarations ────────────────────────────────────────────────────────

declare global {
  interface Window {
    ethereum?: any;
  }
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const DRIPS_CONFIG = {
  GITHUB_REPO: "https://github.com/happyboy24/CRYPTO",
  REPO_SLUG: "happyboy24/CRYPTO",
  // Drips GraphQL API (no API key needed for reads)
  GRAPHQL_ENDPOINT: "https://api.drips.network/graphql",
  // Drips app URL — used for "Support" deep links
  APP_URL: "https://www.drips.network/app",
  // USDC on Ethereum mainnet
  USDC_ADDRESS: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  USDC_DECIMALS: 6,
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DripsProject {
  name: string;
  url: string;
  claimed: boolean;
  owner: string | null;
  totalEarned: string;       // formatted USDC
  pendingFunds: string;      // claimable right now
  monthlyInflow: string;     // estimated monthly stream
  supporters: number;
  lastSettlement: string | null;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export async function connectWallet(): Promise<WalletState> {
  if (!window.ethereum) {
    throw new Error(
      "No Ethereum wallet found. Please install MetaMask: https://metamask.io"
    );
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();

  return {
    connected: true,
    address,
    chainId: Number(network.chainId),
    provider,
    signer,
  };
}

export async function getWalletState(): Promise<WalletState> {
  const empty: WalletState = {
    connected: false,
    address: null,
    chainId: null,
    provider: null,
    signer: null,
  };

  if (!window.ethereum) return empty;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts: string[] = await provider.send("eth_accounts", []);
    if (!accounts.length) return empty;

    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    return {
      connected: true,
      address: accounts[0],
      chainId: Number(network.chainId),
      provider,
      signer,
    };
  } catch {
    return empty;
  }
}

// ─── Project Funding Data (GraphQL) ──────────────────────────────────────────

const PROJECT_QUERY = `
  query GetProject($url: String!) {
    projectByUrl(url: $url) {
      claimed
      source {
        url
        ownerName
        repoName
      }
      account {
        accountId
      }
      support {
        ... on OneTimeDonationSupport {
          amount {
            tokenAddress
            amount
          }
          date
        }
        ... on StreamSupport {
          amountPerSecond {
            tokenAddress
            amount
          }
          totalStreamed {
            tokenAddress
            amount
          }
          durationSeconds
          active
        }
      }
      totalEarned {
        tokenAddress
        amount
      }
      claimableAmount {
        tokenAddress
        amount
      }
      splits {
        maintainers {
          weight
          account {
            accountId
          }
        }
      }
    }
  }
`;

export async function fetchProjectFunding(): Promise<DripsProject> {
  try {
    const response = await fetch(DRIPS_CONFIG.GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: PROJECT_QUERY,
        variables: { url: DRIPS_CONFIG.GITHUB_REPO },
      }),
    });

    const { data, errors } = await response.json();

    if (errors || !data?.projectByUrl) {
      // Project not yet claimed — return unclaimed state
      return buildUnclaimedProject();
    }

    const p = data.projectByUrl;

    // Sum total earned in USDC
    const totalEarned = sumTokenAmount(p.totalEarned, DRIPS_CONFIG.USDC_ADDRESS, DRIPS_CONFIG.USDC_DECIMALS);
    const pendingFunds = sumTokenAmount(p.claimableAmount, DRIPS_CONFIG.USDC_ADDRESS, DRIPS_CONFIG.USDC_DECIMALS);

    // Calculate monthly inflow from active streams
    const monthlyInflow = calcMonthlyInflow(p.support);

    // Count unique supporters
    const supporters = countSupporters(p.support);

    return {
      name: `${p.source?.ownerName}/${p.source?.repoName}` || DRIPS_CONFIG.REPO_SLUG,
      url: DRIPS_CONFIG.GITHUB_REPO,
      claimed: p.claimed ?? false,
      owner: p.splits?.maintainers?.[0]?.account?.accountId ?? null,
      totalEarned: `$${totalEarned.toFixed(2)}`,
      pendingFunds: `$${pendingFunds.toFixed(2)}`,
      monthlyInflow: `$${monthlyInflow.toFixed(2)}/mo`,
      supporters,
      lastSettlement: getLastSettlementDate(),
    };
  } catch (err) {
    console.error("[Drips] Failed to fetch project funding:", err);
    return buildUnclaimedProject();
  }
}

// ─── Deep Link Helpers ────────────────────────────────────────────────────────

/** Opens the Drips app pre-filled to support this repo */
export function getSupportUrl(): string {
  const encoded = encodeURIComponent(DRIPS_CONFIG.GITHUB_REPO);
  return `${DRIPS_CONFIG.APP_URL}/fund?recipient=${encoded}`;
}

/** Opens the Drips app to claim this repo */
export function getClaimUrl(): string {
  return `${DRIPS_CONFIG.APP_URL}/projects/claim?url=${encodeURIComponent(DRIPS_CONFIG.GITHUB_REPO)}`;
}

/** Opens the project page on Drips */
export function getProjectPageUrl(): string {
  const slug = DRIPS_CONFIG.REPO_SLUG.replace("/", "-").toLowerCase();
  return `${DRIPS_CONFIG.APP_URL}/projects/${slug}`;
}

// ─── Private Helpers ──────────────────────────────────────────────────────────

function buildUnclaimedProject(): DripsProject {
  return {
    name: DRIPS_CONFIG.REPO_SLUG,
    url: DRIPS_CONFIG.GITHUB_REPO,
    claimed: false,
    owner: null,
    totalEarned: "$0.00",
    pendingFunds: "$0.00",
    monthlyInflow: "$0.00/mo",
    supporters: 0,
    lastSettlement: null,
  };
}

function sumTokenAmount(
  amounts: Array<{ tokenAddress: string; amount: string }> | null,
  targetToken: string,
  decimals: number
): number {
  if (!amounts) return 0;
  return amounts
    .filter((a) => a.tokenAddress.toLowerCase() === targetToken.toLowerCase())
    .reduce((sum, a) => sum + Number(a.amount) / Math.pow(10, decimals), 0);
}

function calcMonthlyInflow(
  support: Array<{ amountPerSecond?: { amount: string; tokenAddress: string }; active?: boolean }> | null
): number {
  if (!support) return 0;
  const SECONDS_PER_MONTH = 30 * 24 * 60 * 60;
  return support
    .filter((s) => s.amountPerSecond && s.active)
    .reduce((sum, s) => {
      const perSec = Number(s.amountPerSecond!.amount) / Math.pow(10, DRIPS_CONFIG.USDC_DECIMALS);
      return sum + perSec * SECONDS_PER_MONTH;
    }, 0);
}

function countSupporters(support: unknown[] | null): number {
  return support?.length ?? 0;
}

function getLastSettlementDate(): string {
  // Drips settles on the last Thursday of each month
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of month
  while (d.getDay() !== 4) d.setDate(d.getDate() - 1); // walk back to Thursday
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Wallet event listeners ───────────────────────────────────────────────────

export function onAccountsChanged(cb: (accounts: string[]) => void): () => void {
  window.ethereum?.on("accountsChanged", cb);
  return () => window.ethereum?.removeListener("accountsChanged", cb);
}

export function onChainChanged(cb: (chainId: string) => void): () => void {
  window.ethereum?.on("chainChanged", cb);
  return () => window.ethereum?.removeListener("chainChanged", cb);
}
