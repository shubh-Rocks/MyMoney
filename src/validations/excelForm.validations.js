import z, { date } from "zod";

export const excelFormValidationSchema = z
  .object({
    borrowerId: z.string().optional(),

    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Start date must be in YYYY-MM-DD format",
    }),

    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "End date must be in YYYY-MM-DD format",
    }),

    paymentType: z.enum(["ALL", "CASH", "UPI", "BANK_TRANSFER"]).optional(),
  })
  .refine(
    (data) => {
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    { message: "Start date cannot be greater than end date", path: ["end"] },
  );
