import { Download } from "lucide-react";
import React from "react";

const ExcelExportButton = () => {
  return (
    <div>
      <button
        type="button"
        className=" text-[13.5px] bg-emerald-50 font-semibold text-emerald-700 flex items-center justify-center gap-1.5 border-[1.5px] border-emerald-500 rounded-[10px] px-3 py-2 cursor-pointer hover:bg-emerald-500 hover:text-white transition whitespace-nowrap"
      >
        <Download size={16} />
        Export to Excel
      </button>
    </div>
  );
};

export default ExcelExportButton;
