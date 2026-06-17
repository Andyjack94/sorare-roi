import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "3rem 1rem",
        color: "white",
      }}
    >
      {/* Inline CSS for hover animation */}
      <style>
        {`
          .fun-link {
            display: inline-block;
            padding: 0.75rem 1.25rem;
            background: #1e40af;
            border-radius: 12px;
            color: white;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 600;
            border: 1px solid #3b82f6;
            transition: transform 0.2s ease, background 0.2s ease;
          }
          .fun-link:hover {
            transform: scale(1.05);
            background: #2563eb;
          }
        `}
      </style>

      {/* Top bar */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto 3rem auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Sorare ROI Dashboard</h1>
        <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>AndyisaGooden</span>
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
      >
        <Link
          href="/overall-stats"
          style={{
            background: "#1e293b",
            padding: "1.2rem",
            borderRadius: 12,
            border: "1px solid #334155",
            textDecoration: "none",
            color: "white",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          📈 Overall Stats
        </Link>

        <Link
          href="/charts"
          style={{
            background: "#1e293b",
            padding: "1.2rem",
            borderRadius: 12,
            border: "1px solid #334155",
            textDecoration: "none",
            color: "white",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          📊 Competition Breakdown
        </Link>

        {/* ⭐ NEW — Sorare Sets */}
        <Link
          href="/sorare-sets/overview"
          style={{
            background: "#1e293b",
            padding: "1.2rem",
            borderRadius: 12,
            border: "1px solid #334155",
            textDecoration: "none",
            color: "white",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          🎨 Sorare Sets
        </Link>

        <Link
          href="/inputs"
          style={{
            background: "#1e293b",
            padding: "1.2rem",
            borderRadius: 12,
            border: "1px solid #334155",
            textDecoration: "none",
            color: "white",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          📝 Inputs
        </Link>

        <Link
          href="/database"
          style={{
            background: "#1e293b",
            padding: "1.2rem",
            borderRadius: 12,
            border: "1px solid #334155",
            textDecoration: "none",
            color: "white",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          📁 Database Review
        </Link>

        {/* NEW — NCE Tracker */}
        <Link
          href="/nce-tracker"
          style={{
            background: "#1e293b",
            padding: "1.2rem",
            borderRadius: 12,
            border: "1px solid #334155",
            textDecoration: "none",
            color: "white",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          🎯 NCE Tracker
        </Link>
      </div>

      {/* Fun footer link (CSS-only hover) */}
      <div style={{ maxWidth: 900, margin: "3rem auto 0 auto", textAlign: "center" }}>
        <a
          href="https://sorare.com/football/my-club/andyisagooden?t=HXnONS&utm_medium=social&utm_term=football"
          target="_blank"
          className="fun-link"
        >
          ⚽ Visit My Sorare Club →
        </a>
      </div>
    </div>
  );
}
