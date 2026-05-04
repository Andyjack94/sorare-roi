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

            {/* Year Breakdown Dropdown */}
            <details style={{ cursor: "pointer", marginLeft: "0.5rem" }}>
              <summary
                style={{
                  color: "white",
                  fontSize: "0.9rem",
                  opacity: 0.8,
                  listStyle: "none",
                  cursor: "pointer",
                }}
              >
                Year Breakdown
              </summary>

              <div
                style={{
                  marginLeft: "1rem",
                  marginTop: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <Link href="/overall-stats/year-breakdown/2026" style={{ color: "white", textDecoration: "none" }}>
                  • 2026
                </Link>
                <Link href="/overall-stats/year-breakdown/2025" style={{ color: "white", textDecoration: "none" }}>
                  • 2025
                </Link>
                <Link href="/overall-stats/year-breakdown/2024" style={{ color: "white", textDecoration: "none" }}>
                  • 2024
                </Link>
                <Link href="/overall-stats/year-breakdown/2023" style={{ color: "white", textDecoration: "none" }}>
                  • 2023
                </Link>
                <Link href="/overall-stats/year-breakdown/2022" style={{ color: "white", textDecoration: "none" }}>
                  • 2022
                </Link>
              </div>
            </details>

            {/* Parent link (clickable) */}
            <Link href="/charts" style={{ color: "white", textDecoration: "none" }}>
              📊 Competition Breakdown
            </Link>

            {/* Dropdown for Series */}
            <details style={{ cursor: "pointer", marginLeft: "0.5rem" }}>
              <summary
                style={{
                  color: "white",
                  fontSize: "0.9rem",
                  opacity: 0.8,
                  listStyle: "none",
                  cursor: "pointer",
                }}
              >
                Series Breakdown
              </summary>

              <div
                style={{
                  marginLeft: "1rem",
                  marginTop: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <Link href="/series/sorare-27" style={{ color: "white", textDecoration: "none" }}>
                  • Sorare 27
                </Link>
                <Link href="/series/sorare-26" style={{ color: "white", textDecoration: "none" }}>
                  • Sorare 26
                </Link>
                <Link href="/series/sorare-24-25" style={{ color: "white", textDecoration: "none" }}>
                  • Sorare 24/25
                </Link>
                <Link href="/series/cap-240" style={{ color: "white", textDecoration: "none" }}>
                  • Cap 240
                </Link>
                <Link href="/series/early-sorare" style={{ color: "white", textDecoration: "none" }}>
                  • Early Sorare
                </Link>
              </div>
            </details>

            <Link href="/inputs" style={{ color: "white", textDecoration: "none" }}>
              📝 Inputs
            </Link>

            <Link href="/database" style={{ color: "white", textDecoration: "none" }}>
              📁 Database Review
            </Link>

            {/* ⭐ NCE Tracker moved to the bottom */}
            <Link href="/nce-tracker" style={{ color: "white", textDecoration: "none" }}>
              🎯 NCE Tracker
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
