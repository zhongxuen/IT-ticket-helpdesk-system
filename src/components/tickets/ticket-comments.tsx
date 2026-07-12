"use client";

import { useEffect, useState, useCallback } from "react";
import { commentService } from "@/services/comment.service";
import { useAuthStore } from "@/stores/auth.store";
import { ROLES } from "@/constants/roles";
import { CommentForm } from "@/components/tickets/comment-form";
import { CommentVisibilityBadge } from "@/components/tickets/comment-visibility-badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { TicketComment } from "@/types/comment";
import type { CommentFormValues } from "@/validations/comment.schema";

interface TicketCommentsProps {
    ticketId: string;
}

export function TicketComments({ ticketId }: TicketCommentsProps) {
    const profile = useAuthStore((s) => s.profile);
    const [comments, setComments] = useState<TicketComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const canViewInternal =
        !!profile && [ROLES.ADMIN, ROLES.IT, ROLES.TECHNICIAN].includes(profile.role as any);

    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await commentService.listByTicket(ticketId);
            setComments(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load comments");
        } finally {
            setIsLoading(false);
        }
    }, [ticketId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (values: CommentFormValues) => {
        if (!profile) return;
        const visibility = canViewInternal ? values.visibility : "public";
        const created = await commentService.create({
            ticketId,
            authorId: profile.id,
            comment: values.comment,
            visibility,
        });
        setComments((prev) => [...prev, created]);
    };

    const visibleComments = canViewInternal
        ? comments
        : comments.filter((c) => c.visibility === "public");

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Comments</h2>

            {isLoading && <p className="text-sm text-muted-foreground">Loading comments...</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {!isLoading && !error && visibleComments.length === 0 && (
                <EmptyState title="No comments yet" description="Be the first to comment on this ticket." />
            )}

            {!isLoading && !error && visibleComments.length > 0 && (
                <ul className="space-y-3">
                    {visibleComments.map((comment) => (
                        <li key={comment.id} className="rounded-md border border-border p-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{comment.authorName}</span>
                                <div className="flex items-center gap-2">
                                    <CommentVisibilityBadge visibility={comment.visibility} />
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{comment.comment}</p>
                        </li>
                    ))}
                </ul>
            )}

            {profile && <CommentForm canPostInternal={canViewInternal} onSubmit={handleSubmit} />}
        </div>
    );
}