"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getSession, logout } from "@/lib/auth/auth-service";
import { ClinicalProvider } from "@/components/clinical-provider";

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = getSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
    }
  }, [session, router]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const navItems = [
    { href: "/professional/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/professional/patients", label: "Pacientes", icon: "👥" },
    { href: "/professional/chat", label: "Chat", icon: "💬" },
    { href: "/professional/organizations", label: "Organização", icon: "🏥" },
    { href: "/professional/profile-settings", label: "Configurações", icon: "⚙️" },
  ];

  if (!session) {
    return null;
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-blue-600">Lúcido</h1>
        <p className="text-xs text-gray-500">Área Profissional</p>
      </div>

      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg">
            {session.avatar || "👤"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-gray-800">{session.name}</p>
            <p className="truncate text-xs text-gray-500">{session.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <span>🚪</span>
          <span>Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <ClinicalProvider>
      <div className="flex min-h-screen bg-gray-50">
        <aside className="hidden w-64 bg-white shadow-lg lg:block">
          <SidebarContent />
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setIsSidebarOpen(false)} />
            <aside className="relative h-full w-72 bg-white shadow-xl">
              <SidebarContent />
            </aside>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm"
              >
                ☰ Menu
              </button>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="hidden sm:inline">{session.name}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ClinicalProvider>
  );
}
