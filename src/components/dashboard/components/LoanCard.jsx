import React from "react";
import { Clock, CheckCircle2, Phone, MoreVertical } from "lucide-react";

export default function LoanCard({ loan, onDragStart }) {
  const isPending =
    loan.status === "ACTIVE" || loan.status === "PARTIALLY_PAID";

  const isOverdue = loan.status === "OVERDUE";
  const isPaid = loan.status === "PAID";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, loan.id)}
      className="bg-white rounded-xl p-4 border border-slate-200/80 cursor-grab active:cursor-grabbing hover:shadow-md transition-all relative group"
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-slate-900">{loan.borrowerName}</h4>

          <p className="text-lg font-bold text-slate-900 mt-0.5">
            ₹{Number(loan.amount).toLocaleString("en-IN")}
          </p>
        </div>

        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Pending Due Date */}
      {isPending && loan.dueDate && (
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1">
          <Clock size={13} className="text-slate-400" />
          Due {new Date(loan.dueDate).toLocaleDateString("en-IN")}
        </div>
      )}

      {/* Overdue */}
      {isOverdue && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate-500">
            Was due {new Date(loan.dueDate).toLocaleDateString("en-IN")}
          </span>

          <span className="text-[10px] bg-rose-100 text-rose-700 font-medium px-2 py-0.5 rounded-full">
            Overdue
          </span>
        </div>
      )}

      {/* Paid */}
      {isPaid && (
        <div className="text-xs text-emerald-600 mb-3 flex items-center gap-1 font-medium">
          <CheckCircle2 size={13} />
          Fully settled
        </div>
      )}

      {/* Partial Payment Progress */}
      {Number(loan.totalPaid) > 0 && isPending && (
        <div className="mb-3">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{
                width: `${Math.min(
                  (Number(loan.totalPaid) / Number(loan.amount)) * 100,
                  100,
                )}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500">
            <span>₹{Number(loan.totalPaid).toLocaleString("en-IN")} paid</span>

            <span>
              ₹{Number(loan.remainingAmount).toLocaleString("en-IN")} remaining
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isPaid ? (
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button
            className={`flex-1 py-2 rounded-lg text-xs font-semibold text-white shadow-sm transition-colors ${
              isOverdue
                ? "bg-rose-500 hover:bg-rose-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            + Add Payment
          </button>

          <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <Phone size={15} className="text-sky-500" />
          </button>
        </div>
      ) : (
        <div className="pt-1">
          <span className="inline-block text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-medium">
            Fully settled
          </span>
        </div>
      )}
    </div>
  );
}
