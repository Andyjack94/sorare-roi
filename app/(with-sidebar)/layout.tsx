// ❌ NO "use client" here — must be a server component

import SidebarLayout from "@/app/sidebar-layout";

export default function WithSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  );
}
