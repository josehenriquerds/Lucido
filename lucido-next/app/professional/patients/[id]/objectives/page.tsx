"use client";

import { use } from "react";
import Link from "next/link";
import { useClinical } from "@/components/clinical-provider";
import { THERAPEUTIC_AREA_LABELS, ObjectiveStatus } from "@/lib/types/clinical";

export default function PatientObjectivesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPatientSummary, getObjectivesByPatient } = useClinical();

  const summary = getPatientSummary(id);

  if (!summary) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow-sm">
        <p className="text-gray-600">Paciente não encontrado</p>
      </div>
    );
  }

  const { patient } = summary;
  const allObjectives = getObjectivesByPatient(id);

  const inProgress = allObjectives.filter((o) => o.status === ObjectiveStatus.IN_PROGRESS);
  const achieved = allObjectives.filter((o) => o.status === ObjectiveStatus.ACHIEVED);
  const paused = allObjectives.filter((o) => o.status === ObjectiveStatus.PAUSED);

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
        <h1 className="text-3xl font-bold text-gray-900">Objetivos Terapêuticos</h1>
        <p className="mt-1 text-gray-600">{patient.name}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{inProgress.length}</div>
          <div className="text-sm text-indigo-100 font-medium">Em Andamento</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-sm border border-green-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{achieved.length}</div>
          <div className="text-sm text-green-100 font-medium">Alcançados</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 p-6 text-white shadow-sm border border-gray-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{paused.length}</div>
          <div className="text-sm text-gray-100 font-medium">Pausados</div>
        </div>
      </div>

      {/* Objetivos em Andamento */}
      {inProgress.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Objetivos em Andamento</h2>
          </div>
          <div className="space-y-4">
            {inProgress.map((objective) => (
              <div key={objective.id} className="rounded-md border-2 border-indigo-200 bg-indigo-50 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{objective.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-sm">
                      <span className="rounded-md bg-indigo-100 px-3 py-1 font-medium text-indigo-700 border border-indigo-200">
                        {THERAPEUTIC_AREA_LABELS[objective.area]}
                      </span>
                      <span className="text-gray-600">
                        Iniciado em {new Date(objective.startDate).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    {objective.description && (
                      <p className="mt-3 text-sm text-gray-700">{objective.description}</p>
                    )}
                    {objective.reviewDate && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Revisão prevista: {new Date(objective.reviewDate).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Objetivos Alcançados */}
      {achieved.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Objetivos Alcançados</h2>
          </div>
          <div className="space-y-4">
            {achieved.map((objective) => (
              <div key={objective.id} className="rounded-md border-2 border-green-200 bg-green-50 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{objective.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-sm">
                      <span className="rounded-md bg-green-100 px-3 py-1 font-medium text-green-700 border border-green-200">
                        {THERAPEUTIC_AREA_LABELS[objective.area]}
                      </span>
                      <span className="text-gray-600">
                        Concluído em {objective.completedDate && new Date(objective.completedDate).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    {objective.description && (
                      <p className="mt-3 text-sm text-gray-700">{objective.description}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Objetivos Pausados */}
      {paused.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Objetivos Pausados</h2>
          </div>
          <div className="space-y-4">
            {paused.map((objective) => (
              <div key={objective.id} className="rounded-md border-2 border-gray-200 bg-gray-50 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{objective.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-sm">
                      <span className="rounded-md bg-gray-100 px-3 py-1 font-medium text-gray-700 border border-gray-200">
                        {THERAPEUTIC_AREA_LABELS[objective.area]}
                      </span>
                    </div>
                    {objective.description && (
                      <p className="mt-3 text-sm text-gray-700">{objective.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão de Novo Objetivo */}
      <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 p-8 text-center shadow-sm border border-indigo-200">
        <div className="mb-3 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">Adicionar Novo Objetivo</h3>
        <p className="mb-4 text-sm text-gray-600">
          Defina novos objetivos terapêuticos personalizados para {patient.name.split(" ")[0]}
        </p>
        <button className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 transition border border-indigo-700">
          Criar Objetivo
        </button>
      </div>
    </div>
  );
}
