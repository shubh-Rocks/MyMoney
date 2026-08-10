class LoanPaymentRepository {
  createPayment(tx, paymentData) {
    return tx.loanPayment.create({
      data: paymentData,
    });
  }
}

export const loanPaymentRepository = new LoanPaymentRepository();
