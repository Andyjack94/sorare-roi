import Link from "next/link";

export default function SorareSetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "3rem 1rem",
        color: "white",
      }}
    >
      {/* Title */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto 2rem auto",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Sorare Sets</h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
          Track purchases, rewards, and set progress.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto 2rem auto",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Tab href="/sorare-sets/overview" label="Overview" />
        <Tab href="/sorare-sets/inputs" label="Inputs" />
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

function Tab({ href, label }: { href: string; label: string }) {
  const active =
    typeof window !== "undefined" && window.location.pathname === href;

  return (
    <Link
      href={href}
      style={{
        padding: "0.6rem 1.2rem",
        borderRadius: "8px",
        background: active ? "#1e40af" : "#1e293b",
        color: active ? "white" : "#cbd5e1",
        fontWeight: 600,
        border: "1px solid #334155",
      }}
    >
      {label}
    </Link>
  );
}
