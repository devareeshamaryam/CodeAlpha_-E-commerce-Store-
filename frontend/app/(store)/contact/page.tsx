 // app/contact/page.tsx
"use client";

import CTABar from "@/components/CTABar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((er) => ({ ...er, [field]: undefined }));
    };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);

    try {
      // TODO: connect to a real backend endpoint when available
      // const res = await fetch(`${API_URL}/contact`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      // const json = await res.json();
      // if (!json.success) throw new Error(json.error);

      await new Promise((r) => setTimeout(r, 600)); // placeholder delay
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setApiError("Message send nahi ho saka. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-black min-h-screen">
      <CTABar />
      <Header logoSrc="/download.png" forceWhite />

      <div className="max-w-[900px] mx-auto px-6 py-16">
        <h1 className="font-display text-[56px] sm:text-[72px] uppercase leading-none text-white mb-12">
          Get In Touch
        </h1>

        <div className="border border-[#2a2a2a] rounded-sm">
          <div className="px-8 sm:px-10 py-7 border-b border-[#2a2a2a]">
            <h2 className="font-sans text-[22px] font-semibold text-white">General</h2>
          </div>

          <div className="px-8 sm:px-10 py-8 flex flex-col gap-6">

            {submitted ? (
              <div className="flex flex-col items-center text-center gap-4 py-10">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black text-[24px]">
                  ✓
                </div>
                <p className="font-sans text-[18px] font-semibold text-white">Message sent!</p>
                <p className="font-sans text-[13px] text-[#999]">We&apos;ll get back to you as soon as possible.</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 font-sans text-[12px] font-semibold uppercase tracking-wide text-white underline hover:text-[#ccc] transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                {apiError && (
                  <div className="bg-red-950 border border-red-800 text-red-300 font-sans text-[13px] px-4 py-3 rounded-sm">
                    ❌ {apiError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-sans text-[12px] font-semibold uppercase tracking-wide text-white">
                      Name
                    </label>
                    <input
                      id="name" type="text" value={form.name} onChange={set("name")}
                      placeholder="Jane Smith"
                      className={`bg-[#141414] border rounded-sm px-4 py-3 font-sans text-[14px] text-white placeholder-[#666] focus:outline-none transition-colors
                        ${errors.name ? "border-red-600" : "border-[#2a2a2a] focus:border-white"}`}
                    />
                    {errors.name && <p className="font-sans text-[11px] text-red-400">{errors.name}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-sans text-[12px] font-semibold uppercase tracking-wide text-white">
                      Email
                    </label>
                    <input
                      id="email" type="email" value={form.email} onChange={set("email")}
                      placeholder="name@gmail.com"
                      className={`bg-[#141414] border rounded-sm px-4 py-3 font-sans text-[14px] text-white placeholder-[#666] focus:outline-none transition-colors
                        ${errors.email ? "border-red-600" : "border-[#2a2a2a] focus:border-white"}`}
                    />
                    {errors.email && <p className="font-sans text-[11px] text-red-400">{errors.email}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="font-sans text-[12px] font-semibold uppercase tracking-wide text-white">
                    Subject
                  </label>
                  <input
                    id="subject" type="text" value={form.subject} onChange={set("subject")}
                    placeholder="Enter subject"
                    className={`bg-[#141414] border rounded-sm px-4 py-3 font-sans text-[14px] text-white placeholder-[#666] focus:outline-none transition-colors
                      ${errors.subject ? "border-red-600" : "border-[#2a2a2a] focus:border-white"}`}
                  />
                  {errors.subject && <p className="font-sans text-[11px] text-red-400">{errors.subject}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-sans text-[12px] font-semibold uppercase tracking-wide text-white">
                    Message
                  </label>
                  <textarea
                    id="message" rows={6} value={form.message} onChange={set("message")}
                    placeholder="Enter message"
                    className={`bg-[#141414] border rounded-sm px-4 py-3 font-sans text-[14px] text-white placeholder-[#666] focus:outline-none transition-colors resize-y
                      ${errors.message ? "border-red-600" : "border-[#2a2a2a] focus:border-white"}`}
                  />
                  {errors.message && <p className="font-sans text-[11px] text-red-400">{errors.message}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-14 bg-white text-black font-sans text-[14px] font-semibold uppercase tracking-wide rounded-sm hover:bg-[#eaeaea] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
              </>
            )}

          </div>
        </div>
      </div>

     </div>
  );
}