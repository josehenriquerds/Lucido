"use client";

import { use } from "react";
import Link from "next/link";
import { useClinical } from "@/components/clinical-provider";

export default function GuardianNetworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPatientSummary, getNetworkForPatient } = useClinical();

  const summary = getPatientSummary(id);
  const network = getNetworkForPatient(id);

  if (!summary) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm">
        <p className="text-gray-600">Paciente não encontrado.</p>
        <Link href="/guardian/children" className="mt-4 inline-block text-indigo-600 hover:underline">
          ← Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/guardian/children" className="text-sm text-indigo-600 hover:underline">
            ← Voltar para Minhas Crianças
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Rede de cuidado</h1>
          <p className="text-sm text-gray-600">{summary.patient.name}</p>
        </div>
        <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
          Adicionar profissional da rede
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Profissionais vinculados</h2>
        {network.length === 0 ? (
          <p className="text-sm text-gray-600">Nenhum profissional vinculado ainda.</p>
        ) : (
          <div className="space-y-3">
            {network.map((prof) => (
              <div
                key={prof.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                    {prof.user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{prof.user.name}</p>
                    <p className="text-xs text-gray-600">{prof.roleInCase}</p>
                    {prof.origin && (
                      <p className="text-[11px] text-indigo-700">
                        Origem: {prof.origin === "FAMILY" ? "Família" : prof.origin === "ORGANIZATION" ? "Organização" : "Rede"}
                      </p>
                    )}
                  </div>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Ativo
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
