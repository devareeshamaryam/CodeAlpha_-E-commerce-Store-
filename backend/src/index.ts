 import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { testConnection } from "./config/supabase";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "E-Commerce API Server",
    version: "1.0.0",
    status: "running",
    database: "Supabase",
    endpoints: { products: "/api/products", orders: "/api/orders", health: "/health" },
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

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found", message: `Cannot ${req.method} ${req.path}` });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, async () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
    console.log(`\n🔌 Testing Supabase connection...`);
    const connected = await testConnection();
    if (!connected) {
      console.warn(`⚠️  Warning: Supabase connection failed. Check your .env configuration.\n`);
    }
  });
}

export default app;