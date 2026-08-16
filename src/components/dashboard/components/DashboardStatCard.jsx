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
        console.log(response.BorrowersLoanSummary);
        setSummaryData(response.BorrowersLoanSummary);
      } catch (error) {
        console.error("error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  if (loading) return <div className="p-6">Loading dashboabrd...</div>;

  const cardConfig = [
    {
      id: 1,
      title: "Total Lent Amount",
      amount: summaryData?.totalLentamount?._sum?.amount || 0,
      subtitle: `across ${summaryData?.activeBorrowers || 0} active borrowers`,
      icon: <DollarSign className=" text-blue-600 text-xl" />,
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
    <div className=" bg-[#f6f8fa] ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
