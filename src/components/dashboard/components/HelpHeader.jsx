import React from "react";
import { Sparkles } from "lucide-react";

export default function HelpHeader({
  aiQuestion,
  setAiQuestion,
  handleAiAsk,
  aiLoading,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center justify-center space-x-2 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-semibold uppercase">
          <span>HELP CENTER</span>
        </div>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          How can we help you?
        </h1>
        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
          Find answers, learn how to use the platform, or get help managing your
          loan business.
        </p>
      </div>

      <section className="text-center space-y-4 max-w-3xl mx-auto py-2">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Need a quick answer?
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Ask our AI assistant about using the platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAiAsk()}
              placeholder="Ask something like: How do I mark a loan as paid?"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]"
            />
          </div>
          <button
            onClick={() => handleAiAsk()}
            disabled={aiLoading}
            className="px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm rounded-2xl transition-colors inline-flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50 shadow-sm"
          >
            {aiLoading ? (
              <span>AI is thinking...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ask AI</span>
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
