"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/validations/profile.schema";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChangePasswordForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

    const onSubmit = async (values: ChangePasswordFormValues) => {
        setServerError(null);
        setSuccess(false);
        try {
            await authService.updatePassword(values.newPassword);
            reset();
            setSuccess(true);
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Failed to update password");
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New password</Label>
                        <Input id="newPassword" type="password" autoComplete="new-password" {...register("newPassword")} />
                        {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword">Confirm your new password</Label>
                        <Input
                            id="confirmNewPassword"
                            type="password"
                            autoComplete="new-password"
                            {...register("confirmNewPassword")}
                        />
                        {errors.confirmNewPassword && (
                            <p className="text-sm text-destructive">{errors.confirmNewPassword.message}</p>
                        )}
                    </div>
                    {serverError && <p className="text-sm text-destructive">{serverError}</p>}
                    {success && <p className="text-sm text-green-600 dark:text-green-400">Password updated.</p>}
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Update password"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}