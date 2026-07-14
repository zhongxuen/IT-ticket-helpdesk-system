import { z } from "zod";
import { ROLES } from "@/constants/roles";

export const createUserSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum([ROLES.ADMIN, ROLES.IT, ROLES.TECHNICIAN, ROLES.EMPLOYEE]),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserRoleSchema = z.object({
    role: z.enum([ROLES.ADMIN, ROLES.IT, ROLES.TECHNICIAN, ROLES.EMPLOYEE]),
});

export type UpdateUserRoleFormValues = z.infer<typeof updateUserRoleSchema>;