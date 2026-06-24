// API Integration Layer
// Connects frontend to Express.js backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTS API
// ═══════════════════════════════════════════════════════════════════════════

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  tag: string;
  description: string[];
  made_to_order_note?: string;
  disclaimer?: string;
  sizes: string[];
  created_at?: string;
  updated_at?: string;
}

export async function getProducts(filters?: {
  category?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.tag) params.append("tag", filters.tag);
    if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.search) params.append("search", filters.search);

    const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    
    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/slug/${slug}`);
    
    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function createProduct(productData: Partial<Product>): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create product");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update product");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ORDERS API
// ═══════════════════════════════════════════════════════════════════════════

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  total_amount: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at?: string;
  updated_at?: string;
}

export async function getOrders(filters?: {
  status?: string;
  email?: string;
}): Promise<Order[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.email) params.append("email", filters.email);

    const url = `${API_URL}/orders${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`);
    
    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
}): Promise<Order | null> {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create order");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order | null> {
  try {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update order status");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    return false;
  }
}

export async function getOrderStats(): Promise<{
  totalOrders: number;
  totalRevenue: number;
  statusCounts: Record<string, number>;
  averageOrderValue: number;
} | null> {
  try {
    const response = await fetch(`${API_URL}/orders/stats/summary`);
    
    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════════════

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL.replace("/api", "")}/health`);
    return response.ok;
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
}
