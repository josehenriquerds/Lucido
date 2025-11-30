"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
      <div className="min-h-screen bg-gray-50 font-[var(--font-roboto)]">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-indigo-700">Lúcido Health</h1>
              <p className="text-sm font-medium text-gray-600">Portal do Responsável</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                  {session.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{session.name}</p>
                  <p className="text-xs text-gray-500">{session.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl p-6">{children}</main>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-600">
          <p className="font-medium">Portal de Acompanhamento Terapêutico</p>
          <p className="mt-1 text-xs text-gray-500">Visualização somente leitura</p>
        </footer>
      </div>
    </ClinicalProvider>
  );
}
