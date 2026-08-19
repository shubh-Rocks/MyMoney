"use client";
import React, { useEffect, useState } from "react";
import PieChartDefaultIndex from "@/components/dashboard/components/PieCharts";
import { Banknote, CreditCard, Landmark, Shield } from "lucide-react";
import { apiClient } from "@/lib/api.Client";

const RecentStatCard = () => {
  const [data, setData] = useState(null);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.paymentsMethods();
        setData(response.methods);
      } catch (error) {
        console.log("error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isloading) {
    return (
      <div className="bg-white w-full rounded-2xl p-6 text-center text-gray-400 border border-gray-100 shadow-sm animate-pulse">
        Loading payment statistics...
      </div>
    );
  }

  return (
    <div className="bg-white w-full rounded-2xl flex flex-col lg:flex-row items-center justify-between py-5 px-3 shadow-sm border border-gray-100 gap-6">
      {/* Left Section: Chart & Header */}
      <div className="flex items-center gap-3 w-full lg:w-auto lg:border-r-2 border-gray-200">
        <div className="">
          <PieChartDefaultIndex />
        </div>
        <div className="flex flex-col w-80">
          <h4 className="text-xl font-bold text-gray-900 ">
            Payment Method Breakdown
          </h4>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">
            ₹{data?.total?.toLocaleString("en-IN") || 0} collected this month
          </p>
        </div>
      </div>

      {/* Right Section: Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
        {/* UPI */}
        <div className="flex items-center gap-3.5 bg-gray-50 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="bg-[#b89ee1]/20 p-2.5 rounded-lg shrink-0">
            <Shield className="text-purple-700 w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              UPI
            </span>
            <span className="text-base font-bold text-gray-900 truncate">
              ₹{data?.UPI?.amount?.toLocaleString("en-IN") || 0}
            </span>
            <span className="text-[11px] font-medium text-gray-500">
              {data?.UPI?.percentages || 0}% of total
            </span>
          </div>
        </div>

        {/* CASH */}
        <div className="flex items-center gap-3.5 bg-gray-50 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="bg-[#f1bf68]/20 p-2.5 rounded-lg shrink-0">
            <Banknote className="text-yellow-600 w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Cash
            </span>
            <span className="text-base font-bold text-gray-900 truncate">
              ₹{data?.CASH?.amount?.toLocaleString("en-IN") || 0}
            </span>
            <span className="text-[11px] font-medium text-gray-500">
              {data?.CASH?.percentages || 0}% of total
            </span>
          </div>
        </div>

        {/* BANK TRANSFER */}
        <div className="flex items-center gap-3.5 bg-gray-50 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="bg-[#6ad9b4]/20 p-2.5 rounded-lg shrink-0">
            <Landmark className="text-[#296551] w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Bank
            </span>
            <span className="text-base font-bold text-gray-900 truncate">
              ₹{data?.BANK_TRANSFER?.amount?.toLocaleString("en-IN") || 0}
            </span>
            <span className="text-[11px] font-medium text-gray-500">
              {data?.BANK_TRANSFER?.percentages || 0}% of total
            </span>
          </div>
        </div>

        {/* CHEQUE */}
        <div className="flex items-center gap-3.5 bg-gray-50 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="bg-[#f17a7a]/20 p-2.5 rounded-lg shrink-0">
            <CreditCard className="text-rose-700 w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Cheque
            </span>
            <span className="text-base font-bold text-gray-900 truncate">
              ₹{data?.CHEQUE?.amount?.toLocaleString("en-IN") || 0}
            </span>
            <span className="text-[11px] font-medium text-gray-500">
              {data?.CHEQUE?.percentages || 0}% of total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentStatCard;
