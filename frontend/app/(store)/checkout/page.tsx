 // app/checkout/page.tsx
"use client";

import CTABar from "@/components/CTABar";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  paymentMethod: "cod" | "card";
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
}

const PROVINCES = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
  "Islamabad Capital Territory", "Azad Jammu & Kashmir", "Gilgit-Baltistan",
];

// ─── Input component ─────────────────────────────────────────────────────────

function Field({
  label, id, error, ...props
}: { label: string; id: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-sans text-[13px] font-medium text-black">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={`font-sans text-[14px] text-black border rounded-sm px-4 py-3 focus:outline-none focus:border-black transition-colors
          ${error ? "border-red-500" : "border-[#ccc] hover:border-black"}`}
      />
      {error && <p className="font-sans text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

// ─── Checkout Page ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [placed, setPlaced]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors]   = useState<Partial<Record<keyof FormData, string>>>({});

  const SHIPPING = subtotal > 50000 ? 0 : 350;
  const TOTAL    = subtotal + SHIPPING;

  const [form, setForm] = useState<FormData>({
    email: "", firstName: "", lastName: "",
    address: "", city: "", province: "", postalCode: "", phone: "",
    paymentMethod: "cod",
    cardNumber: "", cardExpiry: "", cardCVV: "",
  });

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.email)      e.email      = "Email is required";
    if (!form.firstName)  e.firstName  = "Required";
    if (!form.lastName)   e.lastName   = "Required";
    if (!form.address)    e.address    = "Address is required";
    if (!form.city)       e.city       = "City is required";
    if (!form.province)   e.province   = "Province is required";
    if (!form.phone)      e.phone      = "Phone is required";
    if (form.paymentMethod === "card") {
      if (!form.cardNumber) e.cardNumber = "Card number is required";
      if (!form.cardExpiry) e.cardExpiry = "Expiry is required";
      if (!form.cardCVV)    e.cardCVV    = "CVV is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name:  `${form.firstName} ${form.lastName}`,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: {
            street:   form.address,
            city:     form.city,
            state:    form.province,
            zip_code: form.postalCode,
            country:  "Pakistan",
          },
          items: items.map((item) => ({
            product_id: item.id,
            name:       item.name,
            price:      item.price,
            quantity:   item.quantity,
            size:       item.size,
          })),
        }),
      });

      const json = await res.json();

      if (json.success) {
        setPlaced(true);
        clearCart();
      } else {
        setApiError(json.error || "Order place nahi ho saka.");
      }
    } catch (err) {
      setApiError("Server se connect nahi ho saka. Backend chal raha hai?");
    } finally {
      setLoading(false);
    }
  };

  // ── Order placed confirmation ──
  if (placed) {
    return (
      <div className="w-full bg-white min-h-screen">
        <CTABar />
        <Header />
        <div className="max-w-[560px] mx-auto px-6 py-24 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-[28px]">
            ✓
          </div>
          <h1 className="font-display text-[40px] uppercase leading-none text-black">Order Placed!</h1>
          <p className="font-sans text-[14px] text-[#555] leading-relaxed">
            Thank you for your order. We&apos;ll send a confirmation to <strong>{form.email}</strong>.
            Your order will be delivered within <strong>2–5 business days</strong>.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-block bg-black text-white font-sans text-[13px] font-semibold uppercase tracking-wide px-8 py-3 rounded-sm hover:bg-[#1a1a1a] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <div className="w-full bg-white min-h-screen">
        <CTABar />
        <Header />
        <div className="max-w-[560px] mx-auto px-6 py-24 text-center">
          <p className="font-sans text-[15px] text-[#aaa]">Your cart is empty.</p>
          <Link href="/shop" className="inline-block mt-4 font-sans text-[13px] font-semibold text-black underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen">
      <CTABar />
      <Header />

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <h1 className="font-display text-[48px] sm:text-[64px] uppercase leading-none text-black mb-10">
          Checkout
        </h1>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-600 font-sans text-[13px] px-5 py-3.5 rounded-sm mb-6">
            ❌ {apiError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">

          {/* ── LEFT: Form ── */}
          <div className="flex flex-col gap-8">

            {/* Contact */}
            <section className="flex flex-col gap-4">
              <h2 className="font-sans text-[15px] font-semibold text-black uppercase tracking-wide border-b border-[#e0e0e0] pb-3">
                Contact
              </h2>
              <Field label="Email address" id="email" type="email"
                value={form.email} onChange={set("email")} error={errors.email}
                placeholder="you@example.com" />
            </section>

            {/* Shipping */}
            <section className="flex flex-col gap-4">
              <h2 className="font-sans text-[15px] font-semibold text-black uppercase tracking-wide border-b border-[#e0e0e0] pb-3">
                Shipping Address
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="First name" id="firstName" value={form.firstName}
                  onChange={set("firstName")} error={errors.firstName} placeholder="Ali" />
                <Field label="Last name" id="lastName" value={form.lastName}
                  onChange={set("lastName")} error={errors.lastName} placeholder="Khan" />
              </div>

              <Field label="Street address" id="address" value={form.address}
                onChange={set("address")} error={errors.address} placeholder="House #, Street, Area" />

              <div className="grid grid-cols-2 gap-4">
                <Field label="City" id="city" value={form.city}
                  onChange={set("city")} error={errors.city} placeholder="Lahore" />
                <Field label="Postal code" id="postalCode" value={form.postalCode}
                  onChange={set("postalCode")} placeholder="54000" />
              </div>

              {/* Province dropdown */}
              <div className="flex flex-col gap-1">
                <label htmlFor="province" className="font-sans text-[13px] font-medium text-black">
                  Province
                </label>
                <div className="relative">
                  <select
                    id="province"
                    value={form.province}
                    onChange={set("province")}
                    className={`w-full font-sans text-[14px] text-black border rounded-sm px-4 py-3 appearance-none focus:outline-none focus:border-black transition-colors bg-white
                      ${errors.province ? "border-red-500" : "border-[#ccc] hover:border-black"}`}
                  >
                    <option value="">Select province</option>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px]">▼</span>
                </div>
                {errors.province && <p className="font-sans text-[12px] text-red-500">{errors.province}</p>}
              </div>

              <Field label="Phone number" id="phone" type="tel" value={form.phone}
                onChange={set("phone")} error={errors.phone} placeholder="+92 300 0000000" />
            </section>

            {/* Payment */}
            <section className="flex flex-col gap-4">
              <h2 className="font-sans text-[15px] font-semibold text-black uppercase tracking-wide border-b border-[#e0e0e0] pb-3">
                Payment
              </h2>

              {/* COD */}
              <label className={`flex items-center gap-3 border rounded-sm px-4 py-4 cursor-pointer transition-colors
                ${form.paymentMethod === "cod" ? "border-black" : "border-[#ccc] hover:border-black"}`}>
                <input type="radio" name="payment" value="cod"
                  checked={form.paymentMethod === "cod"}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: "cod" }))}
                  className="accent-black w-4 h-4" />
                <div>
                  <p className="font-sans text-[14px] font-semibold text-black">Cash on Delivery</p>
                  <p className="font-sans text-[12px] text-[#888]">Pay when your order arrives</p>
                </div>
              </label>

              {/* Card */}
              <label className={`flex items-center gap-3 border rounded-sm px-4 py-4 cursor-pointer transition-colors
                ${form.paymentMethod === "card" ? "border-black" : "border-[#ccc] hover:border-black"}`}>
                <input type="radio" name="payment" value="card"
                  checked={form.paymentMethod === "card"}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: "card" }))}
                  className="accent-black w-4 h-4" />
                <div>
                  <p className="font-sans text-[14px] font-semibold text-black">Credit / Debit Card</p>
                  <p className="font-sans text-[12px] text-[#888]">Visa, Mastercard, UnionPay</p>
                </div>
              </label>

              {/* Card fields */}
              {form.paymentMethod === "card" && (
                <div className="flex flex-col gap-4 border border-[#e0e0e0] rounded-sm p-4 mt-1">
                  <Field label="Card number" id="cardNumber" value={form.cardNumber}
                    onChange={set("cardNumber")} error={errors.cardNumber}
                    placeholder="1234 5678 9012 3456" maxLength={19} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry (MM/YY)" id="cardExpiry" value={form.cardExpiry}
                      onChange={set("cardExpiry")} error={errors.cardExpiry} placeholder="08/28" maxLength={5} />
                    <Field label="CVV" id="cardCVV" value={form.cardCVV}
                      onChange={set("cardCVV")} error={errors.cardCVV} placeholder="123" maxLength={4} />
                  </div>
                </div>
              )}
            </section>

            {/* Place Order — desktop bottom */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="hidden lg:flex w-full h-14 bg-black text-white font-sans text-[15px] font-semibold uppercase tracking-wide items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Placing Order..." : `Place Order · Rs. ${TOTAL.toLocaleString("en-PK")}`}
            </button>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-8">
            <h2 className="font-sans text-[15px] font-semibold text-black uppercase tracking-wide border-b border-[#e0e0e0] pb-3">
              Order Summary
            </h2>

            {/* Items */}
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 items-center">
                  <div className="relative w-16 h-16 shrink-0 bg-[#f2f2f2] rounded-sm overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                    {/* Qty badge */}
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-sans text-[13px] text-black leading-snug line-clamp-2">{item.name}</p>
                    <p className="font-sans text-[12px] text-[#888]">Size: {item.size}</p>
                  </div>
                  <p className="font-sans text-[13px] font-semibold text-black shrink-0">
                    Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-[#e0e0e0] pt-4 flex flex-col gap-2">
              <div className="flex justify-between font-sans text-[13px] text-[#555]">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString("en-PK")}</span>
              </div>
              <div className="flex justify-between font-sans text-[13px] text-[#555]">
                <span>Shipping</span>
                <span>{SHIPPING === 0 ? "Free" : `Rs. ${SHIPPING.toLocaleString("en-PK")}`}</span>
              </div>
              <div className="flex justify-between font-sans text-[15px] font-semibold text-black border-t border-[#e0e0e0] pt-3 mt-1">
                <span>Total</span>
                <span>Rs. {TOTAL.toLocaleString("en-PK")}</span>
              </div>
              {SHIPPING > 0 && (
                <p className="font-sans text-[11px] text-[#aaa]">
                  Free shipping on orders over Rs. 50,000
                </p>
              )}
            </div>

            {/* Place Order — mobile/sticky */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="lg:hidden w-full h-14 bg-black text-white font-sans text-[15px] font-semibold uppercase tracking-wide flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Placing Order..." : `Place Order · Rs. ${TOTAL.toLocaleString("en-PK")}`}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}