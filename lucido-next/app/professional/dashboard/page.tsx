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
        <h1 className="text-3xl font-bold text-gray-800">
          Olá, {currentUser.name.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-gray-600">Bem-vindo(a) ao seu painel profissional</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="mb-2 text-3xl">👥</div>
          <div className="text-3xl font-bold">{totalPatients}</div>
          <div className="text-sm text-blue-100">Pacientes Ativos</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="mb-2 text-3xl">📅</div>
          <div className="text-3xl font-bold">{sessionsThisWeek}</div>
          <div className="text-sm text-green-100">Sessões esta Semana</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="mb-2 text-3xl">📊</div>
          <div className="text-3xl font-bold">{sessions.length}</div>
          <div className="text-sm text-purple-100">Total de Sessões</div>
        </div>
      </div>

      {/* Meus Pacientes */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Meus Pacientes</h2>
          <Link
            href="/professional/patients"
            className="text-sm text-blue-600 hover:text-blue-700"
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
                className="flex items-start gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
                  {patient.sex === "MALE" ? "👦" : "👧"}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                  <p className="text-sm text-gray-500">
                    {patient.diagnoses.join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date().getFullYear() - patient.birthDate.getFullYear()} anos
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Sessões Recentes */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Sessões Recentes</h2>

        {mySessions.length === 0 ? (
          <p className="text-gray-500">Nenhuma sessão registrada ainda.</p>
        ) : (
          <div className="space-y-3">
            {mySessions.map((session) => {
              const patient = patients.find((p) => p.id === session.patientId);
              return (
                <div
                  key={session.id}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl">
                    {patient?.sex === "MALE" ? "👦" : "👧"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {patient?.name || "Paciente"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {SESSION_TYPE_LABELS[session.sessionType]}
                          {session.areaFocus &&
                            ` • ${THERAPEUTIC_AREA_LABELS[session.areaFocus]}`}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
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
          className="flex items-center gap-4 rounded-xl bg-blue-50 p-6 transition hover:bg-blue-100"
        >
          <div className="text-4xl">👥</div>
          <div>
            <h3 className="font-semibold text-blue-900">Ver Pacientes</h3>
            <p className="text-sm text-blue-700">Acessar lista completa</p>
          </div>
        </Link>

        <div className="flex items-center gap-4 rounded-xl bg-green-50 p-6">
          <div className="text-4xl">➕</div>
          <div>
            <h3 className="font-semibold text-green-900">Nova Sessão</h3>
            <p className="text-sm text-green-700">Registrar atendimento</p>
          </div>
        </div>
      </div>
    </div>
  );
}
