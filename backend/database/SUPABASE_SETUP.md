# Supabase Setup Guide

Complete guide to set up Supabase database for the E-Commerce backend.

## 📋 Prerequisites

- Supabase account (free tier works fine)
- Backend `.env` file configured

## 🚀 Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a new account
3. Click **"New Project"**
4. Fill in project details:
   - **Name**: `e-commerce-project` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
5. Click **"Create new project"**
6. Wait 2-3 minutes for project initialization

### 2. Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Update your backend `.env` file:

   ```env
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 3. Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire content from `setup.sql` file
4. Paste it into the SQL editor
5. Click **"Run"** (or press `Ctrl + Enter`)
6. You should see: ✅ Success. No rows returned

### 4. Verify Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see 3 tables:
   - ✅ `products`
   - ✅ `orders`
   - ✅ `customers`
3. Click on `products` table - you should see 6 sample products

### 5. Configure Row Level Security (RLS)

RLS is already configured in the setup.sql script, but here's what it does:

**Products Table:**
- ✅ Public can read all products (for shop frontend)
- ✅ Authenticated users can create/update/delete (for admin)

**Orders Table:**
- ✅ Anyone can create orders (for checkout)
- ✅ Authenticated users can read/update/delete (for admin)

**Customers Table:**
- ✅ Authenticated users can manage customers

### 6. Test Connection

Run your backend server:

```bash
npm run dev
```

You should see:
```
✅ Supabase connection successful
🚀 Server running on http://localhost:5000
```

### 7. Test API Endpoints

Open a new terminal and test:

```bash
# Get all products
curl http://localhost:5000/api/products

# Get product by ID (use actual UUID from your database)
curl http://localhost:5000/api/products/<product-id>

# Get all orders
curl http://localhost:5000/api/orders
```

## 🎯 Database Schema

### Products Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| slug | TEXT | Unique URL slug |
| name | TEXT | Product name |
| price | NUMERIC | Price in PKR |
| image | TEXT | Image URL/path |
| category | TEXT | Product category |
| tag | TEXT | Display tag |
| description | TEXT[] | Array of description lines |
| made_to_order_note | TEXT | Optional note |
| disclaimer | TEXT | Optional disclaimer |
| sizes | TEXT[] | Available sizes |
| created_at | TIMESTAMPTZ | Auto-generated |
| updated_at | TIMESTAMPTZ | Auto-updated on change |

### Orders Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| customer_name | TEXT | Customer name |
| customer_email | TEXT | Customer email |
| customer_phone | TEXT | Customer phone |
| shipping_address | JSONB | Address object |
| items | JSONB | Order items array |
| total_amount | NUMERIC | Total order amount |
| status | TEXT | Order status (enum) |
| created_at | TIMESTAMPTZ | Auto-generated |
| updated_at | TIMESTAMPTZ | Auto-updated on change |

## 🔍 Useful SQL Queries

### Get all products by category
```sql
SELECT * FROM products WHERE category = 'T-Shirt';
```

### Search products by name
```sql
SELECT * FROM products WHERE name ILIKE '%logo%';
```

### Get orders by status
```sql
SELECT * FROM orders WHERE status = 'pending';
```

### Get total revenue
```sql
SELECT SUM(total_amount) as total_revenue FROM orders;
```

### Get order statistics
```sql
SELECT status, COUNT(*), SUM(total_amount) 
FROM orders 
GROUP BY status;
```

## 🛡️ Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** - Don't hardcode credentials
3. **Enable RLS** - Already configured in setup.sql
4. **Use HTTPS** - Supabase uses HTTPS by default
5. **Rotate API keys** - If accidentally exposed
6. **Use service role key carefully** - Only for backend, never in frontend

## 🔄 Database Migrations

To make changes to your database:

1. Go to Supabase **SQL Editor**
2. Write your migration SQL
3. Test in development first
4. Save queries for future reference

Example migration - Add new column:
```sql
ALTER TABLE products 
ADD COLUMN stock_quantity INTEGER DEFAULT 0;
```

## 📊 Monitoring

1. Go to **Database** → **Performance** in Supabase
2. Monitor:
   - Query performance
   - Connection pooling
   - Table sizes
   - Index usage

## 🐛 Troubleshooting

### Connection Failed
- ✅ Check `.env` has correct SUPABASE_URL and SUPABASE_ANON_KEY
- ✅ Verify Supabase project is active (not paused)
- ✅ Check internet connection

### RLS Blocking Queries
- ✅ Disable RLS temporarily: `ALTER TABLE products DISABLE ROW LEVEL SECURITY;`
- ✅ Or use service role key (not recommended for frontend)

### Slow Queries
- ✅ Add indexes for frequently queried columns
- ✅ Use `EXPLAIN ANALYZE` to debug
- ✅ Check Supabase query performance dashboard

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] API credentials added to `.env`
- [ ] setup.sql executed successfully
- [ ] Tables visible in Table Editor
- [ ] Sample data present in products table
- [ ] Backend server connects successfully
- [ ] API endpoints return data
- [ ] RLS policies configured

## 🎉 Next Steps

After setup:
1. Test all API endpoints
2. Create admin authentication
3. Connect frontend to backend API
4. Deploy to production
5. Set up automated backups

---

**Need Help?**
- Check Supabase [Discord](https://discord.supabase.com)
- Read [Supabase Docs](https://supabase.com/docs)
- Check backend logs: `npm run dev`
