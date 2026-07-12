"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createTicketSchema, type CreateTicketFormValues } from "@/validations/ticket.schema";
import { ticketService } from "@/services/ticket.service";
import { categoryService } from "@/services/category.service";
import { useAuthStore } from "@/stores/auth.store";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TicketCategory } from "@/types/category";

export function TicketForm() {
    const router = useRouter();
    const profile = useAuthStore((s) => s.profile);

    const [categories, setCategories] = useState<TicketCategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateTicketFormValues>({ resolver: zodResolver(createTicketSchema) });

    useEffect(() => {
        let active = true;
        setCategoriesLoading(true);
        categoryService
            .listActive()
            .then((result) => {
                if (active) setCategories(result);
            })
            .catch((err) => {
                if (active) setCategoriesError(err instanceof Error ? err.message : "Failed to load categories");
            })
            .finally(() => {
                if (active) setCategoriesLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const onSubmit = async (values: CreateTicketFormValues) => {
        if (!profile) {
            setServerError("You must be signed in to create a ticket.");
            return;
        }
        setServerError(null);
        try {
            const ticket = await ticketService.create({
                title: values.title,
                description: values.description,
                employeeId: profile.id,
                categoryId: values.categoryId || null,
            });
            router.push(`${ROUTES.TICKETS}/${ticket.id}`);
            router.refresh();
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Failed to create ticket");
        }
    };

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>New Ticket</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register("description")} />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Category</Label>
                        {categoriesError ? (
                            <p className="text-sm text-destructive">{categoriesError}</p>
                        ) : (
                            <Select id="categoryId" disabled={categoriesLoading} defaultValue="" {...register("categoryId")}>
                                <option value="">
                                    {categoriesLoading ? "Loading categories..." : "No category"}
                                </option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </div>

                    {serverError && <p className="text-sm text-destructive">{serverError}</p>}

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Ticket"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.push(ROUTES.TICKETS)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}