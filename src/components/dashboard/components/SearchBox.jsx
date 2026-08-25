import { Search } from "lucide-react";
import React from "react";

const SearchBox = () => {
  return (
    <div className="w-xl  flex items-center justify-center">
      <div className="relative w-full  max-w-xl">
        <span className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none ">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search borrower name or phone"
          className="w-xl h-15 text-lg text-black bg-gray-50 rounded-2xl border-2 border-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.15)] 
            focus:shadow-[0_4px_25px_rgba(16,185,129,0.3)] placeholder-gray-500 pl-14 outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBox;
