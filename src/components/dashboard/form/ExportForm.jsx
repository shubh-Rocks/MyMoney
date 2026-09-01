"use client";
import React, { useState } from "react";
import ExcelJs from "exceljs";
import { excelFormValidationSchema } from "@/validations/excelForm.validations";

const ExportForm = ({ setIsOpen }) => {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formObj = new FormData(e.currentTarget);

    const formData = {
      borrowerId: formObj.get("borrowerId")?.trim() || "",
      startDate: formObj.get("startDate")?.trim() || "",
      endDate: formObj.get("endDate")?.trim() || "",
      paymentType: formObj.get("paymentType") || "ALL",
    };

    // 1. Zod Validation
    const result = excelFormValidationSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0].message); // 'errors' (plural)
      return;
    }

    const { borrowerId, startDate, endDate, paymentType } = result.data;
    setIsLoading(true);

    try {
      // 2. Backend API ko call karke filtered data mangana
      const res = await fetch("/api/excel-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowerId, startDate, endDate, paymentType }),
      });

      const jsonResponse = await res.json();

      if (!res.ok) {
        throw new Error(jsonResponse.message || "Failed to fetch export data");
      }

      const records = jsonResponse.excelExport; // Jo API se data aaya

      // 3. ExcelJS Workbook Creation
      const workbook = new ExcelJs.Workbook();
      workbook.creator = "MyMoney App";
      const worksheet = workbook.addWorksheet("Loan Report");

      worksheet.columns = [
        { header: "Borrower Name", key: "borrowerName", width: 25 },
        { header: "Phone", key: "phone", width: 18 },
        { header: "Total Amount", key: "amount", width: 18 },
        { header: "Lent Date", key: "lentDate", width: 18 },
        { header: "Due Date", key: "dueDate", width: 18 },
        { header: "Status", key: "status", width: 15 },
      ];

      // Styling Header Row
      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "059669" },
      };
      worksheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      // 4. Rows Add Karna (Data Mapping)
      records.forEach((borrower) => {
        const loan = borrower.loans[0] || {}; // Pehla ya main loan row
        worksheet.addRow({
          borrowerName: borrower.name,
          phone: borrower.phone,
          amount: loan.amount || 0,
          lentDate: loan.lentDate
            ? new Date(loan.lentDate).toLocaleDateString()
            : "",
          dueDate: loan.dueDate
            ? new Date(loan.dueDate).toLocaleDateString()
            : "",
          status: loan.status || "N/A",
        });
      });

      // Borders add karna har cell par
      worksheet.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "D1D5DB" } },
            left: { style: "thin", color: { argb: "D1D5DB" } },
            bottom: { style: "thin", color: { argb: "D1D5DB" } },
            right: { style: "thin", color: { argb: "D1D5DB" } },
          };
        });
      });

      // 5. File Download Trigger karna browser mein
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `Loan-Report-${startDate}-to-${endDate}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);

      setIsOpen(false); // Modal close kar dena export ke baad
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong during export.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-3xl font-bold text-gray-800">Export Filters</h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 absolute right-5 top-2 hover:text-gray-600 font-bold text-2xl cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Borrower ID / Name
            </label>
            <input
              type="text"
              name="borrowerId"
              placeholder="Leave blank for all borrowers"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Type
            </label>
            <select
              name="paymentType"
              defaultValue="ALL"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
            >
              <option value="ALL">All Payment Types</option>
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-md shadow cursor-pointer disabled:opacity-50"
            >
              {loading ? "Exporting..." : "Download Excel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportForm;
