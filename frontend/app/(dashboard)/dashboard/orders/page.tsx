"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
};

type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
};

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  total_amount: number;
  status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed:  "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-purple-100 text-purple-800 border-purple-200",
  shipped:    "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered:  "bg-green-100 text-green-800 border-green-200",
  cancelled:  "bg-red-100 text-red-800 border-red-200",
};

const ALL_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<Order | null>(null);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updating, setUpdating]     = useState(false);

  const fetchOrders = async () => {
    try {
      const res  = await fetch(`${API_URL}/orders`);
      const json = await res.json();
      if (json.success) setOrders(json.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res  = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selected?.id === orderId) setSelected((o) => o ? { ...o, status: newStatus } : o);
      }
    } catch {
      alert("Status update failed!");
    } finally {
      setUpdating(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="p-8 max-w-[1200px]">

      {/* Header */}
      <div className="mb-8">
        <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#888] mb-1">
          Dashboard / Orders
        </p>
        <h1 className="font-sans text-[28px] font-bold text-black leading-none">All Orders</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders",   value: orders.length },
          { label: "Pending",        value: pendingCount },
          { label: "Delivered",      value: orders.filter((o) => o.status === "delivered").length },
          { label: "Total Revenue",  value: `Rs. ${totalRevenue.toLocaleString("en-PK")}` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e8e8e8] rounded-sm px-6 py-5">
            <p className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-[#888] mb-1">
              {stat.label}
            </p>
            <p className="font-sans text-[26px] font-bold text-black leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]"
            width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by name, email, order ID…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e8e8e8] rounded-sm font-sans text-[13px] text-black placeholder-[#bbb] focus:outline-none focus:border-black transition-colors" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="font-sans text-[13px] text-black border border-[#e8e8e8] rounded-sm px-4 py-2.5 focus:outline-none focus:border-black bg-white cursor-pointer">
          <option value="all">All Status</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-6">
        {/* Orders Table */}
        <div className={`bg-white border border-[#e8e8e8] rounded-sm overflow-hidden ${selected ? "flex-1" : "w-full"}`}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                {["Order ID", "Customer", "Items", "Total", "Status", "Date", ""].map((col) => (
                  <th key={col} className="text-left font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#888] px-4 py-3.5">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center font-sans text-[13px] text-[#bbb]">
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center font-sans text-[13px] text-[#bbb]">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order, i) => (
                  <tr key={order.id}
                    onClick={() => setSelected(selected?.id === order.id ? null : order)}
                    className={`border-b border-[#f2f2f2] cursor-pointer transition-colors
                      ${i === filtered.length - 1 ? "border-b-0" : ""}
                      ${selected?.id === order.id ? "bg-[#f5f5f5]" : "hover:bg-[#fafafa]"}`}>
                    <td className="px-4 py-3.5">
                      <p className="font-sans text-[11px] text-[#888] font-mono">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-sans text-[13px] font-semibold text-black">{order.customer_name}</p>
                      <p className="font-sans text-[11px] text-[#888]">{order.customer_email}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-sans text-[13px] text-black">{order.items?.length || 0} item(s)</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-sans text-[13px] font-semibold text-black">
                        Rs. {order.total_amount.toLocaleString("en-PK")}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`font-sans text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-sans text-[12px] text-[#888]">
                        {new Date(order.created_at).toLocaleDateString("en-PK", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-[#ccc]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Order Detail Panel */}
        {selected && (
          <div className="w-[360px] shrink-0 bg-white border border-[#e8e8e8] rounded-sm h-fit sticky top-6">
            {/* Panel Header */}
            <div className="px-5 py-4 border-b border-[#f2f2f2] flex items-center justify-between">
              <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-black">
                Order #{selected.id.slice(0, 8).toUpperCase()}
              </p>
              <button onClick={() => setSelected(null)} className="text-[#888] hover:text-black transition-colors cursor-pointer">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-4 flex flex-col gap-5">

              {/* Status Update */}
              <div>
                <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2">Status</p>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusUpdate(selected.id, e.target.value)}
                  disabled={updating}
                  className="w-full font-sans text-[13px] text-black border border-[#e8e8e8] rounded-sm px-3 py-2 focus:outline-none focus:border-black bg-white cursor-pointer disabled:opacity-50">
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Customer Info */}
              <div>
                <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2">Customer</p>
                <div className="bg-[#fafafa] rounded-sm px-4 py-3 flex flex-col gap-1.5">
                  <p className="font-sans text-[13px] font-semibold text-black">{selected.customer_name}</p>
                  <p className="font-sans text-[12px] text-[#555]">{selected.customer_email}</p>
                  <p className="font-sans text-[12px] text-[#555]">{selected.customer_phone}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2">Shipping Address</p>
                <div className="bg-[#fafafa] rounded-sm px-4 py-3">
                  <p className="font-sans text-[12px] text-[#555] leading-relaxed">
                    {selected.shipping_address?.street}<br />
                    {selected.shipping_address?.city}, {selected.shipping_address?.state} {selected.shipping_address?.zip_code}<br />
                    {selected.shipping_address?.country}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2">Items Ordered</p>
                <div className="flex flex-col gap-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="bg-[#fafafa] rounded-sm px-4 py-3 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-sans text-[13px] font-semibold text-black leading-tight">{item.name}</p>
                        <p className="font-sans text-[11px] text-[#888] mt-0.5">
                          Size: {item.size} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-sans text-[13px] font-semibold text-black shrink-0">
                        Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-[#f2f2f2] pt-4 flex items-center justify-between">
                <p className="font-sans text-[13px] font-semibold text-black">Total</p>
                <p className="font-sans text-[16px] font-bold text-black">
                  Rs. {selected.total_amount.toLocaleString("en-PK")}
                </p>
              </div>

              {/* Order Date */}
              <p className="font-sans text-[11px] text-[#888]">
                Placed on {new Date(selected.created_at).toLocaleDateString("en-PK", {
                  day: "numeric", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })}
              </p>

            </div>
          </div>
        )}
      </div>

      <p className="font-sans text-[11px] text-[#bbb] mt-4">
        Showing {filtered.length} of {orders.length} orders
      </p>
    </div>
  );
}