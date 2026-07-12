"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/stores/category.store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function CategoryList() {
    const { categories, isLoading, error, fetchCategories, setCategoryActive } = useCategoryStore();
    const [pendingId, setPendingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
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
        <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                    <tr>
                        <th className="px-4 py-2 font-medium">Name</th>
                        <th className="px-4 py-2 font-medium">Description</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                        <th className="px-4 py-2 font-medium" />
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id} className="border-t border-border hover:bg-muted/30">
                            <td className="px-4 py-2">{category.name}</td>
                            <td className="px-4 py-2 text-muted-foreground">{category.description ?? "—"}</td>
                            <td className="px-4 py-2">
                                <span className={category.isActive ? "text-green-700" : "text-muted-foreground"}>
                                    {category.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-right">
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
    );
}