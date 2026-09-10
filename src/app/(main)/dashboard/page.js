"use client";
import DashboardStatCard from "@/components/dashboard/components/DashboardStatCard";
import FormModal from "@/components/dashboard/form/FormModal";
import QuickAddCard from "@/components/dashboard/components/QuickAddCard";
import VoiceAssistanceCard from "@/components/dashboard/components/VoiceAssistanceCard";
import { useAuth } from "@/provider/AuthProvider";
import { useEffect, useState } from "react";
import SearchBox from "@/components/dashboard/components/SearchBox";
import KanbanBoard from "@/components/dashboard/components/KanbanBoard";

export default function DashboardPage() {
  const { user: rawUser } = useAuth();
  const user = rawUser?.data.user || rawUser?.user || rawUser;
  const userName = user?.profile?.fullName || user?.name || "User";
  const [greetings, setGreetings] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) {
      setGreetings("Good Morning");
    } else if (hours < 16) {
      setGreetings("Good Afternoon");
    } else {
      setGreetings("Good Evening");
    }

    const date = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = now.toLocaleDateString("en-GB", date);
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className="bg-[#f6f8fa] min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Greeting Section */}
      <div className="mb-6">
        <h2 className="font-bold text-2xl sm:text-3xl text-black tracking-tight">
          {greetings}, {userName}
        </h2>
        <p className="text-gray-500 text-sm sm:text-base font-serif mt-1">
          Here's what's happening with your udhaar today—{currentDate}
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="mb-6">
        <DashboardStatCard />
      </div>

      {/* Interactive Toolbar (Search, Quick Add, Voice Assistant) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 my-6">
        <div className="w-full lg:flex-1">
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
          <QuickAddCard />
          <VoiceAssistanceCard />
        </div>
      </div>

      {/* Modal & Kanban Board */}
      <FormModal />
      <div className="w-full overflow-x-auto">
        <KanbanBoard searchTerm={searchTerm} />
      </div>
    </div>
  );
}
