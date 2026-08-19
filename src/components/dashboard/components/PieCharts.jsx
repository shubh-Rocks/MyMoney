"use client";
import { apiClient } from "@/lib/api.Client";
import { useEffect, useState } from "react";
import { Pie, PieChart, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#6D28D9","#F59E0B", "#10B981", "#EF4444"];

export default function PaymentPieChart({ isAnimationActive = true }) {
  const [chartData, setChartData] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        const result = await apiClient.paymentsMethods();

        const formattedData = [
          {
            name: "UPI",
            value: result.methods.UPI.count,
          },
          {
            name: "CASH",
            value: result.methods.CASH.count,
          },
          {
            name: "BANK_TRANSFER",
            value: result.methods.BANK_TRANSFER.count,
          },
          {
            name: "CHEQUE",
            value: result.methods.CHEQUE.count,
          },
        ];

        const total = formattedData.reduce((acc, curr) => acc + curr.value, 0);

        setTotalPayments(total);
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentMethods();
  }, []);

  if (loading) {
    return (
      <div className="w-24 h-24 flex items-center justify-center text-xs text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative w-40 h-38 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            innerRadius={35}
            cornerRadius={3}
            isAnimationActive={isAnimationActive}
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-lg font-bold text-gray-900 leading-none">
          {totalPayments}
        </span>
        <span className="text-[10px] text-gray-400 mt-0.5">payments</span>
      </div>
    </div>
  );
}
