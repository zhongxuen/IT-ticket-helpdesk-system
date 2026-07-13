"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResetPasswordForm() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

    const onSubmit = async (values: ResetPasswordFormValues) => {
        setServerError(null);
        try {
            await authService.updatePassword(values.password);
            router.push(ROUTES.LOGIN);
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Failed to reset password");
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Set new password</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="password">New password</Label>
                        <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
                        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm password</Label>
                        <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
                        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                    </div>
                    {serverError && <p className="text-sm text-destructive">{serverError}</p>}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Update password"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}