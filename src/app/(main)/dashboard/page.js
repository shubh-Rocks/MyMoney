"use client";
import DashboardStatCard from "@/components/dashboard/components/DashboardStatCard";
import FormModal from "@/components/dashboard/form/FormModal";
import QuickAddCard from "@/components/dashboard/components/QuickAddCard";
import VoiceAssistanceCard from "@/components/dashboard/components/VoiceAssistanceCard";
import { useAuth } from "@/provider/AuthProvider";
import { useEffect, useState } from "react";
import SearchBox from "@/components/dashboard/components/SearchBox";

export default function () {
  const { user: rawUser } = useAuth();
  const user = rawUser?.data.user || rawUser?.user || rawUser;
  const [greetings, setGreetings] = useState("");
  const [currentDate, setCurrentDate] = useState("");
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
    <div className="bg-[#f6f8fa] min-h-screen">
      <div className="my-3.5">
        <h2 className=" font-bold font-stretch-100% text-3xl text-black ">
          {greetings} , {user?.profile?.fullName || user?.name || "User"}
        </h2>
        <p className="text-gray-500 text-base font-serif">
          Here's what's happening with your udhaar today—{currentDate}
        </p>
      </div>
      <DashboardStatCard />
      <div className="flex mt-5 gap-5 justify-evenly">
        <SearchBox />
        <QuickAddCard />
        <VoiceAssistanceCard />
      </div>
      <FormModal />
    </div>
  );
}
