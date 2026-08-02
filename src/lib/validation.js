import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name is too long"),

    email: z.email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    phone: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const userBorrowersSchema = z.object({
  name: z
    .string()
    .min(3, "name must be atleast 3 characters")
    .max(50, "name is too long"),

  email: z.email("please enter a valid email"),
  phone: z
    .string()
    .length(10, { message: "phone number must be 10 digit" })
    .regex(/^[0-9]+$/, "phone must be in digits"),
  amount: z
    .int()
    .min(1, "amount should not less than 1 ")
    .max(100000000, "amount should not more than 1 crore"),
  address: z.object({
    street: z.string().trim().min(5, "street is required"),
    city: z.string().trim().min(3, "city is required"),
    state: z.string().trim().min(3, "state is required"),
    pincode: z
      .string()
      .length(6, "pincode is required")
      .regex(/^[0-9]+$/, { message: "pincode must be in digits " }),
  }),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50)
    .optional(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});
