"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useClinical } from "@/components/clinical-provider";
import { TimelineEventCard } from "@/components/professional/timeline/timeline-event-card";
import { EventType, THERAPEUTIC_AREA_LABELS } from "@/lib/types/clinical";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PatientTimelinePage({ params }: PageProps) {
  const { id } = use(params);
  const { getPatientSummary, getTimelineEvents } = useClinical();

  const [filterType, setFilterType] = useState<EventType | "ALL">("ALL");
  const [dateFilter, setDateFilter] = useState<"ALL" | "WEEK" | "MONTH">("ALL");

  const summary = getPatientSummary(id);

  if (!summary) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Paciente não encontrado</p>
        <Link href="/professional/patients" className="mt-4 text-indigo-600 hover:underline font-medium">
          ← Voltar para lista de pacientes
        </Link>
      </div>
    );
  }

  const { patient, activeProfessionals, activeObjectives } = summary;

  // Obter eventos da timeline
  let events = getTimelineEvents(id);

  // Aplicar filtros
  if (filterType !== "ALL") {
    events = events.filter((e) => e.type === filterType);
  }

  if (dateFilter === "WEEK") {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    events = events.filter((e) => new Date(e.date) >= weekAgo);
  } else if (dateFilter === "MONTH") {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    events = events.filter((e) => new Date(e.date) >= monthAgo);
  }

  const age = new Date().getFullYear() - patient.birthDate.getFullYear();

  return (
    <div className="space-y-6">
      {/* Header com Info do Paciente */}
      <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-300">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{patient.name}</h1>
              <p className="mt-1 text-indigo-100">
                {age} anos • {patient.diagnoses.join(", ")}
              </p>
              {patient.internalCode && (
                <p className="mt-1 text-sm text-indigo-200">Código: {patient.internalCode}</p>
              )}
            </div>
          </div>
          <Link
            href="/professional/patients"
            className="rounded-md bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30 border border-white/30"
          >
            ← Voltar
          </Link>
        </div>
      </div>

      {/* Navegação de Abas */}
      <div className="flex gap-2 overflow-x-auto rounded-lg bg-white p-2 shadow-sm border border-gray-200">
        {[
          { href: "timeline", label: "Timeline", icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )},
          { href: "sessions", label: "Sessões", icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )},
          { href: "objectives", label: "Objetivos", icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )},
          { href: "activities", label: "Atividades", icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )},
          { href: "insights", label: "Insights IA", icon: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )},
        ].map((tab) => (
          <Link
            key={tab.href}
            href={`/professional/patients/${id}/${tab.href}`}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
              tab.href === "timeline"
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                : "text-gray-600 hover:bg-gray-50 border border-transparent"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>

      {/* Resumo Rápido */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 font-medium">Equipe Multidisciplinar</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {activeProfessionals.length}
          </div>
          <div className="mt-2 flex -space-x-2">
            {activeProfessionals.slice(0, 3).map((prof) => (
              <div
                key={prof.id}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 ring-2 ring-white"
                title={prof.user.name}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 font-medium">Sessões Total</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{summary.totalSessions}</div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 font-medium">Objetivos Ativos</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{activeObjectives.length}</div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 font-medium">Atividades Realizadas</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{summary.totalActivities}</div>
        </div>
      </div>

      {/* Objetivos Ativos */}
      {activeObjectives.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Objetivos em Andamento</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {activeObjectives.map((obj) => (
              <div key={obj.id} className="rounded-md border border-gray-200 p-3">
                <h3 className="font-semibold text-gray-900">{obj.title}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {THERAPEUTIC_AREA_LABELS[obj.area]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros da Timeline */}
      <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de Evento</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as EventType | "ALL")}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="ALL">Todos</option>
              <option value={EventType.SESSION}>Sessões</option>
              <option value={EventType.ACTIVITY_EXECUTION}>Atividades</option>
              <option value={EventType.MILESTONE}>Marcos</option>
              <option value={EventType.IMPORTANT_NOTE}>Notas Importantes</option>
              <option value={EventType.CRISIS}>Crises</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Período</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as "ALL" | "WEEK" | "MONTH")}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="ALL">Todo o histórico</option>
              <option value="WEEK">Última semana</option>
              <option value="MONTH">Último mês</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Timeline ({events.length} eventos)
        </h2>

        {events.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <div className="mb-3 flex justify-center">
              <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p>Nenhum evento encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <TimelineEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
