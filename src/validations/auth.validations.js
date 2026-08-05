import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
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

    confirmPassword: z.string(),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    businessName: z.string().min(2, "Business name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
