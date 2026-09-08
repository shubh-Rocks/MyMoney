import z from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(3, "Name mut be at least 3 charater")
    .max(50, "Name is too long"),
  email: z.email("please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  businessName: z
    .string()
    .min(7, " bussiness Name must be at least 8 character")
    .max(30, "Bussiness Name is too long"),
});
