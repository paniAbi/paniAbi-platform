"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { createCategory } from "@/app/products/category-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/lib/category-schema";

export function CategoryForm() {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "" },
  });

  async function onSubmit(values: CategoryFormValues) {
    setMessage("");
    const result = await createCategory(values);

    if (result.success) {
      reset();
      setMessage("Categoría creada.");
      return;
    }

    setMessage(result.message);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="category-name">Nombre de la categoría</Label>
        <Input
          id="category-name"
          autoComplete="off"
          placeholder="Por ejemplo, Budines"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "category-name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="category-name-error" className="text-destructive text-sm">
            {errors.name.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-10 w-full rounded-md bg-[#31594a] text-white hover:bg-[#26483a]"
      >
        {isSubmitting ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <Plus aria-hidden="true" />
        )}
        Crear categoría
      </Button>
      <p aria-live="polite" className="min-h-5 text-sm text-[#52665a]">
        {message}
      </p>
    </form>
  );
}
