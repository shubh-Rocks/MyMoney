"use client";

import { useState } from "react";
import Image from "next/image";
import Login from "../ui/Login";
import GetStarted from "../ui/GetStarted";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Mobile menu icons ke liye

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white font-semibold px-4 md:px-8 py-4 border-b border-[#0e3b53]/20 flex items-center justify-between rounded-b-3xl sticky top-0 z-50 shadow-sm">
      {/* 1. Logo Section */}
      <div className="flex items-center gap-3">
        <Image
          src="/logo.svg"
          width={40}
          height={40}
          alt="logo"
          className="md:w-[50px] md:h-[50px]"
        />
        <h1 className="font-semibold text-xl md:text-2xl text-[#0e3b53]">
          MyMoney
        </h1>
      </div>

      {/* 2. Desktop Navigation Links (Hidden on Mobile) */}
      <div className="hidden md:flex gap-6 text-slate-600">
        <Link href="/home" className="hover:text-blue-600 transition">
          Home
        </Link>
        <Link href="/about" className="hover:text-blue-600 transition">
          Recent Payments
        </Link>
        <Link href="/contact" className="hover:text-blue-600 transition">
          About Us
        </Link>
        <Link href="/help" className="hover:text-blue-600 transition">
          Help
        </Link>
      </div>

      {/* 3. Desktop Auth Buttons (Hidden on Mobile) */}
      <div className="hidden md:flex items-center gap-4 mr-4">
        <Login />
        <GetStarted />
      </div>

      {/* 4. Mobile Hamburger Menu Button (Visible only on Mobile) */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-slate-700 focus:outline-none p-1"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* 5. Mobile Dropdown Menu (Opens when hamburger is clicked) */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-6 px-6 flex flex-col gap-4 md:hidden transition-all">
          <Link
            href="/home"
            onClick={() => setIsOpen(false)}
            className="text-slate-700 hover:text-blue-600 py-1 border-b border-slate-100"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="text-slate-700 hover:text-blue-600 py-1 border-b border-slate-100"
          >
            Recent Payments
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="text-slate-700 hover:text-blue-600 py-1 border-b border-slate-100"
          >
            About Us
          </Link>
          <Link
            href="/help"
            onClick={() => setIsOpen(false)}
            className="text-slate-700 hover:text-blue-600 py-1 border-b border-slate-100"
          >
            Help
          </Link>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <div onClick={() => setIsOpen(false)}>
              <Login />
            </div>
            <div onClick={() => setIsOpen(false)}>
              <GetStarted />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
