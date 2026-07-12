import type { CommentVisibility } from "./database";

export interface TicketComment {
    id: string;
    ticketId: string;

    authorId: string;
    authorName: string;

    visibility: CommentVisibility;

    comment: string;

    createdAt: string;
    updatedAt: string;
}