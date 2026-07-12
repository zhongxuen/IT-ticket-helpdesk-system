import { RoleGuard } from "@/components/auth/role-guard";
import { ROLES } from "@/constants/roles";
import { UserForm } from "@/components/users/user-form";
import { UserList } from "@/components/users/user-list";

export default function UsersPage() {
    return (
        <RoleGuard allowed={[ROLES.ADMIN]}>
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Users</h1>
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <UserList />
                    <UserForm />
                </div>
            </div>
        </RoleGuard>
    );
}