import z from "zod";

export const loanPayment = object({
  loanId: z.coerce.bigint().positive(),
  amount: z.coerce.number().positive("number should be positive"),
  paymentDate: z.coerce.date(),
  paymentMethod: z.enum(["UPI", "CASH", "NEFT", "CHEQUE", "BANK_TRANSFER"]),
  notes: z.string(500).optional(),
});
