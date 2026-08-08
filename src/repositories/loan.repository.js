class LoanRepository {
  createLoan(tx, data) {
    return tx.loan.create({
      data,
    });
  }
}

export const loanRepository = new LoanRepository();
