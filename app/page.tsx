import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        textAlign: "center",
        paddingTop: "3rem",
      }}
    >
      <h1
        style={{
          fontSize: "2.8rem",
          marginBottom: "2.5rem",
          fontWeight: 700,
        }}
      >
        AndyisaGooden’s Sorare ROI
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          maxWidth: 400,
          margin: "0 auto",
        }}
      >
        {/* ⭐ NEW BUTTON — FIRST POSITION */}
        <Link
          href="/overall-stats"
          style={{
            padding: "1rem",
            background: "#0ea5e9", // sky blue to match your palette
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          📈 Overall Stats
        </Link>

        <Link
          href="/charts"
          style={{
            padding: "1rem",
            background: "#0070f3",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          📊 Charts
        </Link>

        <Link
          href="/inputs"
          style={{
            padding: "1rem",
            background: "#10b981",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          📝 Inputs
        </Link>

        <Link
          href="/database"
          style={{
            padding: "1rem",
            background: "#6366f1",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          📁 Database Review
        </Link>
      </div>

      <a
        href="https://sorare.com/football/my-club/andyisagooden?t=HXnONS&utm_medium=social&utm_term=football"
        target="_blank"
        style={{
          display: "inline-block",
          marginTop: "3rem",
          color: "#0070f3",
          fontSize: "1rem",
          textDecoration: "underline",
        }}
      >
        View My Sorare Club →
      </a>
    </div>
  );
}
