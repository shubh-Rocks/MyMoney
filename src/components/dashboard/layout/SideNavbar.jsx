"use client";
import { navItems } from "@/lib/navConfig";
import { useAuth } from "@/provider/AuthProvider";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cross,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CustomAvatar from "../components/CustomAvatar";

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
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
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
    document.cookie = `sidebar-collapsed=${next};path=/; max-age=31536000`;
  };

  return (
    <aside
      className={`shrink-0 h-screen sticky top-0 bg-white border-r border-[#0e3b53]/20 flex flex-col justify-between font-semibold transition-all duration-300 ease-in-out${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex flex-col">
        {/* logo and titlee */}

        <div className="flex items-center gap-3 justify-between px-4 py-5 border-b border border-[#0e3b53]/10">
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
          <button
            onClick={toggleCollapsed}
            className={`flex items-center text-gray-500 text-sm cursor-pointer ${collapsed ? "justify-center px-1" : ""}`}
          >
            {collapsed ? <ChevronRight size={18} /> : <X size={18} />}
          </button>
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

      {/* user */}
      <div className="px-3 pb-4" ref={dropdownRef}>
        {isLoading ? (
          <div className="w-4 h-4 rounded-full border-2 border-t-cyan-500 animate-spin mx-auto" />
        ) : (
          <div className="relative">
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute bottom-14 w-56 rounded-xl bg-[#f6f8fa] border border-white/10 shadow-lg overflow-hidden z-50 left-0">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm text-black font-medium truncate">
                    {user?.profile?.fullName || user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-700 truncate">
                    {user?.email}
                  </p>
                </div>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-black hover:bg-white/5 hover:text-cyan-500"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}

            {/* User Profile Trigger Bar */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-2 py-2 rounded-xl cursor-pointer hover:bg-gray-100 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                />
              ) : (
                <CustomAvatar
                  fullName={user?.profile?.fullName}
                  className="w-9 h-9 shrink-0"
                />
              )}
              {!collapsed && (
                <>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-black/80 text-sm truncate">
                      {user?.profile?.fullName || user?.name || "User"}
                    </span>
                    <span className="text-gray-500 text-[11px] truncate">
                      {user?.email}
                    </span>
                  </div>
                  {isDropdownOpen ? (
                    <ChevronDown
                      size={16}
                      className="text-gray-500 ml-auto shrink-0"
                    />
                  ) : (
                    <ChevronUp
                      size={16}
                      className="text-gray-500 ml-auto shrink-0"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
