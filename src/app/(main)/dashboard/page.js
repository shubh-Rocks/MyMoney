import QuickAddCard from "@/components/dashboard/QuickAddCard";
import StateCard from "@/components/dashboard/StateCard";
import VoiceAssistanceCard from "@/components/dashboard/VoiceAssistanceCard";

export default function () {
  return (
    <div className=" bg-[#f6f8fa] min-h-screen py-10 px-5">
      <StateCard />
      <div className="flex">
        <QuickAddCard />
        <VoiceAssistanceCard />
      </div>
    </div>
  );
}
