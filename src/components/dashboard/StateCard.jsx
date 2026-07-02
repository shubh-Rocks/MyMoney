import React from "react";

const StateCard = () => {
  return (
    <div className="flex bg-amber-600 gap-3 p-4 h-40 justify-between items-center">
      <div className="p-5 rounded-3xl bg-amber-200">
        <span>Total Lent Amount</span>
      </div>
      <div className="p-5 rounded-3xl bg-amber-200">
        <span>Total Pending Amount</span>
      </div>
      <div className="p-5 rounded-3xl bg-amber-200">
        <span>Today Due</span>
      </div>
      <div className="p-5 rounded-3xl bg-amber-200">
        <span>Over Due</span>
      </div>
    </div>
  );
};

export default StateCard;
