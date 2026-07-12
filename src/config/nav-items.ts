import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";
import type { UserRole } from "@/types/database";

export interface NavItem {
    label: string;
    href: string;
    roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
    { label: "Dashboard", href: ROUTES.DASHBOARD, roles: [ROLES.ADMIN, ROLES.IT, ROLES.TECHNICIAN, ROLES.EMPLOYEE] },
    { label: "Tickets", href: ROUTES.TICKETS, roles: [ROLES.ADMIN, ROLES.IT, ROLES.TECHNICIAN, ROLES.EMPLOYEE] },
    { label: "Users", href: ROUTES.USERS, roles: [ROLES.ADMIN] },
    { label: "Categories", href: ROUTES.CATEGORIES, roles: [ROLES.ADMIN] },
    { label: "Settings", href: ROUTES.SETTINGS, roles: [ROLES.ADMIN] },
    { label: "Profile", href: ROUTES.PROFILE, roles: [ROLES.ADMIN, ROLES.IT, ROLES.TECHNICIAN, ROLES.EMPLOYEE] },
];