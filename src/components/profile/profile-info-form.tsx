"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    updateProfileSchema,
    updateEmailSchema,
    type UpdateProfileFormValues,
    type UpdateEmailFormValues,
} from "@/validations/profile.schema";
import { profileService } from "@/services/profile.service";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types/profile";

interface ProfileInfoFormProps {
    profile: Profile;
}

export function ProfileInfoForm({ profile }: ProfileInfoFormProps) {
    const setProfile = useAuthStore((s) => s.setProfile);

    const [nameError, setNameError] = useState<string | null>(null);
    const [nameSuccess, setNameSuccess] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [emailSuccess, setEmailSuccess] = useState(false);

    const nameForm = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: { fullName: profile.fullName },
    });

    const emailForm = useForm<UpdateEmailFormValues>({
        resolver: zodResolver(updateEmailSchema),
        defaultValues: { email: profile.email },
    });

    const onSaveName = async (values: UpdateProfileFormValues) => {
        setNameError(null);
        setNameSuccess(false);
        try {
            const updated = await profileService.updateFullName(profile.id, values.fullName);
            setProfile(updated);
            setNameSuccess(true);
        } catch (err) {
            setNameError(err instanceof Error ? err.message : "Failed to update name");
        }
    };

    const onSaveEmail = async (values: UpdateEmailFormValues) => {
        setEmailError(null);
        setEmailSuccess(false);
        try {
            await authService.updateEmail(values.email);
            setEmailSuccess(true);
        } catch (err) {
            setEmailError(err instanceof Error ? err.message : "Failed to update email");
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={nameForm.handleSubmit(onSaveName)} className="space-y-3" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input id="fullName" {...nameForm.register("fullName")} />
                        {nameForm.formState.errors.fullName && (
                            <p className="text-sm text-destructive">{nameForm.formState.errors.fullName.message}</p>
                        )}
                    </div>
                    {nameError && <p className="text-sm text-destructive">{nameError}</p>}
                    {nameSuccess && <p className="text-sm text-green-600 dark:text-green-400">Name updated.</p>}
                    <Button type="submit" size="sm" disabled={nameForm.formState.isSubmitting}>
                        {nameForm.formState.isSubmitting ? "Saving..." : "Save name"}
                    </Button>
                </form>

                <form
                    onSubmit={emailForm.handleSubmit(onSaveEmail)}
                    className="space-y-3 border-t border-border pt-6"
                    noValidate
                >
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...emailForm.register("email")} />
                        {emailForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>
                        )}
                    </div>
                    {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                    {emailSuccess && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                            Check your inbox to confirm the new email address.
                        </p>
                    )}
                    <Button type="submit" size="sm" disabled={emailForm.formState.isSubmitting}>
                        {emailForm.formState.isSubmitting ? "Saving..." : "Save email"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}