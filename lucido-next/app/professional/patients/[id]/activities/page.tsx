"use client";

import { use } from "react";
import Link from "next/link";
import {
  THERAPEUTIC_AREA_LABELS,
  ENGAGEMENT_LEVEL_LABELS,
  HELP_LEVEL_LABELS,
  OUTCOME_LABELS,
} from "@/lib/types/clinical";
import { useClinical } from "@/components/clinical-provider";
import { hasScoreMetrics } from "@/lib/activity-metrics";

export default function PatientActivitiesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPatientSummary, activityExecutions, activities } = useClinical();

  const summary = getPatientSummary(id);

  if (!summary) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow-sm">
        <p className="text-gray-600">Paciente não encontrado</p>
      </div>
    );
  }

  const { patient } = summary;
  const patientExecutions = activityExecutions
    .filter((e) => e.patientId === id)
    .sort((a, b) => b.executionDate.getTime() - a.executionDate.getTime());

  // Estatísticas
  const totalExecutions = patientExecutions.length;
  const digitalActivities = patientExecutions.filter((e) => {
    const activity = activities.find((a) => a.id === e.activityId);
    return activity?.type === "DIGITAL";
  }).length;
  const physicalActivities = totalExecutions - digitalActivities;

  const avgEngagement = patientExecutions.filter((e) => e.engagement === "HIGH").length;
  const completedActivities = patientExecutions.filter((e) => e.outcome === "COMPLETED").length;

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
        <h1 className="text-3xl font-bold text-gray-900">Atividades Terapêuticas</h1>
        <p className="mt-1 text-gray-600">{patient.name}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{totalExecutions}</div>
          <div className="text-sm text-indigo-100 font-medium">Total de Atividades</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-sm border border-blue-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{digitalActivities}</div>
          <div className="text-sm text-blue-100 font-medium">Atividades Digitais</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-sm border border-green-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{physicalActivities}</div>
          <div className="text-sm text-green-100 font-medium">Atividades Físicas</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{avgEngagement}</div>
          <div className="text-sm text-indigo-100 font-medium">Alto Engajamento</div>
        </div>
      </div>

      {/* Taxa de Conclusão */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900">Taxa de Conclusão</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">Atividades Concluídas</span>
              <span className="font-semibold text-green-600">
                {completedActivities} de {totalExecutions}
              </span>
            </div>
            <div className="h-3 rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-green-600 transition-all"
                style={{
                  width: `${totalExecutions > 0 ? (completedActivities / totalExecutions) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {totalExecutions > 0 ? Math.round((completedActivities / totalExecutions) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900">
            Histórico de Atividades ({patientExecutions.length})
          </h2>
        </div>

        {patientExecutions.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <div className="mb-3 flex justify-center">
              <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p>Nenhuma atividade registrada ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {patientExecutions.map((execution) => {
              const activity = activities.find((a) => a.id === execution.activityId);
              const metrics = execution.metricsJson;
              const accuracyMetrics = hasScoreMetrics(metrics) ? metrics : null;
              const syllableMetrics =
                typeof metrics?.syllablesFormed === "number" &&
                typeof metrics.totalAttempts === "number"
                  ? metrics
                  : null;

              return (
                <div
                  key={execution.id}
                  className="rounded-md border-2 border-gray-200 bg-gray-50 p-5 hover:border-indigo-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                          {activity?.type === "DIGITAL" ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {activity?.name || "Atividade"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(execution.executionDate).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {activity && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-md bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-200">
                            {THERAPEUTIC_AREA_LABELS[activity.mainObjective]}
                          </span>
                          {execution.engagement && (
                            <span
                              className={`rounded-md px-3 py-1 text-xs font-medium border ${
                                execution.engagement === "HIGH"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : execution.engagement === "MEDIUM"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  : "bg-orange-100 text-orange-700 border-orange-200"
                              }`}
                            >
                              {ENGAGEMENT_LEVEL_LABELS[execution.engagement]}
                            </span>
                          )}
                          {execution.helpLevel && (
                            <span className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                              {HELP_LEVEL_LABELS[execution.helpLevel]}
                            </span>
                          )}
                          {execution.outcome && (
                            <span
                              className={`rounded-md px-3 py-1 text-xs font-medium border ${
                                execution.outcome === "COMPLETED"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : execution.outcome === "PARTIAL"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  : "bg-red-100 text-red-700 border-red-200"
                              }`}
                            >
                              {OUTCOME_LABELS[execution.outcome]}
                            </span>
                          )}
                        </div>
                      )}

                      {execution.notes && (
                        <div className="mt-3 flex items-start gap-2 text-sm text-gray-700 bg-white p-3 rounded-md border border-gray-200">
                          <svg className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{execution.notes}</span>
                        </div>
                      )}

                      {/* Métricas */}
                      {metrics && (
                        <div className="mt-3 rounded-md bg-indigo-50 p-3 border border-indigo-200">
                          <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-indigo-900">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Métricas de Desempenho
                          </div>
                          <div className="grid gap-2 md:grid-cols-3 text-sm">
                            {accuracyMetrics && (
                              <div>
                                <span className="text-gray-600">Acertos: </span>
                                <span className="font-semibold text-green-600">
                                  {accuracyMetrics.correctAnswers}/{accuracyMetrics.totalQuestions}
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                  (
                                  {Math.round(
                                    (accuracyMetrics.correctAnswers / accuracyMetrics.totalQuestions) * 100
                                  )}
                                  %)
                                </span>
                              </div>
                            )}
                            {metrics.averageResponseTime !== undefined && (
                              <div>
                                <span className="text-gray-600">Tempo médio: </span>
                                <span className="font-semibold text-blue-600">
                                  {metrics.averageResponseTime}s
                                </span>
                              </div>
                            )}
                            {metrics.hintsUsed !== undefined && (
                              <div>
                                <span className="text-gray-600">Dicas usadas: </span>
                                <span className="font-semibold text-indigo-600">
                                  {metrics.hintsUsed}
                                </span>
                              </div>
                            )}
                            {syllableMetrics && (
                              <div>
                                <span className="text-gray-600">Sílabas formadas: </span>
                                <span className="font-semibold text-green-600">
                                  {syllableMetrics.syllablesFormed}/{syllableMetrics.totalAttempts}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {execution.duration && (
                      <div className="ml-4 text-right">
                        <div className="text-xs text-gray-500 font-medium">Duração</div>
                        <div className="text-lg font-semibold text-gray-700">
                          {execution.duration} min
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Catálogo de Atividades Disponíveis */}
      <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-sm border border-indigo-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-bold text-indigo-900">Atividades Disponíveis</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activities
            .filter((a) => a.isActive)
            .slice(0, 6)
            .map((activity) => (
              <div key={activity.id} className="rounded-md bg-white p-4 shadow-sm border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 flex-shrink-0">
                    {activity.type === "DIGITAL" ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                    <p className="mt-1 text-xs text-gray-600">{activity.description}</p>
                    <div className="mt-2">
                      <span className="rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 border border-indigo-200">
                        {THERAPEUTIC_AREA_LABELS[activity.mainObjective]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
