import { RoleGuard } from "@/components/auth/role-guard";
import { ROLES } from "@/constants/roles";
import { SettingsForm } from "@/components/settings/settings-form";

export default function SettingsPage() {
    return (
        <RoleGuard allowed={[ROLES.ADMIN]}>
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Settings</h1>
                <SettingsForm />
            </div>
        </RoleGuard>
    );
}