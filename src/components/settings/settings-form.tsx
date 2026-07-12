"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsFormValues } from "@/validations/settings.schema";
import { settingsService } from "@/services/settings.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsForm() {
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: { companyName: "", supportEmail: "" },
    });

    useEffect(() => {
        let active = true;
        setIsLoading(true);
        settingsService
            .get()
            .then((data) => {
                if (!active) return;
                if (data) {
                    reset({ companyName: data.companyName, supportEmail: data.supportEmail });
                }
            })
            .catch((err) => {
                if (active) setLoadError(err instanceof Error ? err.message : "Failed to load settings");
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => {
            active = false;
        };
    }, [reset]);

    const onSubmit = async (values: SettingsFormValues) => {
        setServerError(null);
        setSuccess(false);
        try {
            await settingsService.update(values);
            setSuccess(true);
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Failed to save settings");
        }
    };

    if (isLoading) return <p className="text-muted-foreground">Loading settings...</p>;
    if (loadError) return <p className="text-destructive">{loadError}</p>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4" noValidate>
            <div className="space-y-2">
                <Label htmlFor="companyName">Company name</Label>
                <Input id="companyName" {...register("companyName")} />
                {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="supportEmail">Support email</Label>
                <Input id="supportEmail" type="email" {...register("supportEmail")} />
                {errors.supportEmail && <p className="text-sm text-destructive">{errors.supportEmail.message}</p>}
            </div>

            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
            {success && <p className="text-sm text-green-600">Settings saved.</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save settings"}
            </Button>
        </form>
    );
}