"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useClinical } from "@/components/clinical-provider";
import {
  SESSION_TYPE_LABELS,
  THERAPEUTIC_AREA_LABELS,
  SessionType,
} from "@/lib/types/clinical";

export default function SessionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPatientSummary, getSessionsByPatient } = useClinical();
  const [filterType, setFilterType] = useState<SessionType | "ALL">("ALL");

  const summary = getPatientSummary(id);

  if (!summary) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow-sm">
        <p className="text-gray-600">Paciente não encontrado</p>
      </div>
    );
  }

  const { patient } = summary;
  let sessions = getSessionsByPatient(id);

  // Aplicar filtro
  if (filterType !== "ALL") {
    sessions = sessions.filter((s) => s.sessionType === filterType);
  }

  // Estatísticas
  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgDuration = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;

  const sessionsByType = sessions.reduce((acc, session) => {
    acc[session.sessionType] = (acc[session.sessionType] || 0) + 1;
    return acc;
  }, {} as Record<SessionType, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/professional/patients/${id}/timeline`}
          className="text-sm text-indigo-600 hover:text-indigo-700 mb-2 inline-block font-medium"
        >
          ← Voltar à Timeline
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Sessões Terapêuticas</h1>
        <p className="mt-1 text-gray-600">{patient.name}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{sessions.length}</div>
          <div className="text-sm text-indigo-100 font-medium">Total de Sessões</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-sm border border-blue-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{avgDuration}</div>
          <div className="text-sm text-blue-100 font-medium">Duração Média (min)</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{totalDuration}</div>
          <div className="text-sm text-indigo-100 font-medium">Total de Horas (min)</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-sm border border-blue-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">
            {new Set(sessions.map((s) => s.professionalId)).size}
          </div>
          <div className="text-sm text-blue-100 font-medium">Profissionais Envolvidos</div>
        </div>
      </div>

      {/* Distribuição por Tipo */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900">Distribuição por Tipo de Sessão</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(sessionsByType)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => (
              <div key={type} className="rounded-md bg-indigo-50 p-4 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">
                    {SESSION_TYPE_LABELS[type as SessionType]}
                  </span>
                  <span className="text-xl font-bold text-indigo-600">{count}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${(count / sessions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Filtro */}
      <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por tipo:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as SessionType | "ALL")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="ALL">Todos os tipos</option>
            {Object.entries(SESSION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Sessões */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900">
            Histórico de Sessões ({sessions.length})
          </h2>
        </div>

        {sessions.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <div className="mb-3 flex justify-center">
              <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p>Nenhuma sessão registrada com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const professional = summary.activeProfessionals.find(
                (p) => p.userId === session.professionalId
              );

              return (
                <div
                  key={session.id}
                  className="rounded-md border-2 border-gray-200 bg-gray-50 p-5 hover:border-indigo-300 transition"
                >
                  {/* Cabeçalho da Sessão */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {SESSION_TYPE_LABELS[session.sessionType]}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {professional?.user.name || "Profissional"}
                          {professional?.roleInCase && ` • ${professional.roleInCase}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date(session.sessionDate).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(session.sessionDate).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {session.areaFocus && (
                      <span className="rounded-md bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-200">
                        {THERAPEUTIC_AREA_LABELS[session.areaFocus]}
                      </span>
                    )}
                    {session.duration && (
                      <span className="flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {session.duration} minutos
                      </span>
                    )}
                    {session.objectiveIds.length > 0 && (
                      <span className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {session.objectiveIds.length} objetivo(s)
                      </span>
                    )}
                  </div>

                  {/* Observações */}
                  {session.observations && (
                    <div className="mb-3 rounded-md bg-white p-4 border-l-4 border-indigo-500">
                      <div className="mb-1 text-xs font-semibold text-gray-600">
                        Observações
                      </div>
                      <p className="text-sm text-gray-800">{session.observations}</p>
                    </div>
                  )}

                  {/* Plano */}
                  {session.plan && (
                    <div className="rounded-md bg-white p-4 border-l-4 border-green-500">
                      <div className="mb-1 text-xs font-semibold text-gray-600">
                        Plano para Próxima Sessão
                      </div>
                      <p className="text-sm text-gray-800">{session.plan}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Botão de Nova Sessão */}
      <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 p-8 text-center shadow-sm border border-indigo-200">
        <div className="mb-3 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">Registrar Nova Sessão</h3>
        <p className="mb-4 text-sm text-gray-600">
          Documente o atendimento realizado com {patient.name.split(" ")[0]}
        </p>
        <button className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 transition border border-indigo-700">
          Criar Sessão
        </button>
      </div>
    </div>
  );
}
