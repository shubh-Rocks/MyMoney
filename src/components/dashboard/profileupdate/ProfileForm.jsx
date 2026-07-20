"use client";
import { apiCLient } from "@/lib/api.Client";
import { useAuth } from "@/provider/AuthProvider";
import React, { useEffect, useState } from "react";
import CustomAvatar from "../CustomAvatar";

const ProfileForm = () => {
  const { user, updateLocalUser, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await apiCLient.updateProfile({ name, phone });
      updateLocalUser({ ...user, name: name, phone: phone });

      alert("profile updated sucessfully!");
    } catch (error) {
      alert("Error:" + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-9 h-9 rounded-full border-4 border-t-cyan-400 animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;
  return (
    <div className="bg-white p-8 border border-[#0e3b53]/20 shadow-lg w-full max-w-md mx-auto rounded-3xl">
      <div className="flex justify-center items-center w-full gap-5">
        <div className="w-28 h-28">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-full h-full rounded-full border border-white/20 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all object-cover"
            />
          ) : (
            <CustomAvatar
              name={user.name}
              className="w-full h-full text-5xl hover:border-cyan-400 transition-all hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            />
          )}
        </div>
        <h1 className="font-bold text-2xl">{user.name}</h1>
      </div>
      <div className="mt-10">
        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className=" text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-xl px-4  py-2 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className=" text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-xl px-4  py-2 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="mt-10 bg-emerald-50 text-emerald-700 hover:bg-emerald-500  border-2 border-emerald-500 font-semibold py-2.5 rounded-xl transition-all disabled:cursor-not-allowed cursor-pointer"
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
