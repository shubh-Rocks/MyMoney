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
    </div>
  );
}
