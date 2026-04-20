"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui" }}>
      
      {/* Sidebar only if NOT on homepage */}
      {!isHome && (
        <aside
          style={{
            width: 220,
            background: "#111827",
            color: "white",
            padding: "1.5rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Link
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            AndyisaGooden
          </Link>

          <h3 style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>
            Sorare ROI Tracker
          </h3>

          <nav
            style={{
              marginTop: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* ⭐ SWAPPED ORDER */}
            <Link href="/overall-stats" style={{ color: "white", textDecoration: "none" }}>
              📈 Overall Stats
            </Link>

            <Link href="/charts" style={{ color: "white", textDecoration: "none" }}>
              📊 Competition Breakdown
            </Link>

            <Link href="/inputs" style={{ color: "white", textDecoration: "none" }}>
              📝 Inputs
            </Link>

            <Link href="/database" style={{ color: "white", textDecoration: "none" }}>
              📁 Database Review
            </Link>
          </nav>
        </aside>
      )}

      {/* Main content */}
      <main style={{ flex: 1, overflowY: "auto", padding: isHome ? "0" : "2rem" }}>
        {children}
      </main>
    </div>
  );
}
