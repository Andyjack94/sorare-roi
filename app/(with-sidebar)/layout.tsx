import SidebarLayout from "@/app/sidebar-layout";

export default function WithSidebarLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
