"use client";

import Image from "next/image";
import Login from "../ui/Login";
import GetStarted from "../ui/GetStarted";
import Link from "next/link";
import { useAuth } from "@/provider/AuthProvider";
import { useEffect, useRef, useState } from "react";
import CustomAvatar from "../dashboard/CustomAvatar";
import ExcelExportButton from "../ui/ExcelExportButton";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const { user, isLoading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const isDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickedOutside = (event) => {
      if (
        isDropdownRef.current &&
        !isDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickedOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickedOutside);
  }, []);
  return (
    <div className="bg-white backdrop:blur-3xl font-semibold px-8 py-4 border border-[#0e3b53]/20 flex items-center justify-between rounded-b-3xl sticky top-0 z-50">
      <div className="flex gap-3">
        <Image
          src="/logo.svg"
          width={50}
          height={50}
          alt="logo"
          className="flex items-center"
        />
        <h1 className="font-semibold text-2xl">MyMoney</h1>
      </div>
      <div className="flex gap-5">
        <Link href="/home">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contacts</Link>
        <Link href="/help">Help</Link>
      </div>
      <ExcelExportButton />
      <div className="flex gap-5 mr-10">
        {isLoading ? (
          <div className="w-4 h-4 rounded-full border-2 border-t-cynan animate-spin"></div>
        ) : !user ? (
          <div className="flex gap-5 mr-10">
            <Login />
            <GetStarted />
          </div>
        ) : (
          // LOGGED IN

          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-60 bg-amber-500 flex px-3 py-1 items-center gap-1.5 rounded-2xl cursor-pointer"
          >
            <div className="relative" ref={isDropdownRef}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-white/20 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all object-cover"
                />
              ) : (
                <CustomAvatar
                  name={user.name}
                  className="w-10 h-10 hover:border-cyan-400 transition-all hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                />
              )}

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl bg-[#f6f8fa] backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm text-white font-medium truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-cyan-400 transition-colors"
                  >
                    Edit Profile
                  </Link>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-black/80 ">{user.name}</span>
              <span className="font-normal text-gray-500 text-[12px]">
                {user.email}
              </span>
            </div>
            <span className="text-gray-500 ">
              <ChevronDown size={18} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
