import type { UserRole } from "./database";

export interface Profile {
    id: string;

    fullName: string;
    email: string;

    role: UserRole;

    isActive: boolean;

    createdAt: string;
    updatedAt: string;
}