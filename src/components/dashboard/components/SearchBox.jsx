import { Search } from "lucide-react";

const SearchBox = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-xl">
        {/* Search Icon */}
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 sm:pl-5 pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </span>

        {/* Search Input */}
        <input
          type="text"
          value={searchTerm || ""}
          placeholder="Search borrower name or phone"
          className="w-full h-12 sm:h-14 text-base sm:text-lg text-black bg-gray-50 rounded-2xl border-2 border-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.15)] focus:shadow-[0_4px_25px_rgba(16,185,129,0.3)] placeholder-gray-400 pl-12 sm:pl-14 pr-4 outline-none transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBox;
