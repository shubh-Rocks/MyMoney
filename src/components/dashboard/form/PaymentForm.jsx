import { apiClient } from "@/lib/api.Client";
import { loanPaymentSchema } from "@/validations/loan.Payments.validation";
import { X, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

const PaymentForm = ({ loanId, borrowerId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    loanId: "",
    borrowerId: "",
  });

  useEffect(() => {
    setFormData({
      loanId: loanId || "",
      borrowerId: borrowerId || "",
    });
  }, [loanId, borrowerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError("");
    setSuccessMessage("");

    const data = new FormData(e.currentTarget);

    const rawData = {
      loanId: data.get("loanId"),
      borrowerId: data.get("borrowerId"),
      amount: data.get("amount"),
      paymentDate: data.get("paymentDate"),
      paymentMethod: data.get("paymentMethod"),
      notes: data.get("notes"),
    };

    const validatedFields = loanPaymentSchema.safeParse(rawData);

    if (!validatedFields.success) {
      setFieldErrors(validatedFields.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      await apiClient.addLoanPayment(validatedFields.data);
      setLoading(false);
      setSuccessMessage("Payment saved successfully!");

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      setLoading(false);
      setGeneralError(
        error.message || "Failed to add payment. Please try again.",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Add Payment</h1>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
          >
            <X size={25} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-medium flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              {successMessage}
            </div>
          )}

          {/* General Error Banner */}
          {generalError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
              {generalError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan ID
              </label>
              <input
                name="loanId"
                type="number"
                readOnly
                value={formData.loanId}
                onChange={(e) =>
                  setFormData({ ...formData, loanId: e.target.value })
                }
                className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
              {fieldErrors.loanId && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {fieldErrors.loanId[0]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Borrower ID
              </label>
              <input
                name="borrowerId"
                type="number"
                readOnly
                value={formData.borrowerId}
                onChange={(e) =>
                  setFormData({ ...formData, borrowerId: e.target.value })
                }
                className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
              {fieldErrors.borrowerId && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {fieldErrors.borrowerId[0]}
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                name="amount"
                type="number"
                placeholder="Enter payment amount"
                className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
              {fieldErrors.amount && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {fieldErrors.amount[0]}
                </p>
              )}
            </div>

            {/* Payment Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                name="paymentDate"
                type="date"
                className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
              {fieldErrors.paymentDate && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {fieldErrors.paymentDate[0]}
                </p>
              )}
            </div>

            {/* Payment Method Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              >
                <option value="UPI">UPI</option>
                <option value="CASH">CASH</option>
                <option value="BANK_TRANSFER">BANK TRANSFER</option>
                <option value="CHEQUE">CHEQUE</option>
              </select>
              {fieldErrors.paymentMethod && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {fieldErrors.paymentMethod[0]}
                </p>
              )}
            </div>

            {/* Notes Field */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <input
                name="notes"
                type="text"
                placeholder="First payment or second installment"
                className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
              {fieldErrors.notes && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {fieldErrors.notes[0]}
                </p>
              )}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || successMessage}
              className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 cursor-pointer transition shadow-sm disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : successMessage
                  ? "Saved!"
                  : "Add payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
