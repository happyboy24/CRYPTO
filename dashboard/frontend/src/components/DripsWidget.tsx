// Drop this anywhere in your dashboard layout — it's fully self-contained.

import { useEffect, useState, useCallback } from "react";
import {
  connectWallet,
  fetchProjectFunding,
  getClaimUrl,
  getSupportUrl,
  getProjectPageUrl,
  onAccountsChanged,
  onChainChanged,
  getWalletState,
  type DripsProject,
  type WalletState,
} from "../lib/drips";

// ─── Styles (inline, no extra CSS file needed) ────────────────────────────────

const styles = {
  widget: {
    background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
    border: "1px solid #21d07340",
    borderRadius: "12px",
    padding: "20px 24px",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    color: "#e6edf3",
    maxWidth: "420px",
    boxShadow: "0 0 24px #21d07318, 0 4px 16px #0008",
    position: "relative" as const,
    overflow: "hidden",
  },
  glowBar: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent, #21d073, #58a6ff, transparent)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  title: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#21d073",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  dropIcon: {
    fontSize: "16px",
    filter: "drop-shadow(0 0 6px #21d073)",
  },
  badge: (claimed: boolean) => ({
    fontSize: "10px",
    padding: "2px 8px",
    borderRadius: "20px",
    background: claimed ? "#21d07320" : "#f7853120",
    color: claimed ? "#21d073" : "#f78531",
    border: `1px solid ${claimed ? "#21d07340" : "#f7853140"}`,
    letterSpacing: "0.05em",
  }),
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "16px",
  },
  statBox: {
    background: "#ffffff08",
    border: "1px solid #ffffff12",
    borderRadius: "8px",
    padding: "10px 12px",
  },
  statLabel: {
    fontSize: "10px",
    color: "#8b949e",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    marginBottom: "4px",
  },
  statValue: (highlight?: boolean) => ({
    fontSize: "16px",
    fontWeight: 700,
    color: highlight ? "#21d073" : "#e6edf3",
    fontVariantNumeric: "tabular-nums" as const,
  }),
  divider: {
    height: "1px",
    background: "#ffffff10",
    margin: "14px 0",
  },
  settlementRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
    color: "#8b949e",
    marginBottom: "14px",
  },
  settlementDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#21d073",
    display: "inline-block",
    marginRight: "6px",
    boxShadow: "0 0 6px #21d073",
    animation: "pulse 2s infinite",
  },
  btnRow: {
    display: "flex",
    gap: "8px",
  },
  btnPrimary: {
    flex: 1,
    background: "linear-gradient(135deg, #21d073, #1ab862)",
    color: "#0d1117",
    border: "none",
    borderRadius: "8px",
    padding: "10px 0",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "opacity 0.15s, transform 0.1s",
    fontFamily: "inherit",
  },
  btnSecondary: {
    flex: 1,
    background: "transparent",
    color: "#58a6ff",
    border: "1px solid #58a6ff40",
    borderRadius: "8px",
    padding: "10px 0",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.05em",
    transition: "background 0.15s",
    fontFamily: "inherit",
  },
  btnOutline: {
    flex: 1,
    background: "transparent",
    color: "#8b949e",
    border: "1px solid #30363d",
    borderRadius: "8px",
    padding: "10px 0",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.05em",
    fontFamily: "inherit",
  },
  walletRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#ffffff06",
    border: "1px solid #ffffff10",
    borderRadius: "8px",
    padding: "8px 12px",
    marginBottom: "12px",
    fontSize: "11px",
  },
  walletAddr: {
    color: "#58a6ff",
    fontFamily: "inherit",
  },
  walletDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#21d073",
    display: "inline-block",
    marginRight: "6px",
  },
  loading: {
    textAlign: "center" as const,
    color: "#8b949e",
    fontSize: "12px",
    padding: "24px 0",
  },
  error: {
    background: "#ff000010",
    border: "1px solid #ff000030",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "11px",
    color: "#ff7b72",
    marginBottom: "12px",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DripsWidget() {
  const [project, setProject] = useState<DripsProject | null>(null);
  const [wallet, setWallet] = useState<WalletState>({
    connected: false, address: null, chainId: null, provider: null, signer: null,
  });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load project data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectData, walletState] = await Promise.all([
        fetchProjectFunding(),
        getWalletState(),
      ]);
      setProject(projectData);
      setWallet(walletState);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Drips data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const removeAccounts = onAccountsChanged(() => loadData());
    const removeChain = onChainChanged(() => loadData());
    return () => { removeAccounts(); removeChain(); };
  }, [loadData]);

  // Connect wallet
  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const state = await connectWallet();
      setWallet(state);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet connection failed");
    } finally {
      setConnecting(false);
    }
  };

  const shortAddr = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={styles.widget}>
        <div style={styles.glowBar} />
        <div style={styles.loading}>
          <span style={{ color: "#21d073" }}>💧</span> Loading funding data...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.widget}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .drips-btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
        .drips-btn-secondary:hover { background: #58a6ff15 !important; }
        .drips-btn-outline:hover { background: #ffffff08 !important; }
      `}</style>

      {/* Top glow bar */}
      <div style={styles.glowBar} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span style={styles.dropIcon}>💧</span>
          Drips Funding
        </div>
        <span style={styles.badge(project?.claimed ?? false)}>
          {project?.claimed ? "● CLAIMED" : "○ UNCLAIMED"}
        </span>
      </div>

      {/* Error */}
      {error && <div style={styles.error}>⚠ {error}</div>}

      {/* Wallet row */}
      {wallet.connected && wallet.address ? (
        <div style={styles.walletRow}>
          <span>
            <span style={styles.walletDot} />
            <span style={styles.walletAddr}>{shortAddr(wallet.address)}</span>
          </span>
          <span style={{ color: "#8b949e" }}>
            {wallet.chainId === 1 ? "Ethereum" : wallet.chainId === 10 ? "Optimism" : `Chain ${wallet.chainId}`}
          </span>
        </div>
      ) : (
        <button
          style={{ ...styles.btnSecondary, marginBottom: "12px", width: "100%" }}
          className="drips-btn-secondary"
          onClick={handleConnect}
          disabled={connecting}
        >
          {connecting ? "Connecting..." : "🔗 Connect Wallet"}
        </button>
      )}

      {/* Stats */}
      {project && (
        <>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Total Earned</div>
              <div style={styles.statValue(true)}>{project.totalEarned}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Claimable Now</div>
              <div style={styles.statValue()}>{project.pendingFunds}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Monthly Inflow</div>
              <div style={styles.statValue()}>{project.monthlyInflow}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Supporters</div>
              <div style={styles.statValue()}>{project.supporters}</div>
            </div>
          </div>

          {/* Settlement info */}
          <div style={styles.settlementRow}>
            <span>
              <span style={styles.settlementDot} />
              Next settlement
            </span>
            <span>{project.lastSettlement ?? "—"}</span>
          </div>

          <div style={styles.divider} />

          {/* Actions */}
          <div style={styles.btnRow}>
            {!project.claimed ? (
              <button
                style={styles.btnPrimary}
                className="drips-btn-primary"
                onClick={() => window.open(getClaimUrl(), "_blank")}
              >
                🏷 Claim Project
              </button>
            ) : (
              <button
                style={styles.btnPrimary}
                className="drips-btn-primary"
                onClick={() => window.open(getSupportUrl(), "_blank")}
              >
                💧 Support Project
              </button>
            )}
            <button
              style={styles.btnOutline}
              className="drips-btn-outline"
              onClick={() => window.open(getProjectPageUrl(), "_blank")}
            >
              View on Drips ↗
            </button>
          </div>
        </>
      )}
    </div>
  );
}
