"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/stores/category.store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import type { TicketCategory } from "@/types/category";

interface CategoryListProps {
    onEdit?: (category: TicketCategory) => void;
}

export function CategoryList({ onEdit }: CategoryListProps) {
    const { categories, isLoading, error, page, pageSize, total, fetchCategories, setCategoryActive } = useCategoryStore();
    const [pendingId, setPendingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories(1);
    }, [fetchCategories]);

    const toggleActive = async (id: string, isActive: boolean) => {
        setPendingId(id);
        try {
            await setCategoryActive(id, !isActive);
        } finally {
            setPendingId(null);
        }
    };

    if (isLoading) return <p className="text-muted-foreground">Loading categories...</p>;
    if (error) return <p className="text-destructive">{error}</p>;
    if (categories.length === 0) return <EmptyState title="No categories yet" description="Add a category to get started." />;

    return (
        <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-border shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-muted/60 text-left">
                        <tr>
                            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Name</th>
                            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Description</th>
                            <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs text-muted-foreground">Status</th>
                            <th className="px-4 py-3 font-medium" />
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-t border-border transition-colors hover:bg-primary/5">
                                <td className="px-4 py-2">{category.name}</td>
                                <td className="px-4 py-2 text-muted-foreground">{category.description ?? "—"}</td>
                                <td className="px-4 py-2">
                                    <span className={category.isActive ? "text-green-700" : "text-muted-foreground"}>
                                        {category.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-right space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => onEdit?.(category)}>
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pendingId === category.id}
                                        onClick={() => toggleActive(category.id, category.isActive)}
                                    >
                                        {category.isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={fetchCategories} />
        </div>
    );
}