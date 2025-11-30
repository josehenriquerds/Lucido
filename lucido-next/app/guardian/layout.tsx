"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, logout } from "@/lib/auth/auth-service";
import { ClinicalProvider } from "@/components/clinical-provider";

export default function GuardianLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = getSession();

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
    }
  }, [session, router]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (!session) {
    return null;
  }

  return (
    <ClinicalProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-purple-600">Lúcido</h1>
              <p className="text-sm text-gray-600">Área da Família</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-lg">
                  {session.avatar || "👤"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{session.name}</p>
                  <p className="text-xs text-gray-500">{session.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl p-6">{children}</main>

        {/* Footer */}
        <footer className="mt-12 border-t border-purple-100 bg-white/50 py-6 text-center text-sm text-gray-600">
          <p>Área de visualização para responsáveis • Somente leitura</p>
        </footer>
      </div>
    </ClinicalProvider>
  );
}
