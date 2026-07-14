import { cn } from "@/lib/utils";
import type { CommentVisibility } from "@/types/database";

const STYLES: Record<CommentVisibility, string> = {
    public: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
    internal: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
};

const LABELS: Record<CommentVisibility, string> = {
    public: "Public",
    internal: "Internal",
};

export function CommentVisibilityBadge({ visibility }: { visibility: CommentVisibility }) {
    return (
        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", STYLES[visibility])}>
            {LABELS[visibility]}
        </span>
    );
}