import React from "react";
import { CheckCircle2, ChevronRight, X } from "lucide-react";

export default function HelpModals({
  selectedCategory,
  setSelectedCategory,
  supportModalOpen,
  setSupportModalOpen,
  supportType,
  supportFormSubmitted,
  handleSupportSubmit,
  toastMessage,
}) {
  return (
    <>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-gray-800">
          <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
                  {React.createElement(selectedCategory.icon, {
                    className: "w-5 h-5",
                  })}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedCategory.title}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedCategory.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Articles in this category
              </h3>
              <div className="divide-y divide-gray-100">
                {selectedCategory.articles.map((art) => (
                  <div
                    key={art.id}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between hover:bg-gray-50 p-3 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#10B981] transition-colors">
                        {art.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {art.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0 ml-4">
                      <span className="text-xs text-gray-400">
                        {art.readTime}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 text-right">
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {supportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {supportType === "contact"
                    ? "Contact Support"
                    : "Report a Problem"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {supportType === "contact"
                    ? "Send us a message and we'll reply shortly."
                    : "Tell us what went wrong so we can fix it."}
                </p>
              </div>
              <button
                onClick={() => setSupportModalOpen(false)}
                className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {supportFormSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-gray-900">
                  Submitting your request...
                </h3>
                <p className="text-xs text-gray-500">
                  Please wait while we connect you with our team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="Shubh Mishra"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    defaultValue="shubh@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Message / Details
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe how we can help you..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]"
                  />
                </div>
                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSupportModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
