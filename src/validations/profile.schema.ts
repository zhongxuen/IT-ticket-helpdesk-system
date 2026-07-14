import { z } from "zod";

export const updateProfileSchema = z.object({
    fullName: z.string().min(1, "Full name is required").max(120, "Name is too long"),
});
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const updateEmailSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
});
export type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;

export const changePasswordSchema = z
    .object({
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmNewPassword: z.string().min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;