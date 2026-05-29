"use client";
export const dynamic = "force-dynamic";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailCount, setEmailCount] = useState(0);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  async function scanEmails() {
    setLoading(true);
    setAnalysis("");
    try {
      const res = await fetch("/api/analyze", { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
      setEmailCount(data.emailCount);
      setScanned(true);
    } catch (e) {
      setAnalysis("Error scanning emails: " + e.message);
    }
    setLoading(false);
  }

  if (status === "loading") return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>V&S AI AGENCY</div>
        <div style={styles.headerRight}>
          <span style={styles.userEmail}>{session?.user?.email}</span>
          <button style={styles.signOut} onClick={() => signOut()}>Sign out</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.welcome}>
          <h1 style={styles.h1}>Good morning, {session?.user?.name?.split(" ")[0]}.</h1>
          <p style={styles.sub}>Your AI is ready to scan your inbox and find your hot leads.</p>
        </div>

        {!scanned && (
          <div style={styles.scanBox}>
            <div style={styles.scanIcon}>📬</div>
            <h2 style={styles.scanTitle}>Ready to scan your inbox</h2>
            <p style={styles.scanSub}>
              V&S AI will read your last 20 emails and identify hot leads,
              urgent messages, and draft your most important reply.
            </p>
            <button
              style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
              onClick={scanEmails}
              disabled={loading}
            >
              {loading ? "Scanning your inbox..." : "🔍 Scan My Inbox Now"}
            </button>
            {loading && (
              <p style={styles.loadingText}>
                Reading emails and finding hot leads... this takes about 15 seconds
              </p>
            )}
          </div>
        )}

        {scanned && (
          <div style={styles.results}>
            <div style={styles.resultsHeader}>
              <div>
                <div style={styles.badge}>SCAN COMPLETE</div>
                <p style={styles.scannedCount}>Analyzed {emailCount} emails</p>
              </div>
              <button style={styles.rescanBtn} onClick={scanEmails} disabled={loading}>
                {loading ? "Scanning..." : "↻ Rescan"}
              </button>
            </div>

            <div style={styles.analysisBox}>
              {analysis.split("\n").map((line, i) => {
                if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.")) {
                  return <h3 key={i} style={styles.sectionHead}>{line}</h3>;
                }
                if (line.startsWith("🔥") || line.startsWith("⚠️") || line.startsWith("📋") || line.startsWith("✉️")) {
                  return <h3 key={i} style={styles.sectionHead}>{line}</h3>;
                }
                if (line.trim() === "") return <br key={i} />;
                return <p key={i} style={styles.analysisLine}>{line}</p>;
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Helvetica Neue', sans-serif", background: "#fff", minHeight: "100vh" },
  loading: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: "1.2rem" },
  header: { background: "#000", color: "#fff", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontWeight: 900, letterSpacing: "3px", fontSize: "0.85rem" },
  headerRight: { display: "flex", alignItems: "center", gap: "16px" },
  userEmail: { opacity: 0.6, fontSize: "0.85rem" },
  signOut: { background: "transparent", border: "1px solid #ffffff40", color: "#fff", padding: "6px 12px", cursor: "pointer", fontSize: "0.8rem" },
  main: { maxWidth: "800px", margin: "0 auto", padding: "48px 24px" },
  welcome: { marginBottom: "48px" },
  h1: { fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-1px", margin: "0 0 8px" },
  sub: { opacity: 0.5, fontSize: "1rem" },
  scanBox: { border: "2px solid #000", padding: "48px", textAlign: "center" },
  scanIcon: { fontSize: "3rem", marginBottom: "16px" },
  scanTitle: { fontSize: "1.5rem", fontWeight: 900, margin: "0 0 12px" },
  scanSub: { opacity: 0.6, maxWidth: "400px", margin: "0 auto 32px", lineHeight: 1.6 },
  btn: { background: "#000", color: "#fff", border: "none", padding: "16px 32px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", letterSpacing: "1px" },
  loadingText: { marginTop: "16px", opacity: 0.5, fontSize: "0.85rem" },
  results: {},
  resultsHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  badge: { background: "#000", color: "#fff", display: "inline-block", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "3px", padding: "4px 10px", marginBottom: "6px" },
  scannedCount: { opacity: 0.5, fontSize: "0.85rem", margin: 0 },
  rescanBtn: { background: "transparent", border: "1px solid #000", padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" },
  analysisBox: { background: "#f8f8f8", padding: "32px", lineHeight: 1.7 },
  sectionHead: { fontWeight: 900, fontSize: "1.1rem", margin: "24px 0 12px", borderLeft: "4px solid #000", paddingLeft: "12px" },
  analysisLine: { margin: "4px 0", fontSize: "0.95rem" },
};
