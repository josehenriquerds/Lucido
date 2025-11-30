"use client";

import { use } from "react";
import { useClinical } from "@/components/clinical-provider";
import { TimelineEventCard } from "@/components/professional/timeline/timeline-event-card";

export default function GuardianPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPatientSummary, getTimelineEvents } = useClinical();

  const summary = getPatientSummary(id);

  if (!summary) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-lg">
        <p className="text-gray-600">Paciente não encontrado</p>
      </div>
    );
  }

  const { patient, activeProfessionals, activeObjectives, totalSessions, totalActivities } =
    summary;

  // Eventos da timeline (filtrados para responsáveis - sem dados muito técnicos)
  const events = getTimelineEvents(id).filter((e) => {
    // Responsáveis não veem crises ou dados muito sensíveis (configurável)
    return true; // Por enquanto, veem tudo
  });

  const age = new Date().getFullYear() - patient.birthDate.getFullYear();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-5xl backdrop-blur-sm">
            {patient.sex === "MALE" ? "👦" : "👧"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{patient.name}</h1>
            <p className="mt-1 text-purple-100">{age} anos</p>
          </div>
        </div>
      </div>

      {/* Informações Gerais */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-gray-800">Informações Gerais</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm text-gray-600">Diagnósticos</div>
            <div className="mt-1 font-semibold text-gray-800">
              {patient.diagnoses.join(", ")}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total de Sessões</div>
            <div className="mt-1 font-semibold text-gray-800">{totalSessions}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Atividades Realizadas</div>
            <div className="mt-1 font-semibold text-gray-800">{totalActivities}</div>
          </div>
        </div>
      </div>

      {/* Equipe */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-gray-800">Equipe Multidisciplinar</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {activeProfessionals.map((prof) => (
            <div key={prof.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-2xl">
                {prof.user.avatar || "👤"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{prof.user.name}</p>
                <p className="text-sm text-gray-600">{prof.roleInCase}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objetivos em Andamento */}
      {activeObjectives.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-bold text-gray-800">Objetivos em Andamento</h2>
          <div className="space-y-3">
            {activeObjectives.map((obj) => (
              <div key={obj.id} className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-800">{obj.title}</h3>
                {obj.description && (
                  <p className="mt-1 text-sm text-gray-600">{obj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Simplificada */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-gray-800">
          Histórico Recente ({events.slice(0, 10).length} eventos)
        </h2>

        {events.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum evento ainda.</p>
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
