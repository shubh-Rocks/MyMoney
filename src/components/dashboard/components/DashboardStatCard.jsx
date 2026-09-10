"use client";
import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { apiClient } from "@/lib/api.Client";
import { AlertTriangle, Calendar, Clock, DollarSign } from "lucide-react";

const DashboardStatCard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.BorrowersLoanSummary();
        setSummaryData(response.BorrowersLoanSummary);
      } catch (error) {
        console.error("error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse h-32 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="w-24 h-4 bg-slate-200 rounded"></div>
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="w-32 h-8 bg-slate-200 rounded"></div>
            <div className="w-20 h-3 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const cardConfig = [
    {
      id: 1,
      title: "Total Lent Amount",
      amount: summaryData?.totalLentamount?._sum?.amount || 0,
      subtitle: `across ${summaryData?.activeBorrowers || 0} active borrowers`,
      icon: <DollarSign className="text-blue-600 text-xl" />,
      iconBg: "bg-blue-50",
    },
    {
      id: 2,
      title: "Total Pending Amount",
      amount: summaryData?.totalPendingAmount?._sum?.remainingAmount || 0,
      subtitle: "pending collection balance",
      icon: <Clock className="text-emerald-600 text-xl" />,
      iconBg: "bg-emerald-50",
    },
    {
      id: 3,
      title: "Today Due",
      amount: summaryData?.todayDueamount || 0,
      subtitle: `${summaryData?.todayborrowers || 0} borrowers due today`,
      icon: <Calendar className="text-amber-600 text-xl" />,
      iconBg: "bg-amber-50",
    },
    {
      id: 4,
      title: "Overdue",
      amount: summaryData?.overdueamount || 0,
      subtitle: `${summaryData?.overdueBorrowers || 0} borrowers need a reminder`,
      icon: <AlertTriangle className="text-rose-600 text-xl" />,
      iconBg: "bg-rose-50",
      textColor: "text-rose-600",
      cardBg: "bg-rose-100/20",
      border: "border",
      borderColor: "border-rose-400",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cardConfig.map((card) => (
          <StatCard
            key={card.id}
            title={card.title}
            amount={card.amount}
            subtitle={card.subtitle}
            icon={card.icon}
            iconBg={card.iconBg}
            textColor={card.textColor}
            cardBg={card.cardBg}
            border={card.border}
            borderColor={card.borderColor}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStatCard;
