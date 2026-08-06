import React from "react";

const CustomAvatar = ({ fullName, className = "" }) => {
  const getInitials = (userName) => {
    if (!userName) return "u";
    const nameSplit = userName.trim().split(" ");

    if (nameSplit.length >= 2) {
      return (
        nameSplit[0][0].toUpperCase() +
        nameSplit[nameSplit.length - 1][0].toUpperCase()
      );
    }
    return userName.substring(0, 2).toUpperCase();
  };
  const getAvatarColors = (userName) => {
    const colors = [
      "bg-cyan-500",
      "bg-purple-500",
      "bg-rose-500",
      "bg-indigo-500",
      "bg-blue-500",
    ];

    if (!userName) return [0];

    let sum = 0;
    for (let i = 0; i < userName.length; i++) {
      sum += userName.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const initials = getInitials(fullName);
  const bgColor = getAvatarColors(fullName);

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-semibold tracking-wider border-white/20 shadow-sm ${bgColor} ${className}`}
    >
      {initials}
    </div>
  );
};

export default CustomAvatar;
