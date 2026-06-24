# E-Commerce Backend API

Express.js + TypeScript backend for the e-commerce platform.

## 🚀 Features

- **RESTful API** with Express.js
- **TypeScript** for type safety
- **CORS** enabled for frontend communication
- **Environment-based configuration**
- **Products API** - CRUD operations
- **Orders API** - Order management
- **Error handling** middleware
- **Request logging**
- **Vercel deployment ready**

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main Express app
│   ├── routes/
│   │   ├── products.ts       # Products endpoints
│   │   └── orders.ts         # Orders endpoints
├── dist/                     # Compiled JavaScript (generated)
├── .env                      # Environment variables (git-ignored)
├── .env.example              # Example environment file
├── package.json
├── tsconfig.json
└── vercel.json               # Vercel deployment config
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Get these from Supabase Dashboard → Settings → API
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Setup Supabase Database

Follow the detailed guide: [database/SUPABASE_SETUP.md](./database/SUPABASE_SETUP.md)

**Quick steps:**
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy API credentials to `.env` file
3. Run `database/setup.sql` in Supabase SQL Editor
4. Verify tables are created in Table Editor

### 4. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

You should see:
```
🚀 Server running on http://localhost:5000
🔌 Testing Supabase connection...
✅ Supabase connection successful
```

### 5. Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Root Endpoints

- `GET /` - API information
- `GET /health` - Health check

### Products API (`/api/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/slug/:slug` | Get product by slug |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

**Query Parameters for GET /api/products:**
- `category` - Filter by category
- `tag` - Filter by tag
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search by name

**Example:**
```bash
# Get all products
curl http://localhost:5000/api/products

# Filter by category
curl http://localhost:5000/api/products?category=T-Shirt

# Search products
curl http://localhost:5000/api/products?search=logo
```

### Orders API (`/api/orders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/api/orders` | Create new order |
| PATCH | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders/:id` | Delete order |
| GET | `/api/orders/stats/summary` | Get order statistics |

**Order Status Values:**
- `pending` - Order placed
- `confirmed` - Order confirmed
- `processing` - Being prepared
- `shipped` - In transit
- `delivered` - Delivered
- `cancelled` - Cancelled

**Example:**
```bash
# Create new order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Ahmad Ali",
    "customerEmail": "ahmad@example.com",
    "customerPhone": "+92-300-1234567",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Karachi",
      "state": "Sindh",
      "zipCode": "75500",
      "country": "Pakistan"
    },
    "items": [
      {
        "productId": "1",
        "name": "Classic Logo Tee",
        "price": 11200,
        "quantity": 1,
        "size": "Large"
      }
    ]
  }'

# Update order status
curl -X PATCH http://localhost:5000/api/orders/ORD-001/status \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

## 🔧 Development Scripts

```bash
# Start development server with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `SUPABASE_URL` | Supabase project URL | - |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | - |
| `JWT_SECRET` | JWT signing secret | - |

## 🔐 CORS Configuration

CORS is configured to allow requests from:
- Development: `http://localhost:3000`
- Production: Set via `FRONTEND_URL` environment variable

## 📊 Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔄 Future Enhancements

- [ ] Database integration (Supabase)
- [ ] Authentication & Authorization
- [ ] File upload for product images
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit & integration tests

## 📄 License

ISC
