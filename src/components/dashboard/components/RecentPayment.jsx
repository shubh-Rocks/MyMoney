import React from "react";
import RecentStatCard from "./RecentStatCard";
import BorrowerDetails from "./BorrowerDetails";

const RecentPayment = () => {
  return (
    <div className="flex flex-col gap-5">
      <RecentStatCard />
      <BorrowerDetails />
    </div>
  );
};

export default RecentPayment;
