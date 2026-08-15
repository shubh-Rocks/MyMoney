"use client";

import Image from "next/image";
import Login from "../ui/Login";
import GetStarted from "../ui/GetStarted";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-white font-semibold px-8 py-4 border border-[#0e3b53]/20 flex items-center justify-between rounded-b-3xl sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Image src="/logo.svg" width={50} height={50} alt="logo" />
        <h1 className="font-semibold text-2xl">MyMoney</h1>
      </div>
      <div className="flex gap-5">
        <Link href="/home">Home</Link>
        <Link href="/about">Recent Payments</Link>
        <Link href="/contact">About Us</Link>
        <Link href="/help">Help</Link>
      </div>
      <div className="flex gap-5 mr-10">
        <Login />
        <GetStarted />
      </div>
    </div>
  );
};

export default Navbar;
