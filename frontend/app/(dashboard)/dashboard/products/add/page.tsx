 "use client";

import Link from "next/link";
import { useState, useRef, DragEvent } from "react";

const TAGS         = ["New Arrival", "Best Seller", "Limited Edition", "Sale", "Exclusive"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

type FormState = {
  name: string; slug: string; tag: string; price: string;
  sizes: string[]; description: string; madeToOrderNote: string;
  disclaimer: string; image: string;
};

const EMPTY: FormState = {
  name: "", slug: "", tag: "", price: "", sizes: [],
  description: "", madeToOrderNote: "", disclaimer: "", image: "",
};

/* ── Image Upload Box Component ─────────────────────────────────────────── */
function ImageUploadBox({
  value, onChange,
}: {
  value: string;
  onChange: (src: string) => void;
}) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={`
          relative w-full border-2 border-dashed rounded-sm cursor-pointer transition-colors
          flex flex-col items-center justify-center gap-3 py-10
          ${drag ? "border-black bg-[#f5f5f5]" : "border-[#ddd] bg-[#fafafa] hover:border-black hover:bg-[#f5f5f5]"}
        `}
      >
        {value ? (
          /* Preview */
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-36 h-36 object-contain rounded-sm" />
            <p className="font-sans text-[11px] text-[#888]">Click or drag to replace</p>
          </div>
        ) : (
          /* Empty state */
          <>
            <div className="w-12 h-12 bg-[#f0f0f0] rounded-sm flex items-center justify-center text-[#bbb]">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M12 3v9m0 0l-3-3m3 3l3-3" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-sans text-[13px] font-semibold text-black">
                Click to upload or drag & drop
              </p>
              <p className="font-sans text-[11px] text-[#888] mt-1">
                PNG, JPG, WEBP — max 5MB
              </p>
            </div>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={onFileChange}
      />

      {/* Remove button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-2 font-sans text-[11px] text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          ✕ Remove image
        </button>
      )}
    </div>
  );
}

const inputCls = (err: boolean) =>
  `w-full font-sans text-[13px] text-black bg-white border rounded-sm px-3.5 py-2.5
   placeholder-[#bbb] focus:outline-none transition-colors
   ${err ? "border-red-500 focus:border-red-600" : "border-[#e8e8e8] focus:border-black"}`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e8e8e8] rounded-sm">
      <div className="px-6 py-4 border-b border-[#f2f2f2]">
        <p className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-black">{title}</p>
      </div>
      <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, error, required, children }: {
  label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-sans text-[12px] font-semibold text-black mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="font-sans text-[11px] text-[#888] mb-2">{hint}</p>}
      {children}
      {error && <p className="font-sans text-[11px] text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AddProductPage() {
  const [form, setForm]     = useState<FormState>(EMPTY);
  const [saved, setSaved]   = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set = (key: keyof FormState, value: string | string[]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleSize = (size: string) =>
    set("sizes", form.sizes.includes(size)
      ? form.sizes.filter((s) => s !== size)
      : [...form.sizes, size]);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim())        e.name        = "Product name is required.";
    if (!form.slug.trim())        e.slug        = "Slug is required.";
    if (!form.tag)                e.tag         = "Please select a tag.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
                                  e.price       = "Enter a valid price.";
    if (form.sizes.length === 0)  e.sizes       = "Select at least one size.";
    if (!form.description.trim()) e.description = "Add at least one description line.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    console.log("New product:", { ...form, price: Number(form.price), description: form.description.split("\n").filter(Boolean) });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm(EMPTY);
  };

  return (
    <div className="p-8 max-w-[760px]">
      <div className="mb-8">
        <Link href="/dashboard/products"
          className="inline-flex items-center gap-1.5 font-sans text-[11px] text-[#888] hover:text-black transition-colors mb-3">
          ← All Products
        </Link>
        <p className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#888] mb-1">
          Dashboard / Products / Add
        </p>
        <h1 className="font-sans text-[28px] font-bold text-black leading-none">Add Product</h1>
      </div>

      {saved && (
        <div className="bg-black text-white font-sans text-[13px] px-5 py-3.5 rounded-sm mb-6 flex items-center gap-2">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Product saved successfully.
        </div>
      )}

      <div className="flex flex-col gap-6">
        <Section title="Basic Info">
          <Field label="Product Name" error={errors.name} required>
            <input type="text" value={form.name}
              onChange={(e) => { set("name", e.target.value); if (!form.slug) set("slug", slugify(e.target.value)); }}
              placeholder="e.g. Premium Khaddar Suit" className={inputCls(!!errors.name)} />
          </Field>
          <Field label="Slug" error={errors.slug} hint="Used in the URL: /shop/your-slug" required>
            <input type="text" value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              placeholder="e.g. premium-khaddar-suit" className={inputCls(!!errors.slug)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tag" error={errors.tag} required>
              <select value={form.tag} onChange={(e) => set("tag", e.target.value)} className={inputCls(!!errors.tag)}>
                <option value="">Select a tag</option>
                {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Price (Rs.)" error={errors.price} required>
              <input type="number" value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="e.g. 4500" className={inputCls(!!errors.price)} />
            </Field>
          </div>
        </Section>

        <Section title="Sizes">
          <Field label="Available Sizes" error={errors.sizes} required>
            <div className="flex flex-wrap gap-2 mt-1">
              {SIZE_OPTIONS.map((size) => (
                <button key={size} type="button" onClick={() => toggleSize(size)}
                  className={`font-sans text-[13px] font-medium px-4 py-2 rounded-sm border transition-colors cursor-pointer
                    ${form.sizes.includes(size) ? "bg-black text-white border-black" : "bg-white text-black border-[#ccc] hover:border-black"}`}>
                  {size}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        <Section title="Description">
          <Field label="Description Lines" error={errors.description}
            hint="Each line becomes a bullet point. First line is shown italic bold." required>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={5} placeholder={"Pure Khaddar fabric, winter collection\nMachine washable\nAvailable in multiple colors"}
              className={`${inputCls(!!errors.description)} resize-none`} />
          </Field>
          <Field label="Made to Order Note" hint="Optional — shown above description">
            <input type="text" value={form.madeToOrderNote}
              onChange={(e) => set("madeToOrderNote", e.target.value)}
              placeholder="e.g. Made to order — allow 7–10 days" className={inputCls(false)} />
          </Field>
          <Field label="Disclaimer" hint="Optional — shown below description in grey">
            <textarea value={form.disclaimer} onChange={(e) => set("disclaimer", e.target.value)}
              rows={3} placeholder="e.g. Colours may slightly vary due to photography lighting…"
              className={`${inputCls(false)} resize-none`} />
          </Field>
        </Section>

        <Section title="Media">
          <Field label="Product Image">
            <ImageUploadBox value={form.image} onChange={(src) => set("image", src)} />
          </Field>
        </Section>

        <div className="flex items-center gap-4 pt-2 border-t border-[#e8e8e8]">
          <button type="button" onClick={handleSubmit}
            className="flex items-center gap-2 bg-black text-white font-sans text-[12px] font-semibold uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-[#1a1a1a] transition-colors cursor-pointer">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Save Product
          </button>
          <Link href="/dashboard/products" className="font-sans text-[12px] text-[#888] hover:text-black transition-colors">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}