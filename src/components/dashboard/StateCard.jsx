import { IndianRupeeIcon } from "lucide-react";
import React from "react";

const StateCard = () => {
  return (
    <div className="flex bg-amber-600 gap-3 p-4 h-40 justify-between items-center">
      <div className="p-5 rounded-3xl bg-amber-200 flex flex-col gap-1.5">
        <span>Total Lent Amount</span>
        <span className="flex items-center font-bold text-2xl">
          <IndianRupeeIcon size={16} />
          40500
        </span>
      </div>
      <div className="p-5 rounded-3xl bg-amber-200 flex flex-col gap-1.5">
        <span>Total Pending Amount</span>
        <span className="flex">
          <IndianRupeeIcon size={16} />
          8500
        </span>
      </div>
      <div className="p-5 rounded-3xl bg-amber-200 flex flex-col gap-1.5">
        <span>Today Due</span>
        <span className="flex">
          <IndianRupeeIcon size={16} />
          8500
        </span>
      </div>
      <div className="p-3 rounded-3xl bg-amber-200 flex flex-col gap-1.5">
        <span>Over Due</span>
        <span className="flex">
          <IndianRupeeIcon size={16} />
          38500
        </span>
      </div>
    </div>
  );
};

export default StateCard;
