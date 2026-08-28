import React from "react";
import LoanCard from "./LoanCard";

export default function KanbanColumn({
  column,
  loans,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const columnLoans = loans.filter((loan) => {
    if (column.key === "pending") {
      return loan.status === "ACTIVE" || loan.status === "PARTIALLY_PAID";
    }

    if (column.key === "overdue") {
      return loan.status === "OVERDUE";
    }

    if (column.key === "paid") {
      return loan.status === "PAID";
    }

    return false;
  });
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.key)}
      className="bg-slate-100/70 rounded-2xl p-4 flex flex-col gap-4 border border-slate-200/60 min-h-[550px]"
    >
      {/* Column Header */}
      <div
        className={`flex justify-between items-center px-3 py-2 rounded-xl border ${column.bgHeader} font-semibold text-sm`}
      >
        <span>{column.title}</span>
        <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm">
          {columnLoans.length}
        </span>
      </div>

      {/* Cards List Container */}
      <div className="flex flex-col gap-3 flex-1">
        {columnLoans.map((loan) => (
          <LoanCard key={loan.id} loan={loan} onDragStart={onDragStart} />
        ))}

        {columnLoans.length === 0 && (
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
}
