"use client";
import { navItems } from "@/lib/navConfig";
import { useAuth } from "@/provider/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Sidebar = () => {
  const { user: rawUser, isLoading, logout } = useAuth();
  const user = rawUser?.data?.user || rawUser?.user || rawUser;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dropdownRef(false);
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const saved = document.cookie
      .split(";")
      .find((row) => row.startsWith("sidebar-collapsed="));
    if (saved) setCollapsed(saved.split("=")[1] === "true");
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie(`sidebar-collapsed=${next};path=/; max-age=31536000`);
  };

  return (
    <aside
      className={`shrink-0 h-screen sticky top-0 bg-white border-r border-[#0e3b53]/20 flex flex-col justify-between font-semibold transition-all duration-300 ease-in-out${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex flex-col">
        {/* logo and titlee */}
        <div className="flex items-center justify-between px-4 py-5 border-b border border-[#0e3b53]/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <Image
              src="/logo.svg"
              width={36}
              height={36}
              alt="logo"
              className="shrink-0"
            />
            {!collapsed && (
              <h1 className="font-semibold text-xl whitespace-nowrap">
                My Money
              </h1>
            )}
          </div>
        </div>

        {/* nav links */}
        <nav className="flex flex-col gap-1 px-3 py-6">
          {navItems.map((items) => {
            const Icon = items.icon;
            const active = pathname === items.href;
            return (
              <Link
                key={items.href}
                href={items.href}
                title={collapsed ? items.label : undefined}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? "bg-green-50 text-green-700" : "text-gray hover:bg-gray-100"}${collapsed ? "justify-center" : ""}`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="whitespace-nowrap">{items.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
