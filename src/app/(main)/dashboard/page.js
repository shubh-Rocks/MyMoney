"use client";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import FormModal from "@/components/dashboard/form/FormModal";
import QuickAddCard from "@/components/dashboard/QuickAddCard";
import VoiceAssistanceCard from "@/components/dashboard/VoiceAssistanceCard";

export default function () {
  return (
    <div className=" bg-[#f6f8fa] min-h-screen py-10 px-5">
      <DashboardStatCard/>
      <div className="flex">
        <QuickAddCard />
        <VoiceAssistanceCard />
      </div>
      <FormModal />
    </div>
  );
}
