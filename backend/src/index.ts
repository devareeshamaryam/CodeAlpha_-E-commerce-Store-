import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/supabase";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ─────────────────────────────────────────────────────────────────

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "E-Commerce API Server",
    version: "1.0.0",
    status: "running",
    database: "Supabase",
    endpoints: {
      products: "/api/products",
      orders: "/api/orders",
      health: "/health",
    },
  });
});

app.get("/health", async (req: Request, res: Response) => {
  const dbConnected = await testConnection();
  
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbConnected ? "connected" : "disconnected",
  });
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ─── Error Handling ─────────────────────────────────────────────────────────

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ─── Start Server ───────────────────────────────────────────────────────────

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, async () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
    
    // Test Supabase connection
    console.log(`\n🔌 Testing Supabase connection...`);
    const connected = await testConnection();
    if (!connected) {
      console.warn(`⚠️  Warning: Supabase connection failed. Check your .env configuration.\n`);
    } else {
      console.log(``);
    }
  });
}

// Export for serverless deployment (Vercel)
export default app;
