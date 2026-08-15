"use client";
import { useAuth } from "@/provider/AuthProvider";
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

  return <aside></aside>;
};

export default Sidebar;
