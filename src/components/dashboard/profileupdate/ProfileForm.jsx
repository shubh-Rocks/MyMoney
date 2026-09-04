"use client";
import { apiClient } from "@/lib/api.Client";
import { useAuth } from "@/provider/AuthProvider";
import React, { useEffect, useState } from "react";
import CustomAvatar from "@/components/dashboard/components/CustomAvatar";
import { updateProfileSchema } from "@/validations/profile.validation";

const ProfileForm = () => {
  const { user, updateLocalUser, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [isFetching, setIsFetching] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await apiClient.getProfileInfo();

        const profileData = response.method || response.data || response;

        if (profileData) {
          setName(profileData.fullName || profileData.name || "");
          setEmail(profileData.email || "");
          setPhone(profileData.phone || "");
          setGender(profileData.gender || "");
          setBusinessName(
            profileData.businessName || profileData.bussinessName || "",
          );
          setIsEmailVerified(profileData.isEmailVerified || false);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setGeneralError("Failed to load profile details.");
      } finally {
        setIsFetching(false);
      }
    }
    fetchProfileData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");

    const rawData = {
      fullName: name,
      email: email,
      phone: phone,
      gender: gender,
      bussinessName: businessName,
    };

    const validatedFields = updateProfileSchema.safeParse(rawData);

    if (!validatedFields.success) {
      setFieldErrors(validatedFields.error.flatten().fieldErrors);
      return;
    }

    setIsUpdating(true);

    try {
      await apiClient.updateProfile({
        name,
        email,
        phone,
        gender,
        businessName,
      });

      updateLocalUser({
        ...user,
        name,
        phone,
        gender,
        businessName,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      setGeneralError(error.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-9 h-9 rounded-full border-4 border-t-cyan-400 animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-white p-8 border border-[#0e3b53]/20 shadow-lg w-full max-w-md mx-auto rounded-3xl">
      <div className=" flex justify-center items-center w-full gap-5">
        <div className="w-28 h-28">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-full h-full rounded-full border border-white/20 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all object-cover"
            />
          ) : (
            <CustomAvatar
              name={name || user.name}
              className="w-full h-full text-5xl hover:border-cyan-400 transition-all hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            />
          )}
        </div>
        <h1 className="font-bold text-2xl">{name || user.name}</h1>
      </div>

      {generalError && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 p-2 rounded-lg text-center">
          {generalError}
        </p>
      )}

      <div className="mt-6">
        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
            />
            {fieldErrors.fullName && (
              <span className="text-xs text-red-500">
                {fieldErrors.fullName[0]}
              </span>
            )}
          </div>

          {/* Email with Verification Badge / Button */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={email}
                disabled
                className="w-full border border-gray-300 bg-gray-100 rounded-xl px-4 py-2 text-gray-500 cursor-not-allowed"
              />
              {isEmailVerified ? (
                <span className="text-emerald-600 font-semibold text-xs whitespace-nowrap">
                  Verified ✓
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="bg-amber-500 text-white text-xs px-3 py-2 rounded-xl hover:bg-amber-600 whitespace-nowrap transition-all"
                >
                  Verify Email
                </button>
              )}
            </div>
            {showOtpModal && (
              <div className="mt-2 p-3 bg-cyan-50 border border-cyan-200 rounded-xl flex flex-col gap-2">
                <p className="text-xs text-gray-700">
                  Enter the 6-digit code sent to your email:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-center tracking-widest font-bold text-sm w-full bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifying}
                    className="bg-cyan-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-cyan-700 transition-all"
                  >
                    {verifying ? "Checking..." : "Confirm"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
            />
            {fieldErrors.phone && (
              <span className="text-xs text-red-500">
                {fieldErrors.phone[0]}
              </span>
            )}
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border cursor-pointer border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all bg-white"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {fieldErrors.gender && (
              <span className="text-xs text-red-500">
                {fieldErrors.gender[0]}
              </span>
            )}
          </div>

          {/* Business Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="border cursor-pointer border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
            />
            {fieldErrors.bussinessName && (
              <span className="text-xs text-red-500">
                {fieldErrors.bussinessName[0]}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="mt-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border-2 border-emerald-500 font-semibold py-2.5 rounded-xl transition-all disabled:cursor-not-allowed cursor-pointer"
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
