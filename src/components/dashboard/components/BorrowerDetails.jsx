"use client";

import { apiClient } from "@/lib/api.Client";
import React, { useEffect, useState } from "react";

const BorrowerDetails = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="bg-white">
      {/* Payments */}

      {loading ? (
        <p>Loading...</p>
      ) : (
        payments.map((payment) => (
          <div key={payment.id}>
            <p>{payment.loan.borrower.name}</p>
            <p>{payment.amount}</p>
            <p>{payment.paymentMethod}</p>
          </div>
        ))
      )}

      {/* Pagination */}

      <div className="flex mt-3 gap-3">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={!pagination?.hasPreviousPage || loading}
          className="p-2 font-semibold bg-emerald-600 rounded-[5px] text-white text-sm"
        >
          Prev
        </button>

        <span>
          Page {pagination?.currentPage} of {pagination?.totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!pagination?.hasNextPage || loading}
          className="p-2 font-semibold bg-emerald-600 rounded-[5px] text-white text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BorrowerDetails;
