"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormValues } from "@/validations/category.schema";
import { useCategoryStore } from "@/stores/category.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CategoryForm() {
    const createCategory = useCategoryStore((s) => s.createCategory);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

    const onSubmit = async (values: CategoryFormValues) => {
        setServerError(null);
        setSuccess(false);
        try {
            await createCategory(values);
            reset({ name: "", description: "" });
            setSuccess(true);
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Failed to create category");
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Add Category</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register("description")} />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>
                    {serverError && <p className="text-sm text-destructive">{serverError}</p>}
                    {success && <p className="text-sm text-green-700">Category created.</p>}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create category"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}