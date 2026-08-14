import { IndianRupeeIcon } from "lucide-react";
import React from "react";

const StatCard = ({
  title,
  amount,
  subtitle,
  icon,
  iconBg,
  textColor = "text-slate-900",
  cardBg = "bg-white",
  border = "border",
  borderColor = "border-slate-200",
}) => {
  return (
    <div
      className={`${cardBg} ${border} ${borderColor} p-6 rounded-3xl shadow-sm flex flex-col justify-between w-full h-44`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold flex items-center ${textColor}`}>
          <IndianRupeeIcon size={20} className="mr-0.5" />
          {Number(amount).toLocaleString("en-IN")}
        </h3>
      </div>

      {subtitle && (
        <p className="text-xs font-medium text-slate-400 mt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;
