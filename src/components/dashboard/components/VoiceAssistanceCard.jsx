import { Mic } from "lucide-react";

export default function VoiceAssistanceCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3.5 cursor-pointer hover:border-blue-500 hover:shadow-md transition">
      <div className="relative w-11 h-11 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
        <span className="absolute -inset-1 rounded-full border-[1.5px] border-blue-500 opacity-40 animate-ping" />
        <Mic size={18} />
      </div>
      <div>
        <h4 className="text-[13.5px] font-bold">Voice Assistant</h4>
        <span className="text-[11.5px] text-slate-400">
          &quot;Rahul gives 5000 rupees &quot; — try it
        </span>
      </div>
    </div>
  );
}
