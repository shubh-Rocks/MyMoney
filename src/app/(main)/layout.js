import Sidebar from "@/components/dashboard/layout/SideNavbar";


export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f6f8fa]">
      <Sidebar/>
      <main className="flex-1 px-6 py-3.5">{children}</main>
    </div>
  );
}
