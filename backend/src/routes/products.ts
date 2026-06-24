import { Router, Request, Response } from "express";
import { supabase } from "../config/supabase";
import { Product, ApiResponse } from "../types/database";

const router = Router();

// GET /api/products - Get all products
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, tag, minPrice, maxPrice, search } = req.query;

    let query = supabase.from("products").select("*");

    // Filter by category
    if (category) {
      query = query.ilike("category", category as string);
    }

    // Filter by tag
    if (tag) {
      query = query.ilike("tag", tag as string);
    }

    // Filter by price range
    if (minPrice) {
      query = query.gte("price", Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte("price", Number(maxPrice));
    }

    // Search by name
    if (search) {
      query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch products from database",
      });
    }

    res.json({
      success: true,
      count: data?.length || 0,
      data: data || [],
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
    });
  }
});

// GET /api/products/slug/:slug - Get product by slug
router.get("/slug/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
    });
  }
});

// POST /api/products - Create new product
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, slug, price, image, category, tag, description, sizes, made_to_order_note, disclaimer } = req.body;

    // Validation
    if (!name || !slug || !price || !category) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, slug, price, category",
      });
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Product with this slug already exists",
      });
    }

    const newProduct: Partial<Product> = {
      slug,
      name,
      price: Number(price),
      image: image || "/images/placeholder.png",
      category,
      tag: tag || category.toUpperCase(),
      description: description || [],
      sizes: sizes || [],
      made_to_order_note,
      disclaimer,
    };

    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to create product",
      });
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create product",
    });
  }
});

// PUT /api/products/:id - Update product
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove id from update data to prevent changing it
    delete updateData.id;
    delete updateData.created_at;

    const { data, error } = await supabase
      .from("products")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: "Product not found or failed to update",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update product",
    });
  }
});

// DELETE /api/products/:id - Delete product
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete product",
    });
  }
});

export default router;
                           