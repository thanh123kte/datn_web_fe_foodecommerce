import { MainLayout } from "@/components/layout";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <MainLayout
      userRole="admin"
      title="Admin Dashboard"
      showSearch={true}
      className="p-6"
    >
      {children}
    </MainLayout>
  );
}
