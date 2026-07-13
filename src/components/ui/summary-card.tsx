import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
    label: string;
    value: number;
    tone?: "default" | "warning" | "success" | "destructive";
}

const TONE_STYLES: Record<NonNullable<SummaryCardProps["tone"]>, string> = {
    default: "text-accent",
    warning: "text-warning",
    success: "text-success",
    destructive: "text-destructive",
};

export function SummaryCard({ label, value, tone = "default" }: SummaryCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className={cn("mt-2 text-3xl font-semibold", TONE_STYLES[tone])}>{value}</p>
            </CardContent>
        </Card>
    );
}