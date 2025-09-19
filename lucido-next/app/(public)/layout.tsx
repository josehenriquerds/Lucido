import type { ReactNode } from "react";

import { Navbar } from "@/components/navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col gap-6 px-4 pb-32 pt-10 md:px-8">
      {children}
      <Navbar />
    </div>
  );
}
