"use client";

import { use } from "react";
import Link from "next/link";
import { useClinical } from "@/components/clinical-provider";
import { hasResponseTime, hasScoreMetrics } from "@/lib/activity-metrics";

export default function GuardianMetricsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPatientSummary, activityExecutions } = useClinical();

  const summary = getPatientSummary(id);

  if (!summary) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow-sm">
        <p className="text-gray-600">Paciente não encontrado</p>
      </div>
    );
  }

  const { patient, totalActivities } = summary;
  const totalActivitiesCount = Math.max(totalActivities, 1);

  // Calcular métricas das atividades lúdicas
  const patientExecutions = activityExecutions.filter((e) => e.patientId === id);

  const engagementStats = {
    high: patientExecutions.filter((e) => e.engagement === "HIGH").length,
    medium: patientExecutions.filter((e) => e.engagement === "MEDIUM").length,
    low: patientExecutions.filter((e) => e.engagement === "LOW").length,
  };

  const outcomeStats = {
    completed: patientExecutions.filter((e) => e.outcome === "COMPLETED").length,
    partial: patientExecutions.filter((e) => e.outcome === "PARTIAL").length,
    notCompleted: patientExecutions.filter((e) => e.outcome === "NOT_COMPLETED").length,
  };

  // Últimas 5 atividades
  const recentActivities = patientExecutions
    .sort((a, b) => b.executionDate.getTime() - a.executionDate.getTime())
    .slice(0, 5);

  // Calcular progresso semanal (últimos 7 dias)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const activitiesThisWeek = patientExecutions.filter(
    (e) => e.executionDate >= weekAgo
  ).length;

  // Média de acertos (exemplo das métricas JSON)
  const scoredActivityMetrics = patientExecutions
    .map((execution) => execution.metricsJson)
    .filter(hasScoreMetrics);
  const avgAccuracy =
    scoredActivityMetrics.length > 0
      ? scoredActivityMetrics.reduce(
          (sum, metrics) =>
            sum + (metrics.correctAnswers / metrics.totalQuestions) * 100,
          0
        ) / scoredActivityMetrics.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/guardian/patient/${id}`}
          className="text-sm text-indigo-600 hover:text-indigo-700 mb-2 inline-block font-medium"
        >
          ← Voltar ao perfil
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Métricas e Progresso</h1>
        <p className="mt-1 text-gray-600">{patient.name}</p>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{totalActivities}</div>
          <div className="text-sm text-indigo-100 font-medium">Atividades Realizadas</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-sm border border-blue-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{activitiesThisWeek}</div>
          <div className="text-sm text-blue-100 font-medium">Atividades esta Semana</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{avgAccuracy.toFixed(0)}%</div>
          <div className="text-sm text-indigo-100 font-medium">Taxa de Acerto Média</div>
        </div>
      </div>

      {/* Nível de Engajamento */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Nível de Engajamento</h2>
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">Alto Engajamento</span>
              <span className="font-semibold text-green-600">{engagementStats.high} atividades</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-green-600 transition-all"
                style={{
                  width: `${(engagementStats.high / totalActivitiesCount) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">Médio Engajamento</span>
              <span className="font-semibold text-yellow-600">{engagementStats.medium} atividades</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-yellow-500 transition-all"
                style={{
                  width: `${(engagementStats.medium / totalActivitiesCount) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">Baixo Engajamento</span>
              <span className="font-semibold text-orange-600">{engagementStats.low} atividades</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-orange-500 transition-all"
                style={{
                  width: `${(engagementStats.low / totalActivitiesCount) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Taxa de Conclusão */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Taxa de Conclusão</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md bg-green-50 p-4 text-center border border-green-200">
            <div className="text-3xl font-bold text-green-700">{outcomeStats.completed}</div>
            <div className="text-sm text-gray-600 font-medium mt-1">Concluídas</div>
          </div>
          <div className="rounded-md bg-yellow-50 p-4 text-center border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-700">{outcomeStats.partial}</div>
            <div className="text-sm text-gray-600 font-medium mt-1">Parciais</div>
          </div>
          <div className="rounded-md bg-red-50 p-4 text-center border border-red-200">
            <div className="text-3xl font-bold text-red-700">{outcomeStats.notCompleted}</div>
            <div className="text-sm text-gray-600 font-medium mt-1">Não Concluídas</div>
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Atividades Recentes</h2>

        {recentActivities.length === 0 ? (
          <p className="text-center text-gray-500">Nenhuma atividade registrada ainda.</p>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((execution) => {
              const metrics = execution.metricsJson;
              const hasAccuracyMetrics = hasScoreMetrics(metrics);
              const hasSyllableMetrics = typeof metrics?.syllablesFormed === "number";
              const hasTimingMetrics = hasResponseTime(metrics);
              return (
                <div
                  key={execution.id}
                  className="flex items-start justify-between rounded-md border border-gray-200 p-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${
                        execution.engagement === "HIGH" ? "bg-green-500" :
                        execution.engagement === "MEDIUM" ? "bg-yellow-500" : "bg-orange-500"
                      }`}></div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(execution.executionDate).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-sm text-gray-600">{execution.notes}</p>
                      </div>
                    </div>
                    {(hasAccuracyMetrics || hasSyllableMetrics || hasTimingMetrics) && (
                      <div className="mt-2 flex gap-4 text-xs text-gray-500">
                        {hasAccuracyMetrics && (
                          <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {metrics.correctAnswers}/{metrics.totalQuestions} acertos
                          </span>
                        )}
                        {hasTimingMetrics && (
                          <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {metrics.averageResponseTime}s média
                          </span>
                        )}
                        {hasSyllableMetrics && (
                          <span className="flex items-center gap-1">
                            <svg className="h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {metrics.syllablesFormed} sílabas
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-md px-3 py-1 text-xs font-semibold ${
                        execution.outcome === "COMPLETED"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : execution.outcome === "PARTIAL"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {execution.outcome === "COMPLETED" ? "Concluída" :
                       execution.outcome === "PARTIAL" ? "Parcial" : "Não Concluída"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Insights da Plataforma (Simulação de IA) */}
      <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-sm border border-indigo-200">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-indigo-900">Insights da Plataforma</h2>
            <p className="text-sm text-indigo-700">Análise automática de padrões</p>
          </div>
        </div>

        <div className="space-y-3">
          {engagementStats.high > totalActivities * 0.7 && (
            <div className="rounded-md bg-white p-4 border-l-4 border-green-500 shadow-sm">
              <p className="text-sm text-gray-800">
                <strong className="text-green-700">Ótimo engajamento!</strong> {patient.name.split(" ")[0]} está demonstrando alto interesse em {Math.round((engagementStats.high / totalActivitiesCount) * 100)}% das atividades.
              </p>
            </div>
          )}

          {avgAccuracy > 70 && (
            <div className="rounded-md bg-white p-4 border-l-4 border-blue-500 shadow-sm">
              <p className="text-sm text-gray-800">
                <strong className="text-blue-700">Progresso consistente!</strong> A taxa de acerto está acima de 70%, indicando boa compreensão dos conteúdos.
              </p>
            </div>
          )}

          {activitiesThisWeek > 3 && (
            <div className="rounded-md bg-white p-4 border-l-4 border-indigo-500 shadow-sm">
              <p className="text-sm text-gray-800">
                <strong className="text-indigo-700">Frequência excelente!</strong> {activitiesThisWeek} atividades esta semana. A regularidade é fundamental para o desenvolvimento.
              </p>
            </div>
          )}

          <div className="rounded-md bg-white p-4 border-l-4 border-indigo-600 shadow-sm">
            <p className="text-sm text-gray-800">
              <strong className="text-indigo-700">Dica personalizada:</strong> Com base no histórico, atividades com elementos visuais coloridos têm gerado maior engajamento. Considere jogos com temáticas de dinossauros e cores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
