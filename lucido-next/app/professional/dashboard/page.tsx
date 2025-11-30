"use client";

import Link from "next/link";
import { useClinical } from "@/components/clinical-provider";
import { SESSION_TYPE_LABELS, THERAPEUTIC_AREA_LABELS } from "@/lib/types/clinical";

export default function ProfessionalDashboard() {
  const { currentUser, patients, sessions } = useClinical();

  if (!currentUser) {
    return <div>Carregando...</div>;
  }

  // Sessões recentes do profissional
  const mySessions = sessions
    .filter((s) => s.professionalId === currentUser.id)
    .slice(0, 5);

  // Estatísticas
  const totalPatients = patients.length;
  const sessionsThisWeek = mySessions.filter((s) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return s.sessionDate >= weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {currentUser.name.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-gray-600">Bem-vindo(a) ao seu painel profissional</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{totalPatients}</div>
          <div className="text-sm text-indigo-100 font-medium">Pacientes Ativos</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-sm border border-blue-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{sessionsThisWeek}</div>
          <div className="text-sm text-blue-100 font-medium">Sessões esta Semana</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{sessions.length}</div>
          <div className="text-sm text-indigo-100 font-medium">Total de Sessões</div>
        </div>
      </div>

      {/* Meus Pacientes */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Meus Pacientes</h2>
          <Link
            href="/professional/patients"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {patients.length === 0 ? (
          <p className="text-gray-500">Nenhum paciente atribuído ainda.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {patients.map((patient) => (
              <Link
                key={patient.id}
                href={`/professional/patients/${patient.id}/timeline`}
                className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:border-indigo-300 hover:shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">
                    {patient.diagnoses.join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date().getFullYear() - patient.birthDate.getFullYear()} anos
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sessões Recentes */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Sessões Recentes</h2>

        {mySessions.length === 0 ? (
          <p className="text-gray-500">Nenhuma sessão registrada ainda.</p>
        ) : (
          <div className="space-y-3">
            {mySessions.map((session) => {
              const patient = patients.find((p) => p.id === session.patientId);
              return (
                <div
                  key={session.id}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {patient?.name || "Paciente"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {SESSION_TYPE_LABELS[session.sessionType]}
                          {session.areaFocus &&
                            ` • ${THERAPEUTIC_AREA_LABELS[session.areaFocus]}`}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(session.sessionDate).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    {session.observations && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {session.observations}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/professional/patients"
          className="flex items-center gap-4 rounded-lg bg-indigo-50 p-6 transition hover:bg-indigo-100 border border-indigo-200"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900">Ver Pacientes</h3>
            <p className="text-sm text-indigo-700">Acessar lista completa</p>
          </div>
        </Link>

        <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-6 border border-blue-200">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">Nova Sessão</h3>
            <p className="text-sm text-blue-700">Registrar atendimento</p>
          </div>
        </div>
      </div>
    </div>
  );
}
