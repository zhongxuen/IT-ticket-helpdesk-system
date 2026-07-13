"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ForgotPasswordForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        setServerError(null);
        setSuccess(false);
        try {
            await authService.requestPasswordReset(values.email);
            setSuccess(true);
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Failed to send reset email");
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Reset password</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" autoComplete="email" {...register("email")} />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                    {serverError && <p className="text-sm text-destructive">{serverError}</p>}
                    {success && (
                        <p className="text-sm text-green-700">
                            If an account exists for that email, a reset link has been sent.
                        </p>
                    )}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send reset link"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}