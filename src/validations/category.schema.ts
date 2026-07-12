import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "Name is required").max(120, "Name is too long"),
    description: z.string().max(500, "Description is too long").optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;