import "./globals.css";
import SidebarLayout from "./sidebar-layout";

export const metadata = {
  title: "AndyisaGooden Sorare ROI Tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
