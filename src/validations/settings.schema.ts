import { z } from "zod";

export const settingsSchema = z.object({
    companyName: z.string().min(1, "Company name is required").max(120),
    supportEmail: z.string().min(1, "Support email is required").email("Invalid email address"),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;