import Link from "next/link";

export default function NCETrackerLayout({
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
      {/* Page Title */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto 2rem auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          NCE Tracker
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.95rem",
          }}
        >
          Rewards, inputs, and performance overview.
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
        <Tab href="/nce-tracker/rewards" label="Rewards" />
        <Tab href="/nce-tracker/inputs" label="Inputs" />
      </div>

      {/* Page Content */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

function Tab({ href, label }: { href: string; label: string }) {
  const isActive =
    typeof window !== "undefined" && window.location.pathname === href;

  return (
    <Link
      href={href}
      style={{
        padding: "0.6rem 1.2rem",
        borderRadius: "8px",
        background: isActive ? "#1e40af" : "#1e293b",
        color: isActive ? "white" : "#cbd5e1",
        fontWeight: 600,
        border: "1px solid #334155",
      }}
    >
      {label}
    </Link>
  );
}
