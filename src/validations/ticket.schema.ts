import { z } from "zod";

export const createTicketSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().uuid().optional().nullable(),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;