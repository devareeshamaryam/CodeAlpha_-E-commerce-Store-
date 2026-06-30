// app/(store)/layout.tsx
import Footer from "@/components/Footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}