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
        <Link href="/professional/patients" className="mt-4 text-blue-600 hover:underline">
          ← Voltar para lista de pacientes
        </Link>
      </div>
    );
  }

  const { patient, activeProfessionals, activeObjectives, recentSessions } = summary;

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
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-5xl backdrop-blur-sm">
              {patient.sex === "MALE" ? "👦" : "👧"}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{patient.name}</h1>
              <p className="mt-1 text-blue-100">
                {age} anos • {patient.diagnoses.join(", ")}
              </p>
              {patient.internalCode && (
                <p className="mt-1 text-sm text-blue-200">Código: {patient.internalCode}</p>
              )}
            </div>
          </div>
          <Link
            href="/professional/patients"
            className="rounded-xl bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30"
          >
            ← Voltar
          </Link>
        </div>
      </div>

      {/* Navegação de Abas */}
      <div className="flex gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-lg">
        {[
          { href: "timeline", label: "Timeline", icon: "📅" },
          { href: "sessions", label: "Sessões", icon: "📋" },
          { href: "objectives", label: "Objetivos", icon: "🎯" },
          { href: "activities", label: "Atividades", icon: "🎮" },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={`/professional/patients/${id}/${tab.href}`}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab.href === "timeline"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>

      {/* Resumo Rápido */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow">
          <div className="text-sm text-gray-600">Equipe Multidisciplinar</div>
          <div className="mt-1 text-2xl font-bold text-gray-800">
            {activeProfessionals.length}
          </div>
          <div className="mt-2 flex -space-x-2">
            {activeProfessionals.slice(0, 3).map((prof) => (
              <div
                key={prof.id}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm ring-2 ring-white"
                title={prof.user.name}
              >
                {prof.user.avatar || "👤"}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <div className="text-sm text-gray-600">Sessões Total</div>
          <div className="mt-1 text-2xl font-bold text-gray-800">{summary.totalSessions}</div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <div className="text-sm text-gray-600">Objetivos Ativos</div>
          <div className="mt-1 text-2xl font-bold text-gray-800">{activeObjectives.length}</div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <div className="text-sm text-gray-600">Atividades Realizadas</div>
          <div className="mt-1 text-2xl font-bold text-gray-800">{summary.totalActivities}</div>
        </div>
      </div>

      {/* Objetivos Ativos */}
      {activeObjectives.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-bold text-gray-800">Objetivos em Andamento</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {activeObjectives.map((obj) => (
              <div key={obj.id} className="rounded-lg border border-gray-200 p-3">
                <h3 className="font-semibold text-gray-800">{obj.title}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {THERAPEUTIC_AREA_LABELS[obj.area]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros da Timeline */}
      <div className="rounded-xl bg-white p-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de Evento</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as EventType | "ALL")}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="ALL">Todo o histórico</option>
              <option value="WEEK">Última semana</option>
              <option value="MONTH">Último mês</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-gray-800">
          Timeline ({events.length} eventos)
        </h2>

        {events.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <div className="mb-3 text-5xl">📅</div>
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
