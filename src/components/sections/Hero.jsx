import React from "react";
import PreviewRecordBox from "../ui/PreviewRecordBox";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-8 py-12 md:py-20 lg:py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Left Content Area */}
      <div className="w-full lg:max-w-xl text-center lg:text-left">
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.15]">
          <span className="block text-[#123E56]">Manage your credit,</span>
          <span className="block text-[#2A9D4B] mt-1">secure your growth</span>
        </h1>

        <div className="mt-5 flex justify-center lg:justify-start">
          <p className="font-sans text-base sm:text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed">
            Simple, Smart, and Secure. Say goodbye to paper books! Track your
            dues with just one tap and send automated payment reminders directly
            to your customers.
          </p>
        </div>

        <div className="w-full mt-8 flex justify-center lg:justify-start">
          <Link
            href="/register"
            className="inline-block px-6 py-3.5 text-base font-semibold text-white bg-[#26A257] rounded-[10px] shadow-[0_12px_24px_-6px_rgba(38,162,87,0.4)] hover:bg-[#15713a] hover:-translate-y-0.5 hover:scale-105 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Right Preview Box Area */}
      <div className="w-full lg:w-auto flex justify-center">
        <div className="w-full max-w-md lg:max-w-none">
          <PreviewRecordBox />
        </div>
      </div>
    </section>
  );
};

export default Hero;
