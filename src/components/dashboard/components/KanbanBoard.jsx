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

  const handleDragStart = (e, id) => {
    console.log("🔥 BOARD DRAG START ID:", id);
    if (!id) {
      console.error("❌ Error: Trying to drag a card with undefined ID!");
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
  };

  // 2. Drag Over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 3. Drop: Safe ID extraction and API call
  const handleDrop = async (e, targetColumnKey) => {
    e.preventDefault();

    const rawId = e.dataTransfer.getData("text/plain");
    const loanId = Number(rawId);

    console.log("🔥 DROPPED RAW ID:", rawId, "CONVERTED:", loanId);

    if (!loanId || isNaN(loanId)) {
      console.error("❌ Invalid Loan ID detected during drop:", rawId);
      alert("Error: Could not identify the dragged loan.");
      return;
    }

    const draggedLoan = loans.find((l) => l.id === loanId);
    if (!draggedLoan) {
      console.error("❌ Loan not found in state array for ID:", loanId);
      return;
    }

    // --- RULES ---
    if (draggedLoan.status === "PAID") {
      alert("Settled loans cannot be moved!");
      return;
    }

    if (draggedLoan.status === "OVERDUE" && targetColumnKey === "pending") {
      alert("Overdue loans can only be marked as Paid, not back to Pending!");
      return;
    }

    let newBackendStatus = draggedLoan.status;
    if (targetColumnKey === "paid") {
      newBackendStatus = "PAID";
    } else if (targetColumnKey === "pending") {
      newBackendStatus = "ACTIVE";
    } else if (targetColumnKey === "overdue") {
      newBackendStatus = "OVERDUE";
    }

    if (newBackendStatus === draggedLoan.status) return;

    // Optimistic UI Update
    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.id === loanId ? { ...loan, status: newBackendStatus } : loan,
      ),
    );

    try {
      if (targetColumnKey === "paid") {
        const response = await apiClient.loanSettlement(loanId, "CASH");
      }
     
      console.log("🔥 Status successfully updated in database!");
    } catch (error) {
      console.error("Error updating loan status:", error);
      alert("Failed to update status. Reverting changes...");
    }
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
