"use client"
import ProfileForm from "@/components/dashboard/profileupdate/ProfileForm";

export default function () {
  return (
    <div className=" bg-[#f6f8fa] flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="font-bold text-5xl ">Your Profile</h1>
      <h2 className="font-normal text-[18px] text-gray-500">
        Update your details to personalize your experience on MyMoney.
      </h2>
      <ProfileForm />
    </div>
  );
}
