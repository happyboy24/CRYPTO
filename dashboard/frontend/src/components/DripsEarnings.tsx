// Compact earnings indicator — drop into your navbar or dashboard header.
// Shows live funding status with a pulsing dot.

import { useEffect, useState } from "react";
import { fetchProjectFunding, getProjectPageUrl, type DripsProject } from "../lib/drips";

export default function DripsEarnings() {
  const [project, setProject] = useState<DripsProject | null>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    fetchProjectFunding().then(setProject).catch(console.error);
  }, []);

  if (!project) return null;

  return (
    <button
      onClick={() => window.open(getProjectPageUrl(), "_blank")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: hover ? "#21d07318" : "#21d07310",
        border: "1px solid #21d07340",
        borderRadius: "20px",
        padding: "5px 12px 5px 8px",
        cursor: "pointer",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12px",
        color: "#21d073",
        transition: "background 0.15s",
        outline: "none",
        whiteSpace: "nowrap",
      }}
    >
      {/* Pulsing dot */}
      <span style={{ position: "relative", width: "8px", height: "8px" }}>
        <span style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#21d073",
          animation: "drips-ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
          opacity: 0.6,
        }} />
        <span style={{
          position: "absolute",
          inset: "1px",
          borderRadius: "50%",
          background: "#21d073",
        }} />
      </span>

      <style>{`
        @keyframes drips-ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      💧 {project.totalEarned}
      {project.claimed && (
        <span style={{ color: "#8b949e", fontSize: "10px" }}>
          +{project.monthlyInflow.replace("/mo", "")}/mo
        </span>
      )}
    </button>
  );
}
