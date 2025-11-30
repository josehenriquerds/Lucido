"use client";

import { use } from "react";
import Link from "next/link";
import { useClinical } from "@/components/clinical-provider";
import { TimelineEventCard } from "@/components/professional/timeline/timeline-event-card";

export default function GuardianPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPatientSummary, getTimelineEvents } = useClinical();

  const summary = getPatientSummary(id);

  if (!summary) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
        <p className="text-gray-600">Paciente não encontrado</p>
      </div>
    );
  }

  const { patient, activeProfessionals, activeObjectives, totalSessions, totalActivities } =
    summary;

  // Eventos da timeline (filtrados para responsáveis - sem dados muito técnicos)
  const events = getTimelineEvents(id);

  const age = new Date().getFullYear() - patient.birthDate.getFullYear();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-2xl font-bold uppercase backdrop-blur-sm">
            {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{patient.name}</h1>
            <p className="mt-1 font-medium text-indigo-100">{age} anos • {patient.sex === "MALE" ? "Masculino" : "Feminino"}</p>
          </div>
        </div>
      </div>

      {/* Informações Gerais */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Informações Gerais</h2>
          <Link
            href={`/guardian/patient/${id}/metrics`}
            className="flex items-center gap-2 rounded-md border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Ver Métricas
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm font-medium text-gray-600">Diagnósticos</div>
            <div className="mt-1 font-semibold text-gray-900">
              {patient.diagnoses.join(", ")}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Total de Sessões</div>
            <div className="mt-1 text-2xl font-bold text-indigo-600">{totalSessions}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Atividades Realizadas</div>
            <div className="mt-1 text-2xl font-bold text-indigo-600">{totalActivities}</div>
          </div>
        </div>
      </div>

      {/* Equipe */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Equipe Multidisciplinar</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {activeProfessionals.map((prof) => (
            <div key={prof.id} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 hover:border-indigo-300 transition">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold uppercase text-indigo-700">
                {prof.user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{prof.user.name}</p>
                <p className="text-sm font-medium text-indigo-600">{prof.roleInCase}</p>
                {prof.specialization && (
                  <p className="text-xs text-gray-600 mt-0.5">{prof.specialization}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objetivos em Andamento */}
      {activeObjectives.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Objetivos em Andamento</h2>
          <div className="space-y-3">
            {activeObjectives.map((obj) => (
              <div key={obj.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">{obj.title}</h3>
                {obj.description && (
                  <p className="mt-1 text-sm text-gray-600">{obj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Simplificada */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Histórico Recente ({events.slice(0, 10).length} eventos)
        </h2>

        {events.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum evento ainda.</p>
        ) : (
          <div className="space-y-4">
            {events.slice(0, 10).map((event) => (
              <TimelineEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
