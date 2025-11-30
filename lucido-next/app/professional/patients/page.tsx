"use client";

import Link from "next/link";
import { useClinical } from "@/components/clinical-provider";
import { SUPPORT_LEVEL_LABELS } from "@/lib/types/clinical";

export default function PatientsPage() {
  const { patients, getPatientSummary } = useClinical();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Meus Pacientes</h1>
        <p className="mt-1 text-gray-600">
          {patients.length} paciente{patients.length !== 1 ? "s" : ""} ativo{patients.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Pacientes Grid */}
      {patients.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
          <div className="mb-4 text-6xl">👥</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            Nenhum paciente ainda
          </h2>
          <p className="text-gray-600">
            Você ainda não tem pacientes atribuídos a você.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => {
            const summary = getPatientSummary(patient.id);
            const age = new Date().getFullYear() - patient.birthDate.getFullYear();

            return (
              <Link
                key={patient.id}
                href={`/professional/patients/${patient.id}/timeline`}
                className="group rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl"
              >
                {/* Avatar */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-4xl shadow-lg">
                    {patient.sex === "MALE" ? "👦" : "👧"}
                  </div>
                  <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    {patient.internalCode || "N/A"}
                  </div>
                </div>

                {/* Info */}
                <h3 className="mb-1 text-xl font-bold text-gray-800 group-hover:text-blue-600">
                  {patient.name}
                </h3>
                <p className="mb-3 text-sm text-gray-600">
                  {age} anos • {patient.sex === "MALE" ? "Masculino" : "Feminino"}
                </p>

                {/* Diagnósticos */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {patient.diagnoses.map((diagnosis, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700"
                    >
                      {diagnosis}
                    </span>
                  ))}
                </div>

                {/* Nível de Suporte */}
                {patient.supportLevel && (
                  <p className="mb-3 text-xs text-gray-500">
                    {SUPPORT_LEVEL_LABELS[patient.supportLevel]}
                  </p>
                )}

                {/* Stats */}
                {summary && (
                  <div className="mt-4 flex gap-4 border-t border-gray-100 pt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">
                        {summary.totalSessions}
                      </div>
                      <div className="text-xs text-gray-500">Sessões</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">
                        {summary.activeObjectives.length}
                      </div>
                      <div className="text-xs text-gray-500">Objetivos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">
                        {summary.activeProfessionals.length}
                      </div>
                      <div className="text-xs text-gray-500">Profissionais</div>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
