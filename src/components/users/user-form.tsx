"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserFormValues } from "@/validations/user.schema";
import { useUserStore } from "@/stores/user.store";
import { useAuthStore } from "@/stores/auth.store";
import { ROLES } from "@/constants/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ROLE_OPTIONS = [ROLES.ADMIN, ROLES.IT, ROLES.TECHNICIAN, ROLES.EMPLOYEE];

export function UserForm() {
    const createUser = useUserStore((s) => s.createUser);
    const actorId = useAuthStore((s) => s.profile?.id);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: { role: ROLES.EMPLOYEE },
    });

    const onSubmit = async (values: CreateUserFormValues) => {
        if (!actorId) {
            setServerError("You must be signed in to create a user.");
            return;
        }
        setServerError(null);
        setSuccess(false);
        try {
            await createUser(values, actorId);
            reset({ fullName: "", email: "", password: "", role: ROLES.EMPLOYEE });
            setSuccess(true);
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Failed to create user");
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Add User</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input id="fullName" {...register("fullName")} />
                        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Temporary password</Label>
                        <Input id="password" type="password" {...register("password")} />
                        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            className="flex h-9 w-full rounded-md border border-border bg-background text-foreground px-3 py-1 text-sm shadow-sm"
                            {...register("role")}
                        >
                            {ROLE_OPTIONS.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
                    </div>
                    {serverError && <p className="text-sm text-destructive">{serverError}</p>}
                    {success && <p className="text-sm text-green-600 dark:text-green-400">User created.</p>}
                    <Button type="submit" className="w-full" disabled={isSubmitting || !actorId}>
                        {isSubmitting ? "Creating..." : "Create user"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}