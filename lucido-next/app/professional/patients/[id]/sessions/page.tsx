"use client";

import { use } from "react";
import Link from "next/link";

export default function SessionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-12 text-center shadow-lg">
        <div className="mb-4 text-6xl">📋</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Sessões</h2>
        <p className="mb-6 text-gray-600">
          Aqui você poderá registrar novas sessões e visualizar o histórico completo.
        </p>
        <Link
          href={`/professional/patients/${id}/timeline`}
          className="text-blue-600 hover:underline"
        >
          ← Voltar para Timeline
        </Link>
      </div>
    </div>
  );
}
