import z from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  category: z.string(),
  strain_type: z.string().nullable(),
  thc_percentage: z.number().nullable(),
  cbd_percentage: z.number().nullable(),
  image_url: z.string().nullable(),
  is_available: z.union([z.boolean(), z.number()]).transform(val => Boolean(val)),
  stock_quantity: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.enum(["flower", "edibles", "concentrates", "vapes", "topicals", "accessories"]),
  strain_type: z.enum(["indica", "sativa", "hybrid"]).optional(),
  thc_percentage: z.number().min(0).max(100).optional(),
  cbd_percentage: z.number().min(0).max(100).optional(),
  image_url: z.string().optional(),
  stock_quantity: z.number().min(0).default(0),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
