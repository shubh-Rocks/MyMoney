"use client";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import FormModal from "@/components/dashboard/form/FormModal";

const QuickAddCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" shadow-[0_10px_24px_rgba(16,185,129,0.28)] bg-gradient-to-br from-emerald-400 via-emerald-600 to-blue-400  text-white rounded-2xl p-5">
      <div className="flex flex-col ">
        <h1 className="font-extrabold text-[15.5px]">Lend Money?</h1>
        <p className="text-xs mb-3.5 opacity-95 leading-relaxed">
          Add a new borrower and loan in under 30 seconds.
        </p>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className="bg-white text-emerald-600 flex items-center justify-center gap-1 cursor-pointer font-bold px-5 py-2 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition"
        >
          <Plus size={15} strokeWidth={3.5} />
          Add Borrower
        </button>
      </div>
      {isOpen && <FormModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default QuickAddCard;
