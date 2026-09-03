import React, { useState } from "react";
import { ChevronRight, ChevronDown, Send } from "lucide-react";

export default function HelpCategoriesGrid({
  helpCategories,
  faqList,
  setSelectedCategory,
  setSupportType,
  setSupportModalOpen,
}) {
  return (
    <div className="space-y-16">
      {/* Categories Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Browse by Category
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Explore all documentation topics structured for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpCategories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="bg-white rounded-2xl p-6 border border-gray-200/85 shadow-sm hover:shadow-md hover:border-[#10B981] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-[#10B981]/10 text-gray-700 group-hover:text-[#10B981] flex items-center justify-center mb-4 transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#10B981] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 group-hover:text-gray-600">
                  <span className="font-medium">{cat.count} articles</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#10B981]" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Quick answers to common questions about loans, payments, and system
            features.
          </p>
        </div>

        <div className="space-y-4">
          {faqList.map((faq, idx) => {
            const [isOpen, setIsOpen] = useState(false);
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full p-5 text-left font-semibold text-gray-900 flex items-center justify-between hover:bg-gray-50/80 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#10B981]/10 text-[#10B981]" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-gray-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Support CTA Section */}
      <section className="bg-gradient-to-r from-emerald-50 via-white to-blue-50 rounded-3xl p-8 sm:p-12 border border-emerald-100 shadow-sm text-center space-y-6">
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Still need help?
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Can't find what you're looking for? Our support team is here to
            help.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              setSupportType("contact");
              setSupportModalOpen(true);
            }}
            className="px-6 py-3.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold transition-colors shadow-sm inline-flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Contact Support</span>
          </button>

          <button
            onClick={() => {
              setSupportType("report");
              setSupportModalOpen(true);
            }}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold transition-colors shadow-sm"
          >
            Report a Problem
          </button>
        </div>
      </section>
    </div>
  );
}
