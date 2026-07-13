"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { ROLES } from "@/constants/roles";
import { CategoryForm } from "@/components/categories/category-form";
import { CategoryList } from "@/components/categories/category-list";
import type { TicketCategory } from "@/types/category";

export default function CategoriesPage() {
    const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null);

    return (
        <RoleGuard allowed={[ROLES.ADMIN]}>
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Categories</h1>
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <CategoryList onEdit={setEditingCategory} />
                    <CategoryForm editingCategory={editingCategory} onDoneEditing={() => setEditingCategory(null)} />
                </div>
            </div>
        </RoleGuard>
    );
}