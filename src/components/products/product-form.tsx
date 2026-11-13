"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/product-schema";
import { createProduct } from "@/app/products/actions";

type ProductFormProps = {
  categoryId: string | null;
  categoryName: string;
};

export function ProductForm({ categoryId, categoryName }: ProductFormProps) {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { name: "", pricePesos: 0, categoryId },
  });

  async function onSubmit(values: ProductFormValues) {
    setMessage("");
    const result = await createProduct({ ...values, categoryId });

    if (result.success) {
      reset();
      setMessage(`Producto agregado a ${categoryName}.`);
      return;
    }

    setMessage(result.message);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="product-name">Nombre del producto</Label>
        <Input
          id="product-name"
          autoComplete="off"
          placeholder="Por ejemplo, Budín de limón"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "product-name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="product-name-error" className="text-destructive text-sm">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-price">Precio en pesos</Label>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-[#788178]">
            $
          </span>
          <Input
            id="product-price"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            className="pl-7"
            aria-invalid={Boolean(errors.pricePesos)}
            aria-describedby={
              errors.pricePesos ? "product-price-error" : undefined
            }
            {...register("pricePesos", { valueAsNumber: true })}
          />
        </div>
        {errors.pricePesos && (
          <p id="product-price-error" className="text-destructive text-sm">
            {errors.pricePesos.message}
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
        Guardar producto
      </Button>
      <p aria-live="polite" className="min-h-5 text-sm text-[#52665a]">
        {message}
      </p>
    </form>
  );
}
