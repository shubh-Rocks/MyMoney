import { AppError } from "@/errors/app-error";
import { loanRepository } from "@/repositories/loan.repository";

class LoanPayment {
  async loanPaymentService(loanId, amount, paymentDate, paymentMethod, notes) {
    const loan = await loanRepository.findByLoanId(loanId);

    if (!loan) {
      throw new AppError("Loan not found", 404, "LOAN_NOT_FOUND");
    }
  }
}

export const loanPaymentService = new LoanPayment();
