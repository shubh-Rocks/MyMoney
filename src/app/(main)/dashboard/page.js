import ExcelExportButton from "@/components/dashboard/ExcelExportButton";
import QuickAddCard from "@/components/dashboard/QuickAddCard";
import StateCard from "@/components/dashboard/StateCard";
import VoiceAssistanceCard from "@/components/dashboard/VoiceAssistanceCard";

export default function () {
  return (
    <div className=" bg-[#f6f8fa] min-h-screen p-15">
      <StateCard />
      <QuickAddCard />
      <ExcelExportButton />
      <VoiceAssistanceCard />
    </div>
  );
}
