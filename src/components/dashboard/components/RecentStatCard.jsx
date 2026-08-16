import React from "react";

const RecentStatCard = () => {
  return (
    <div className="bg-white rounded-2xl flex py-3.5 px-3">
      <div className="flex gap-2 border-r-[1] border-gray-400">
        <div className=""></div>
        <div>
          <h4 className="text-xl font-semibold">Payment Method Breakdown</h4>
          <p className="text-gray-400 text-base">
            ₹9,42,600 collected this month
          </p>
        </div>
      </div>

      <div className="">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default RecentStatCard;
