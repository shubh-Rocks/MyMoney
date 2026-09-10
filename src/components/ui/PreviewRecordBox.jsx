import React from "react";

const PreviewRecordBox = () => {
  return (
    <div className="flex items-center justify-center w-full max-w-md mx-auto font-sans px-4 sm:px-0 pb-12 sm:pb-0">
      <div className="relative w-full">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 pb-2 relative z-0">
          <div className="absolute top-0 bottom-0 left-0 w-1 border-l-[3px] border-dotted border-gray-200"></div>

          {/* Header */}
          <div className="flex justify-between items-center px-6 sm:px-7 pt-6 pb-4">
            <h2 className="text-xs sm:text-sm font-bold text-gray-400 tracking-wider">
              MY ACCOUNTS
            </h2>
            <button className="text-gray-300 font-bold text-xl tracking-widest leading-none mb-2">
              ...
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* Stats Section */}
          <div className="flex justify-between items-end px-6 sm:px-7 py-5">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 mb-1 tracking-wide">
                TOTAL TO COLLECT
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#BE801E]">
                ₹84,200
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 mb-1 tracking-wide">
                RECEIVED THIS MONTH
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#147045]">
                ₹31,500
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* User List */}
          <div className="px-6 sm:px-7 pt-2 pb-2">
            {/* List Item 1 */}
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#186D90] text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                  RK
                </div>
                <div>
                  <p className="font-bold text-[#0B2536] text-sm sm:text-[15px]">
                    Ramesh Logistics
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                    Last paid: 3 days ago
                  </p>
                </div>
              </div>
              <div className="bg-[#F6ECD5] text-[#AA741F] px-2.5 sm:px-3 py-1 rounded-xl font-bold text-xs sm:text-sm">
                ₹4,500
              </div>
            </div>

            {/* List Item 2 */}
            <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1C9653] text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                  SV
                </div>
                <div>
                  <p className="font-bold text-[#0B2536] text-sm sm:text-[15px]">
                    Suresh Vermaa
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                    Last paid: today
                  </p>
                </div>
              </div>
              <div className="bg-[#E4F4EB] text-[#147045] px-2.5 sm:px-3 py-1 rounded-xl font-bold text-xs sm:text-sm">
                Paid Up
              </div>
            </div>

            {/* List Item 3 */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#B1791C] text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                  MT
                </div>
                <div>
                  <p className="font-bold text-[#0B2536] text-sm sm:text-[15px]">
                    Manoj Traders
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                    Last paid: 12 din pehle
                  </p>
                </div>
              </div>
              <div className="bg-[#F6ECD5] text-[#AA741F] px-2.5 sm:px-3 py-1 rounded-xl font-bold text-xs sm:text-sm">
                ₹12,000
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-24 left-2 sm:-bottom-12 sm:-left-10 w-48 sm:w-56 bg-white border-[5px] sm:border-[6px] border-[#103E57] rounded-[1.75rem] sm:rounded-[2rem] shadow-xl z-50 px-3 pb-3">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gray-300"></div>

          {/* Green Alert Box */}
          <div className="bg-[#E9F5EB] rounded-xl p-3 mt-4">
            <p className="font-bold text-[#147045] text-xs sm:text-[13px] mb-1 flex items-center gap-1">
              <span>🔔</span>Reminder Sent
            </p>
            <p className="text-xs sm:text-[13px] text-[#4F6C5B] leading-tight pr-1">
              WhatsApp reminder sent to Ramesh for ₹4,500.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewRecordBox;
