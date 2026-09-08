"use client";

import React, { useEffect, useState } from "react";
import {
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { Info } from "lucide-react";
import { apiClient } from "@/lib/api.Client";

export default function CashFlowChart() {
  const [timeRange, setTimeRange] = useState("30D");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(0);
  useEffect(() => {
    const fetchCashFlow = async () => {
      try {
        setLoading(true);
        setError(null);

        const range = Number(timeRange.replace("D", ""));

        const response = await apiClient.getCashFlowForecast(range);

        if (!response?.success) {
          throw new Error(
            response?.error || "Failed to fetch cash flow forecast",
          );
        }

        const forecastData = response.data;

        const actualData = forecastData.historical.dailyCollections;
        const forecast = forecastData.forecast;

        // Actual + forecast ko chart format me convert karna
        const actualChartData = actualData.map((item) => ({
          day: item.date,
          actual: item.amount,
          forecast: null,
          lower: null,
          upper: null,
        }));

        const forecastChartData = forecast.map((item) => ({
          day: item.date,
          actual: null,
          forecast: item.predictedCollection,
          lower: item.lowerBound,
          upper: item.upperBound,
        }));

        const chartData = [...actualChartData, ...forecastChartData];

        setData(chartData);

        const totalForecast = forecast.reduce(
          (sum, item) => sum + item.predictedCollection,
          0,
        );

        setSummary(totalForecast);
      } catch (err) {
        console.error("Cash flow frontend error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCashFlow();
  }, [timeRange]);
  if (loading) {
    return (
      <div className="w-full max-w-3xl p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="h-72 flex items-center justify-center text-gray-500">
          Generating AI forecast...
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full max-w-3xl p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="h-72 flex items-center justify-center text-red-500">
          Failed to load cash flow forecast.
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="w-full max-w-5xl space-y-3">
        <h1 className="text-4xl font-bold">AI INSIGHT</h1>
        <p className="font-medium text-gray-500 text-base">
          Understand your business, predict collections, and take smarter
          actions.
        </p>
      </div>

      <div className="w-full max-w-5xl p-6 bg-white rounded-3xl border border-gray-100 shadow-sm font-sans mx-auto mt-10">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Cash Flow Forecast
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Expected collections based on active loans and historical payment
              behavior.
            </p>
          </div>

          {/* Time Toggle Buttons */}
          <div className="bg-gray-100 p-1 rounded-full flex space-x-1 text-sm font-medium text-gray-600">
            {["30D", "60D", "90D"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  timeRange === range
                    ? "bg-white text-gray-900 shadow-sm"
                    : "hover:text-gray-900 text-gray-500"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 text-sm text-gray-600 my-6">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-0.5 bg-emerald-600 inline-block rounded-full"></span>
            <span>Actual Collection</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-sky-600 inline-block"></span>
            <span>AI Forecast</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-2 bg-sky-100 inline-block rounded-sm"></span>
            <span>Forecast Range</span>
          </div>
        </div>

        {/* Chart Component */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F3F4F6"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickFormatter={(value) => `₹${value / 1000}K`}
                domain={[0, 12000]}
                ticks={[0, 3000, 6000, 9000, 12000]}
              />
              <Tooltip />

              {/* Shaded Range Area (Confidence Interval) */}
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="#E0F2FE"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="#FFFFFF"
                fillOpacity={1}
              />

              {/* Actual Collection Area Fill & Line */}
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#059669"
                strokeWidth={2.5}
                fill="url(#actualGradient)"
              />

              {/* AI Forecast Dashed Line */}
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#0284C7"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={false}
              />

              {/* Gradient Definition */}
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Insight */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-700">
          <span>
            AI expects approximately{" "}
            <strong className="text-gray-900 font-semibold">₹2.14L</strong> in
            collections over the next 30 days.
          </span>
          <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
