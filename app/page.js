"use client";
export const dynamic = "force-dynamic";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  return (
    <main style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.badge}>AI FOR REAL ESTATE</div>
        <h1 style={styles.h1}>Never Miss a Hot Lead Again.</h1>
        <p style={styles.sub}>
          ClearPath AI scans your inbox and tells you exactly who is ready to buy or sell —
          and what to say to close them.
        </p>
        <div style={styles.features}>
          <div style={styles.feature}>🔥 Hot lead detection</div>
          <div style={styles.feature}>✉️ Auto-drafted replies</div>
          <div style={styles.feature}>📋 Daily action list</div>
          <div style={styles.feature}>📈 Close more deals</div>
        </div>
        <button style={styles.btn} onClick={() => signIn("google")}>
          Connect Gmail — Start Free Trial
        </button>
        <p style={styles.fine}>$400/month after trial · Cancel anytime</p>
      </div>

      <div style={styles.howSection}>
        <h2 style={styles.h2}>How It Works</h2>
        <div style={styles.steps}>
          <div style={styles.step}>
            <div style={styles.stepNum}>1</div>
            <div>
              <strong>Connect Gmail</strong>
              <p>One click — takes 30 seconds</p>
            </div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNum}>2</div>
            <div>
              <strong>AI Scans Your Inbox</strong>
              <p>Reads your last 30 emails instantly</p>
            </div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNum}>3</div>
            <div>
              <strong>Get Your Action List</strong>
              <p>Hot leads, urgent replies, follow-ups — all in one dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.social}>
        <blockquote style={styles.quote}>
          "I was about to lose a $2.1M listing because the client emailed me and I missed it.
          ClearPath flagged it as urgent. Closed the deal that same day."
        </blockquote>
        <cite style={styles.cite}>— Real estate agent, Miami FL</cite>
      </div>

      <div style={styles.pricing}>
        <h2 style={styles.h2}>Simple Pricing</h2>
        <div style={styles.priceCard}>
          <div style={styles.priceLabel}>Real Estate Pro</div>
          <div style={styles.price}>$400<span style={styles.perMonth}>/month</span></div>
          <ul style={styles.list}>
            <li>✓ Unlimited inbox scans</li>
            <li>✓ Hot lead detection</li>
            <li>✓ Auto-drafted email replies</li>
            <li>✓ Daily action digest</li>
            <li>✓ Deal pipeline tracking</li>
          </ul>
          <button style={styles.btn} onClick={() => signIn("google")}>
            Start Free Trial
          </button>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: { fontFamily: "'Helvetica Neue', sans-serif", color: "#0a0a0a", background: "#fff" },
  hero: { background: "#000", color: "#fff", padding: "80px 24px", textAlign: "center" },
  badge: { display: "inline-block", background: "#fff", color: "#000", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "3px", padding: "6px 14px", marginBottom: "24px" },
  h1: { fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-2px", maxWidth: "700px", margin: "0 auto 20px" },
  sub: { fontSize: "1.1rem", opacity: 0.8, maxWidth: "500px", margin: "0 auto 32px", lineHeight: 1.6 },
  features: { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginBottom: "40px" },
  feature: { background: "#ffffff15", border: "1px solid #ffffff30", padding: "8px 16px", fontSize: "0.85rem" },
  btn: { background: "#fff", color: "#000", border: "none", padding: "16px 32px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", letterSpacing: "1px" },
  fine: { marginTop: "12px", opacity: 0.5, fontSize: "0.8rem" },
  howSection: { padding: "80px 24px", maxWidth: "700px", margin: "0 auto", textAlign: "center" },
  h2: { fontSize: "2rem", fontWeight: 900, letterSpacing: "-1px", marginBottom: "40px" },
  steps: { display: "flex", flexDirection: "column", gap: "24px", textAlign: "left" },
  step: { display: "flex", gap: "20px", alignItems: "flex-start" },
  stepNum: { background: "#000", color: "#fff", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, flexShrink: 0 },
  social: { background: "#f8f8f8", padding: "60px 24px", textAlign: "center" },
  quote: { fontSize: "1.2rem", fontStyle: "italic", maxWidth: "600px", margin: "0 auto 12px", lineHeight: 1.6 },
  cite: { opacity: 0.5, fontSize: "0.85rem" },
  pricing: { padding: "80px 24px", textAlign: "center" },
  priceCard: { display: "inline-block", border: "2px solid #000", padding: "40px", maxWidth: "360px", width: "100%" },
  priceLabel: { fontSize: "0.7rem", letterSpacing: "3px", fontWeight: 700, marginBottom: "16px" },
  price: { fontSize: "3rem", fontWeight: 900 },
  perMonth: { fontSize: "1rem", fontWeight: 400 },
  list: { listStyle: "none", padding: 0, textAlign: "left", margin: "24px 0", lineHeight: 2 },
};
