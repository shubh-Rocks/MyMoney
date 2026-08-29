import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { apiClient } from "@/lib/api.Client";

export default function KanbanBoard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoans() {
      try {
        const response = await apiClient.getBorrower();

        console.log("🔥 BORROWER RESPONSE:", response);

        const borrowers = response.borrowers;

        const formattedLoans = borrowers.flatMap((borrower) =>
          borrower.loans.map((loan) => ({
            ...loan,
            borrowerId: borrower.id,
            borrowerName: borrower.name,
          })),
        );

        console.log("🔥 KANBAN LOANS:", formattedLoans);

        setLoans(formattedLoans);
      } catch (error) {
        console.error("Error fetching loans", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLoans();
  }, []);

  // 1. Drag Start: Card ki ID dataTransfer me store karna
  const handleDragStart = (e, id) => {
    console.log("🔥 BOARD DRAG START:", id);

    e.dataTransfer.effectAllowed = "move";

    e.dataTransfer.setData("text/plain", String(id));
  };

  // 2. Drag Over: Drop allow karne ke liye default behavior rokna
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 3. Drop: Target column ke status ke hisab se loan ki state update karna
  const handleDrop = (e, targetStatus) => {
    e.preventDefault();

    const loanId = Number(e.dataTransfer.getData("text/plain"));

    console.log("🔥 DROPPED LOAN ID:", loanId);
    console.log("🔥 TARGET STATUS:", targetStatus);
  };

  // Column ki list aur styling configuration
  const columns = [
    {
      key: "pending",
      title: "Pending",
      bgHeader: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      key: "overdue",
      title: "Overdue",
      bgHeader: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      key: "paid",
      title: "Paid",
      bgHeader: "bg-teal-50 text-teal-700 border-teal-200",
    },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Loan Board</h2>
        <span className="text-sm text-slate-500 flex items-center gap-1">
          ↕ Drag a card to update status
        </span>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <KanbanColumn
            key={col.key}
            column={col}
            loans={loans}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
