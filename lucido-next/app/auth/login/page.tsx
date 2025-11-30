"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, TEST_CREDENTIALS } from "@/lib/auth/auth-service";
import { GlobalRole } from "@/lib/types/clinical";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = login(email, password);

      if (!session) {
        setError("Email ou senha inválidos");
        setLoading(false);
        return;
      }

      // Redirecionar baseado no papel
      if (session.role === GlobalRole.PROFESSIONAL || session.role === GlobalRole.SYSTEM_ADMIN) {
        router.push("/professional/dashboard");
      } else if (session.role === GlobalRole.GUARDIAN) {
        router.push("/guardian/patient/patient-1"); // TODO: pegar ID real
      }
    } catch {
      setError("Erro ao fazer login");
      setLoading(false);
    }
  };

  const quickLogin = (role: "professional" | "guardian" | "admin") => {
    const creds = TEST_CREDENTIALS[role];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">NeuroBridge</h1>
            <p className="text-sm text-gray-600">Prontuário Colaborativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="mb-3 text-center text-xs text-gray-500">Login rápido (ambiente de desenvolvimento):</p>
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => quickLogin("professional")}
                className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-700 transition hover:bg-gray-200"
              >
                👩‍⚕️ Profissional (Dra. Ana)
              </button>
              <button
                type="button"
                onClick={() => quickLogin("guardian")}
                className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-700 transition hover:bg-gray-200"
              >
                👩 Responsável (Maria - Mãe)
              </button>
              <button
                type="button"
                onClick={() => quickLogin("admin")}
                className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-700 transition hover:bg-gray-200"
              >
                🔧 Administrador
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
            ← Voltar para a área da criança
          </Link>
        </div>
      </div>
    </div>
  );
}
