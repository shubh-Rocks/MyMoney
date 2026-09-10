import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-16 md:mt-24 mb-12 px-6 md:px-12 lg:px-20 border-t border-gray-200">
      {/* Top Section (Logo & Links) */}
      <div className="border-b border-gray-200 py-6 md:py-8 w-full flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo & Brand Name */}
        <div className="flex gap-3 items-center">
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

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base text-gray-600 font-medium">
          <Link href="/features" className="hover:text-blue-600 transition">
            Features
          </Link>
          <Link href="/mobile-app" className="hover:text-blue-600 transition">
            Mobile App
          </Link>
          <Link href="/pricing" className="hover:text-blue-600 transition">
            Pricing
          </Link>
          <Link href="/help" className="hover:text-blue-600 transition">
            Help center
          </Link>
        </div>
      </div>

      {/* Bottom Section (Copyright & Data Tagline) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left pt-6 text-gray-500 font-light text-xs sm:text-sm">
        <p>
          © 2026 MyMoney. Made for Indian shopkeepers and business owners, with
          love for their better cash flow.
        </p>
        <p className="shrink-0">Your data, always yours.</p>
      </div>
    </footer>
  );
};
export default Footer;
