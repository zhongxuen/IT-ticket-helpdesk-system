"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormValues } from "@/validations/category.schema";
import { useCategoryStore } from "@/stores/category.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TicketCategory } from "@/types/category";

interface CategoryFormProps {
    editingCategory?: TicketCategory | null;
    onDoneEditing?: () => void;
}

export function CategoryForm({ editingCategory, onDoneEditing }: CategoryFormProps) {
    const createCategory = useCategoryStore((s) => s.createCategory);
    const updateCategory = useCategoryStore((s) => s.updateCategory);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

    useEffect(() => {
        if (editingCategory) {
            reset({ name: editingCategory.name, description: editingCategory.description ?? "" });
        } else {
            reset({ name: "", description: "" });
        }
    }, [editingCategory, reset]);

    const onSubmit = async (values: CategoryFormValues) => {
        setServerError(null);
        setSuccess(false);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, values);
                onDoneEditing?.();
            } else {
                await createCategory(values);
                reset({ name: "", description: "" });
            }
            setSuccess(true);
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Failed to save category");
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{editingCategory ? "Edit Category" : "Add Category"}</CardTitle>
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
                    {success && <p className="text-sm text-green-700">Category saved.</p>}
                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : editingCategory ? "Save changes" : "Create category"}
                        </Button>
                        {editingCategory && (
                            <Button type="button" variant="outline" onClick={onDoneEditing}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}