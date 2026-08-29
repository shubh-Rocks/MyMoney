import { apiClient } from "@/lib/api.Client";
import { createBorrowerWithLoanSchema } from "@/validations/borrower.validation";
import { X, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const FormModal = ({ isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);

    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      lentDate: formData.get("lentDate"),
      dueDate: formData.get("dueDate"),
      amount: formData.get("amount"),
      interestRate: formData.get("interestRate"),
      interestType: formData.get("interestType"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
    };

    const validatedFields = createBorrowerWithLoanSchema.safeParse(rawData);

    if (!validatedFields.success) {
      setFieldErrors(validatedFields.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }

    try {
      await apiClient.addBorrower(validatedFields.data);
      setLoading(false);

      setSuccessMessage("Borrower saved successfully!");
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage("");
        e.target.reset();
      }, 1500);
    } catch (error) {
      setLoading(false);
      setGeneralError(
        error.message || "Failed to save borrower. Please try again.",
      );
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-800">
                Add Borrower
              </h1>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
              >
                <X size={25} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Success Banner */}
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
                    Borrower Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Ramesh Mishra"
                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                  {fieldErrors.name && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {fieldErrors.name[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact (10 digits)
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {fieldErrors.phone[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {fieldErrors.email[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lending Amount (min 1000)
                  </label>
                  <input
                    name="amount"
                    type="number"
                    placeholder="Enter amount 100000"
                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                  {fieldErrors.amount && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {fieldErrors.amount[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Type
                  </label>
                  <select
                    name="interestType"
                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  >
                    <option value="SIMPLE">Simple Interest</option>
                    <option value="COMPOUND">Compound Interest</option>
                  </select>

                  {fieldErrors.interestType && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {fieldErrors.interestType[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    name="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="Enter interest rate 7%"
                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                  {fieldErrors.interestRate && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {fieldErrors.interestRate[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lent Date
                  </label>
                  <input
                    name="lentDate"
                    type="date"
                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                  {fieldErrors.lentDate && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {fieldErrors.lentDate[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    name="dueDate"
                    type="date"
                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  />
                  {fieldErrors.dueDate && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {fieldErrors.dueDate[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Address section */}
              <div className="pt-2">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3 border-b border-gray-100 pb-2">
                  Address Details
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street
                      </label>
                      <input
                        name="street"
                        type="text"
                        placeholder="MG Road"
                        className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                      {fieldErrors.street && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {fieldErrors.street[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        name="city"
                        type="text"
                        placeholder="Jabalpur"
                        className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                      {fieldErrors.city && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {fieldErrors.city[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        name="state"
                        type="text"
                        placeholder="Madhya Pradesh"
                        className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                      {fieldErrors.state && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {fieldErrors.state[0]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode
                      </label>
                      <input
                        name="pincode"
                        type="text"
                        placeholder="482001"
                        className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                      {fieldErrors.pincode && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {fieldErrors.pincode[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
                      : "Save Borrower"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
