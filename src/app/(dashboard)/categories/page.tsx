import { RoleGuard } from "@/components/auth/role-guard";
import { ROLES } from "@/constants/roles";
import { CategoryForm } from "@/components/categories/category-form";
import { CategoryList } from "@/components/categories/category-list";

export default function CategoriesPage() {
    return (
        <RoleGuard allowed={[ROLES.ADMIN]}>
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Categories</h1>
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <CategoryList />
                    <CategoryForm />
                </div>
            </div>
        </RoleGuard>
    );
}