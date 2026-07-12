import { z } from "zod";

export const commentSchema = z.object({
    comment: z.string().min(1, "Comment is required").max(2000, "Comment is too long"),
    visibility: z.enum(["public", "internal"]),
});

export type CommentFormValues = z.infer<typeof commentSchema>;