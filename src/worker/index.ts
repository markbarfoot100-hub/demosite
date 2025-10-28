import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { ProductSchema, CreateProductSchema, UpdateProductSchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

// Get all products
app.get("/api/products", async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM products 
      WHERE is_available = 1 
      ORDER BY created_at DESC
    `).all();
    
    const products = result.results.map(row => ProductSchema.parse(row));
    return c.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

// Get all products (admin view - includes unavailable)
app.get("/api/admin/products", async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM products 
      ORDER BY created_at DESC
    `).all();
    
    const products = result.results.map(row => ProductSchema.parse(row));
    return c.json({ products });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

// Get single product
app.get("/api/products/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid product ID" }, 400);
    }

    const result = await c.env.DB.prepare(`
      SELECT * FROM products WHERE id = ?
    `).bind(id).first();
    
    if (!result) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    const product = ProductSchema.parse(result);
    return c.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return c.json({ error: "Failed to fetch product" }, 500);
  }
});

// Create new product
app.post("/api/admin/products", async (c) => {
  try {
    const body = await c.req.json();
    const productData = CreateProductSchema.parse(body);
    
    const result = await c.env.DB.prepare(`
      INSERT INTO products (
        name, description, price, category, strain_type, 
        thc_percentage, cbd_percentage, image_url, stock_quantity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      productData.name,
      productData.description || null,
      productData.price,
      productData.category,
      productData.strain_type || null,
      productData.thc_percentage || null,
      productData.cbd_percentage || null,
      productData.image_url || null,
      productData.stock_quantity
    ).run();
    
    if (!result.success) {
      return c.json({ error: "Failed to create product" }, 500);
    }
    
    return c.json({ 
      message: "Product created successfully",
      id: result.meta.last_row_id 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid product data", details: error.errors }, 400);
    }
    console.error('Error creating product:', error);
    return c.json({ error: "Failed to create product" }, 500);
  }
});

// Update product
app.put("/api/admin/products/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid product ID" }, 400);
    }

    const body = await c.req.json();
    const productData = UpdateProductSchema.parse(body);
    
    // Build dynamic update query
    const updates = [];
    const values = [];
    
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (updates.length === 0) {
      return c.json({ error: "No fields to update" }, 400);
    }
    
    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);
    
    const result = await c.env.DB.prepare(`
      UPDATE products SET ${updates.join(", ")} WHERE id = ?
    `).bind(...values).run();
    
    if (!result.success) {
      return c.json({ error: "Failed to update product" }, 500);
    }
    
    return c.json({ message: "Product updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid product data", details: error.errors }, 400);
    }
    console.error('Error updating product:', error);
    return c.json({ error: "Failed to update product" }, 500);
  }
});

// Delete product
app.delete("/api/admin/products/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid product ID" }, 400);
    }

    const result = await c.env.DB.prepare(`
      DELETE FROM products WHERE id = ?
    `).bind(id).run();
    
    if (!result.success) {
      return c.json({ error: "Failed to delete product" }, 500);
    }
    
    return c.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

// Toggle product availability
app.patch("/api/admin/products/:id/toggle", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid product ID" }, 400);
    }

    const result = await c.env.DB.prepare(`
      UPDATE products 
      SET is_available = NOT is_available, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(id).run();
    
    if (!result.success) {
      return c.json({ error: "Failed to toggle product availability" }, 500);
    }
    
    return c.json({ message: "Product availability toggled successfully" });
  } catch (error) {
    console.error('Error toggling product availability:', error);
    return c.json({ error: "Failed to toggle product availability" }, 500);
  }
});

export default app;
