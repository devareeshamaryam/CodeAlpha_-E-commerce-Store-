import { Router, Request, Response } from "express";
import { supabase } from "../config/supabase";
import { Order, OrderItem, ShippingAddress } from "../types/database";

const router = Router();

// GET /api/orders - Get all orders
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, email } = req.query;

    let query = supabase.from("orders").select("*");

    // Filter by status
    if (status) {
      query = query.eq("status", status);
    }

    // Filter by email
    if (email) {
      query = query.ilike("customer_email", `%${email}%`);
    }

    // Sort by creation date (newest first)
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch orders from database",
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
      error: "Failed to fetch orders",
    });
  }
});

// GET /api/orders/:id - Get order by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
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
      error: "Failed to fetch order",
    });
  }
});

// POST /api/orders - Create new order
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,
    } = req.body;

    // Validation
    if (!customer_name || !customer_email || !customer_phone || !shipping_address || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Calculate total amount
    const total_amount = items.reduce((sum: number, item: OrderItem) => 
      sum + (item.price * item.quantity), 0
    );

    const newOrder: Partial<Order> = {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,
      total_amount,
      status: "pending",
    };

    const { data, error } = await supabase
      .from("orders")
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to create order",
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: "Order not found or failed to update",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update order status",
    });
  }
});

// DELETE /api/orders/:id - Delete order (admin only)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete order",
    });
  }
});

// GET /api/orders/stats/summary - Get order statistics
router.get("/stats/summary", async (req: Request, res: Response) => {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*");

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch order statistics",
      });
    }

    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    
    const statusCounts = orders?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        statusCounts,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order statistics",
    });
  }
});

export default router;
