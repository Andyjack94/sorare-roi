export const dynamic = "force-dynamic";

import "./globals.css";

export const metadata = {
  title: "AndyisaGooden Sorare ROI Tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
