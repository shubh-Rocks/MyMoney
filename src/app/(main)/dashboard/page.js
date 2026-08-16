"use client";
import DashboardStatCard from "@/components/dashboard/components/DashboardStatCard";
import FormModal from "@/components/dashboard/form/FormModal";
import QuickAddCard from "@/components/dashboard/components/QuickAddCard";
import VoiceAssistanceCard from "@/components/dashboard/components/VoiceAssistanceCard";

export default function () {
  return (
    <div className="bg-[#f6f8fa] min-h-screen">
      <DashboardStatCard />
      <div className="flex mt-5 gap-5 justify-end">
        <QuickAddCard />
        <VoiceAssistanceCard />
      </div>
      <FormModal />
    </div>
  );
}
