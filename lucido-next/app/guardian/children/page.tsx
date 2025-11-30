"use client";

import Link from "next/link";
import { useClinical } from "@/components/clinical-provider";

export default function GuardianChildrenPage() {
  const { patients, getPatientSummary } = useClinical();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Crianças</h1>
          <p className="text-sm text-gray-600">Gerencie rede de cuidado e prontuário.</p>
        </div>
        <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
          Adicionar criança (em breve)
        </button>
      </div>

      {patients.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-700">Nenhuma criança vinculada ao seu acesso ainda.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => {
            const summary = getPatientSummary(patient.id);
            const age = new Date().getFullYear() - patient.birthDate.getFullYear();
            return (
              <div key={patient.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{patient.name}</h2>
                    <p className="text-sm text-gray-600">
                      {age} anos • {patient.diagnoses.join(", ")}
                    </p>
                  </div>
                  {patient.internalCode && (
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {patient.internalCode}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                  {summary && (
                    <>
                      <span className="rounded-md bg-gray-100 px-2 py-1">
                        {summary.totalSessions} sessões
                      </span>
                      <span className="rounded-md bg-gray-100 px-2 py-1">
                        {summary.totalActivities} atividades
                      </span>
                      <span className="rounded-md bg-gray-100 px-2 py-1">
                        {summary.activeProfessionals.length} profissionais
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-4 grid gap-2 text-sm">
                  <Link
                    href={`/guardian/patient/${patient.id}`}
                    className="rounded-md border border-gray-200 px-3 py-2 font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-700"
                  >
                    Abrir prontuário (leitura)
                  </Link>
                  <Link
                    href={`/guardian/children/${patient.id}/network`}
                    className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    Rede de cuidado
                  </Link>
                  <Link
                    href={`/guardian/patient/${patient.id}/metrics`}
                    className="rounded-md border border-gray-200 px-3 py-2 font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-700"
                  >
                    Métricas lúdicas
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
