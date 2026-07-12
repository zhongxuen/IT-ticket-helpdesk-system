"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, type CommentFormValues } from "@/validations/comment.schema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CommentFormProps {
    canPostInternal: boolean;
    onSubmit: (values: CommentFormValues) => Promise<void>;
}

export function CommentForm({ canPostInternal, onSubmit }: CommentFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CommentFormValues>({
        resolver: zodResolver(commentSchema),
        defaultValues: { comment: "", visibility: "public" },
    });

    const submit = async (values: CommentFormValues) => {
        await onSubmit(values);
        reset({ comment: "", visibility: values.visibility });
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-3" noValidate>
            <div className="space-y-2">
                <Label htmlFor="comment">Add comment</Label>
                <textarea
                    id="comment"
                    rows={3}
                    className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    {...register("comment")}
                />
                {errors.comment && <p className="text-sm text-destructive">{errors.comment.message}</p>}
            </div>

            {canPostInternal && (
                <div className="flex items-center gap-4">
                    <Label className="flex items-center gap-2 font-normal">
                        <input type="radio" value="public" {...register("visibility")} defaultChecked />
                        Public
                    </Label>
                    <Label className="flex items-center gap-2 font-normal">
                        <input type="radio" value="internal" {...register("visibility")} />
                        Internal
                    </Label>
                </div>
            )}

            <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post comment"}
            </Button>
        </form>
    );
}