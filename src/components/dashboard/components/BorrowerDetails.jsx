"use client";

import { apiClient } from "@/lib/api.Client";
import React, { useEffect, useState } from "react";

const BorrowerDetails = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState("All");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchPayment = async (pageNumber) => {
    try {
      setLoading(true);
      const data = await apiClient.recentPayments(pageNumber);
      setPayments(data.recentPay.payments);
      setPagination(data.recentPay.pagination);
    } catch (error) {
      console.error("failed to fetch the payments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayment(page);
  }, [page]);

  const filteredPayment = payments.filter((payment) => {
    let matchesTab = true;
    const itemDate = new Date(payment.paymentDate);
    const today = new Date();

    if (selectedTab === "Today") {
      matchesTab = itemDate.toDateString() === today.toDateString();
    } else if (selectedTab === "This Week") {
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay()),
      );
      matchesTab = itemDate >= startOfWeek;
    } else if (selectedTab === "This Month") {
      matchesTab =
        itemDate.getMonth() === new Date().getMonth() &&
        itemDate.getFullYear() === new Date().getFullYear();
    }

    const matchesPaymentMethod = paymentMethodFilter
      ? payment.paymentMethod === paymentMethodFilter
      : true;

    const matchesStatus = statusFilter
      ? payment.loan?.status === statusFilter
      : true;

    return matchesTab && matchesPaymentMethod && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-5 mx-5">
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl border-b border-gray-100 bg-white">
        <div className="flex items-center bg-gray-100 p-1 rounded-xl overflow-x-auto">
          {["All", "Today", "This Week", "This Month"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedTab === tab
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="">All Payment Methods</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="UPI">UPI</option>
            <option value="CHEQUE">Cheque</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="ACTIVE">Active</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="font-bold text-2xl text-gray-900">All Payments</h2>
          <p className="text-sm text-gray-500 font-medium">
            184 payments this month ·{" "}
            <span className="text-emerald-600 font-semibold">
              ₹9,42,600 collected
            </span>
          </p>
        </div>

        <div className="overflow-x-auto w-full rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="py-4 px-6">Borrower</th>
                <th className="py-4 px-6">Phone No.</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Notes</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm text-gray-700 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-400 font-medium"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading payments...
                    </div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-400 font-medium"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : filteredPayment.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-400 font-medium"
                  >
                    No payments found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredPayment.map((payment, index) => (
                  <tr
                    key={payment._id || index}
                    className="hover:bg-gray-50/50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {payment.loan?.borrower?.name || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {payment.loan?.borrower?.phone || "N/A"}
                    </td>
                    <td className="py-4 px-6 font-semibold text-emerald-600">
                      ₹{payment.amount}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {payment.paymentDate}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          payment.loan?.status?.toLowerCase() === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {payment.loan?.status || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 truncate max-w-xs">
                      {payment.notes || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={!pagination?.hasPreviousPage || loading}
            className="px-4 py-2 font-medium bg-white border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500 font-medium">
            Page{" "}
            <span className="text-gray-900 font-semibold">
              {pagination?.currentPage || 1}
            </span>{" "}
            of{" "}
            <span className="text-gray-900 font-semibold">
              {pagination?.totalPages || 1}
            </span>
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!pagination?.hasNextPage || loading}
            className="px-4 py-2 font-medium bg-emerald-600 rounded-lg text-white text-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowerDetails;
