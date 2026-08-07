import { z } from "zod";

export const createBorrowerWithLoanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),

  email: z.email("please enter valid email address"),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "phone must contain exactly 10 digits "),

  lentDate: z.coerce.date({
    required_error: "Lent date  is required",
  }),

  dueDate: z.coerce.date({
    required_error: "Due date is required",
  }),

  amount: z.coerce
    .number()
    .min(1000, "Enter amount minimum 1000")
    .max(1000000, "Enter amount less than 1000000"),

  interestRate: z.coerce
    .number({
      required_error: "interest rate is required",
      invalid_type_error: "interest rate must be a number",
    })
    .positive({ message: "interest rate must be greater than 0" })
    .max(100, { message: "interest rate not be greater tha 100%" }),

  interestType: z.enum(["SIMPLE", "COMPOUND"]),

  street: z.string().min(1, "street is required"),
  city: z.string().min(1, "city is required"),
  state: z.string().min(1, "state is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "pincode must be 6 digits"),
});
