"use client";

import { use } from "react";
import Link from "next/link";
import { useClinical } from "@/components/clinical-provider";
import { hasResponseTimeExecution, hasScoreMetrics } from "@/lib/activity-metrics";
import { THERAPEUTIC_AREA_LABELS, TherapeuticArea } from "@/lib/types/clinical";

export default function PatientInsightsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPatientSummary, activityExecutions, sessions } = useClinical();

  const summary = getPatientSummary(id);

  if (!summary) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow-sm">
        <p className="text-gray-600">Paciente não encontrado</p>
      </div>
    );
  }

  const { patient } = summary;

  // Análise de padrões das atividades
  const patientExecutions = activityExecutions.filter((e) => e.patientId === id);
  const patientSessions = sessions.filter((s) => s.patientId === id);

  // Análise temporal - últimas 4 semanas
  const weeks = [0, 1, 2, 3]
    .map((weekOffset) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (weekOffset + 1) * 7);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - weekOffset * 7);

      const weekActivities = patientExecutions.filter(
        (e) => e.executionDate >= startDate && e.executionDate < endDate
      );

      const scoredWeekMetrics = weekActivities
        .map((activity) => activity.metricsJson)
        .filter(hasScoreMetrics);
      const avgAccuracy =
        scoredWeekMetrics.length > 0
          ? scoredWeekMetrics.reduce(
              (sum, metrics) =>
                sum + (metrics.correctAnswers / metrics.totalQuestions) * 100,
              0
            ) / scoredWeekMetrics.length
          : 0;

      return {
        label: `Sem ${4 - weekOffset}`,
        activities: weekActivities.length,
        accuracy: avgAccuracy,
        highEngagement: weekActivities.filter((e) => e.engagement === "HIGH").length,
      };
    })
    .reverse();

  // Análise de áreas terapêuticas
  const areaAnalysis = patientSessions.reduce(
    (acc, session) => {
      if (session.areaFocus) {
        const area = session.areaFocus;
        if (!acc[area]) {
          acc[area] = { count: 0, area };
        }
        acc[area].count += 1;
      }
      return acc;
    },
    {} as Record<TherapeuticArea, { count: number; area: TherapeuticArea }>
  );
  const sortedAreas = (
    Object.entries(areaAnalysis) as [TherapeuticArea, { count: number; area: TherapeuticArea }][]
  ).sort(([, a], [, b]) => b.count - a.count);
  const primaryArea = sortedAreas[0]?.[0];

  // Padrões de performance
  const morningActivities = patientExecutions.filter(
    (e) => e.executionDate.getHours() >= 6 && e.executionDate.getHours() < 12
  );
  const afternoonActivities = patientExecutions.filter(
    (e) => e.executionDate.getHours() >= 12 && e.executionDate.getHours() < 18
  );
  const eveningActivities = patientExecutions.filter(
    (e) => e.executionDate.getHours() >= 18
  );

  const morningEngagement = morningActivities.filter((e) => e.engagement === "HIGH").length;
  const afternoonEngagement = afternoonActivities.filter((e) => e.engagement === "HIGH").length;
  const eveningEngagement = eveningActivities.filter((e) => e.engagement === "HIGH").length;

  // Análise de independência
  const independentActivities = patientExecutions.filter(
    (e) => e.helpLevel === "INDEPENDENT"
  ).length;
  const independenceRate = patientExecutions.length > 0
    ? (independentActivities / patientExecutions.length) * 100
    : 0;

  // Análise de tempo de resposta (atividades digitais)
  const activitiesWithTime = patientExecutions
    .filter(hasResponseTimeExecution)
    .sort((a, b) => a.executionDate.getTime() - b.executionDate.getTime());

  const responseTimeTrend =
    activitiesWithTime.length >= 3
      ? activitiesWithTime[activitiesWithTime.length - 1].metricsJson.averageResponseTime <
        activitiesWithTime[0].metricsJson.averageResponseTime
        ? "melhorando"
        : "estável"
      : "insuficiente";
  const showResponseTrend = activitiesWithTime.length >= 3;
  const firstResponseTime =
    activitiesWithTime.length > 0
      ? activitiesWithTime[0].metricsJson.averageResponseTime
      : 0;
  const lastResponseTime =
    activitiesWithTime.length > 0
      ? activitiesWithTime[activitiesWithTime.length - 1].metricsJson.averageResponseTime
      : 0;

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
        <h1 className="text-3xl font-bold text-gray-900">Insights e Análise de Padrões</h1>
        <p className="mt-1 text-gray-600">{patient.name}</p>
      </div>

      {/* Simulação de IA - Banner */}
      <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-300">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Análise Inteligente Ativada</h2>
            <p className="mt-2 text-indigo-100">
              Sistema de reconhecimento de padrões analisando {patientExecutions.length} execuções
              de atividades e {patientSessions.length} sessões terapêuticas.
            </p>
          </div>
        </div>
      </div>

      {/* Progressão Temporal */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900">Progressão nas Últimas 4 Semanas</h2>
        </div>
        <div className="space-y-4">
          {weeks.map((week, idx) => (
            <div key={idx}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">{week.label}</span>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-600">{week.activities} atividades</span>
                  <span className="text-indigo-600">{week.highEngagement} alto engajamento</span>
                  {week.accuracy > 0 && (
                    <span className="text-green-600">{week.accuracy.toFixed(0)}% acurácia</span>
                  )}
                </div>
              </div>
              <div className="h-3 rounded-full bg-gray-200">
                <div
                  className={`h-3 rounded-full transition-all ${
                    week.accuracy >= 70
                      ? "bg-green-600"
                      : week.accuracy >= 50
                      ? "bg-yellow-500"
                      : "bg-orange-500"
                  }`}
                  style={{ width: `${Math.min(week.accuracy, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Padrões Identificados pela IA */}
      <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-sm border border-indigo-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-lg font-bold text-indigo-900">Padrões Identificados</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Melhor período do dia */}
          <div className="rounded-md bg-white p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Melhor Período do Dia</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Manhã (6h-12h)</span>
                <span className={`font-semibold ${morningEngagement === Math.max(morningEngagement, afternoonEngagement, eveningEngagement) ? 'text-green-600' : 'text-gray-600'}`}>
                  {morningActivities.length > 0 ? `${((morningEngagement / morningActivities.length) * 100).toFixed(0)}%` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Tarde (12h-18h)</span>
                <span className={`font-semibold ${afternoonEngagement === Math.max(morningEngagement, afternoonEngagement, eveningEngagement) ? 'text-green-600' : 'text-gray-600'}`}>
                  {afternoonActivities.length > 0 ? `${((afternoonEngagement / afternoonActivities.length) * 100).toFixed(0)}%` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Noite (18h+)</span>
                <span className={`font-semibold ${eveningEngagement === Math.max(morningEngagement, afternoonEngagement, eveningEngagement) ? 'text-green-600' : 'text-gray-600'}`}>
                  {eveningActivities.length > 0 ? `${((eveningEngagement / eveningActivities.length) * 100).toFixed(0)}%` : 'N/A'}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-600 bg-blue-50 p-2 rounded-md border border-blue-200">
              <strong>Insight:</strong> {patient.name.split(' ')[0]} demonstra {
                morningEngagement > Math.max(afternoonEngagement, eveningEngagement) ? 'melhor desempenho pela manhã' :
                afternoonEngagement > eveningEngagement ? 'melhor desempenho à tarde' : 'bom desempenho em todos os períodos'
              }
            </p>
          </div>

          {/* Taxa de Independência */}
          <div className="rounded-md bg-white p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Nível de Independência</h3>
            </div>
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-indigo-600">
                {independenceRate.toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {independentActivities} de {patientExecutions.length} atividades
              </p>
            </div>
            <div className="h-2.5 rounded-full bg-gray-200 mt-3">
              <div
                className="h-2.5 rounded-full bg-indigo-600 transition-all"
                style={{ width: `${independenceRate}%` }}
              ></div>
            </div>
            <p className="mt-3 text-xs text-gray-600 bg-indigo-50 p-2 rounded-md border border-indigo-200">
              <strong>Insight:</strong> {independenceRate >= 50
                ? 'Excelente progresso! Mais da metade das atividades realizadas com independência.'
                : 'Continuar trabalhando a autonomia gradualmente.'}
            </p>
          </div>

          {/* Velocidade de Resposta */}
          <div className="rounded-md bg-white p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="font-semibold text-gray-800">Velocidade de Processamento</h3>
            </div>
            {showResponseTrend ? (
              <>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Primeira atividade:</span>
                    <span className="font-semibold text-gray-700">{firstResponseTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Última atividade:</span>
                    <span className="font-semibold text-green-600">{lastResponseTime}s</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-700">Tendência:</span>
                    <span className={`font-bold ${responseTimeTrend === 'melhorando' ? 'text-green-600' : 'text-blue-600'}`}>
                      {responseTimeTrend === 'melhorando' ? 'Melhorando' : 'Estável'}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-600 bg-green-50 p-2 rounded-md border border-green-200">
                  <strong>Insight:</strong> {responseTimeTrend === 'melhorando'
                    ? 'O tempo de resposta está diminuindo, indicando melhor processamento cognitivo!'
                    : 'Tempos de resposta consistentes indicam estabilidade no processamento.'}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Dados insuficientes para análise temporal
              </p>
            )}
          </div>

          {/* Áreas de Foco */}
          <div className="rounded-md bg-white p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <h3 className="font-semibold text-gray-800">Áreas Terapêuticas</h3>
            </div>
            <div className="space-y-2">
              {sortedAreas.slice(0, 3).map(([area, data]) => (
                <div key={area} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{THERAPEUTIC_AREA_LABELS[area]}</span>
                  <span className="font-semibold text-indigo-600">{data.count} sessões</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-600 bg-indigo-50 p-2 rounded-md border border-indigo-200">
              <strong>Insight:</strong>{" "}
              {primaryArea
                ? `Foco principal em ${THERAPEUTIC_AREA_LABELS[primaryArea]}`
                : "Foco distribuído em múltiplas áreas"}
            </p>
          </div>
        </div>
      </div>

      {/* Recomendações da IA */}
      <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h2 className="text-lg font-bold text-green-900">Recomendações Personalizadas</h2>
        </div>

        <div className="space-y-3">
          <div className="rounded-md bg-white p-4 border-l-4 border-green-500 shadow-sm">
            <h3 className="font-semibold text-green-800 mb-1">Otimização de Horários</h3>
            <p className="text-sm text-gray-700">
              Baseado nos dados, recomenda-se agendar atividades de maior complexidade
              {morningEngagement > afternoonEngagement ? ' durante a manhã' : ' durante a tarde'},
              quando {patient.name.split(' ')[0]} demonstra maior engajamento.
            </p>
          </div>

          {independenceRate < 50 && (
            <div className="rounded-md bg-white p-4 border-l-4 border-blue-500 shadow-sm">
              <h3 className="font-semibold text-blue-800 mb-1">Desenvolvimento de Autonomia</h3>
              <p className="text-sm text-gray-700">
                Implementar estratégias de redução gradual de ajuda (scaffolding) para aumentar a taxa de independência.
                Sugestão: iniciar com dicas visuais e reduzir progressivamente o suporte.
              </p>
            </div>
          )}

          {weeks[weeks.length - 1].accuracy > weeks[0].accuracy && (
            <div className="rounded-md bg-white p-4 border-l-4 border-indigo-500 shadow-sm">
              <h3 className="font-semibold text-indigo-800 mb-1">Progressão Positiva Detectada</h3>
              <p className="text-sm text-gray-700">
                A acurácia aumentou nas últimas semanas! Continue com as estratégias atuais e
                considere introduzir desafios levemente mais complexos para manter o desenvolvimento.
              </p>
            </div>
          )}

          <div className="rounded-md bg-white p-4 border-l-4 border-amber-500 shadow-sm">
            <h3 className="font-semibold text-amber-800 mb-1">Engajamento com Atividades Lúdicas</h3>
            <p className="text-sm text-gray-700">
              Atividades digitais com temáticas visuais (dinossauros, cores) têm gerado alto engajamento.
              Recomenda-se integrar mais elementos visuais nas terapias presenciais.
            </p>
          </div>
        </div>
      </div>

      {/* Adaptações Sugeridas */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900">Adaptações Sugeridas</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900">Gamificação</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Aumentar elementos de recompensa imediata nas atividades (sons, animações)
                  baseado no alto engajamento com jogos digitais.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-indigo-50 p-4 border border-indigo-200">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-indigo-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <h3 className="font-semibold text-indigo-900">Dificuldade Adaptativa</h3>
                <p className="text-sm text-indigo-800 mt-1">
                  Sistema detectou taxa de acerto consistente acima de 70%. Considere aumentar
                  gradualmente a complexidade para manter o desafio ótimo.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-green-900">Atividades Sociais</h3>
                <p className="text-sm text-green-800 mt-1">
                  Introduzir elementos de interação social nas atividades digitais
                  (compartilhar pontuação com familiares, atividades cooperativas).
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-orange-50 p-4 border border-orange-200">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-orange-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-orange-900">Pausas Estratégicas</h3>
                <p className="text-sm text-orange-800 mt-1">
                  Dados indicam que sessões mais curtas (10-15min) mantêm melhor engajamento.
                  Considerar múltiplas sessões breves ao invés de sessões longas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
