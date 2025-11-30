"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useClinical } from "@/components/clinical-provider";
import { SUPPORT_LEVEL_LABELS, THERAPEUTIC_AREA_LABELS } from "@/lib/types/clinical";

export default function GuardianHomePage() {
  const { patients, getPatientSummary, activityExecutions } = useClinical();

  const patient = patients[0];
  const summary = patient ? getPatientSummary(patient.id) : null;

  const patientActivities = useMemo(
    () =>
      patient
        ? activityExecutions
            .filter((activity) => activity.patientId === patient.id)
            .sort((a, b) => b.executionDate.getTime() - a.executionDate.getTime())
        : [],
    [activityExecutions, patient]
  );

  if (!patient || !summary) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Portal do Responsável</h1>
        <p className="text-gray-600">
          Não encontramos informações de criança associada ao seu acesso.
        </p>
        <p className="text-sm text-gray-500">
          Caso ache que é um erro, fale com a clínica para vincular seu acesso.
        </p>
      </div>
    );
  }

  const age = new Date().getFullYear() - patient.birthDate.getFullYear();
  const recentSessions = summary.recentSessions.slice(0, 3);
  const activeObjectives = summary.activeObjectives.slice(0, 3);
  const recentActivities = patientActivities.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-indigo-100">Responsável</p>
            <h1 className="text-3xl font-bold leading-tight">{patient.name}</h1>
            <p className="mt-1 text-indigo-100">
              {age} anos • {patient.diagnoses.join(", ")}
            </p>
            {patient.supportLevel && (
              <p className="mt-1 text-sm text-indigo-100">
                {SUPPORT_LEVEL_LABELS[patient.supportLevel]}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <Link
              href={`/guardian/patient/${patient.id}`}
              className="rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-white"
            >
              Ver acompanhamento completo
            </Link>
            <Link
              href={`/guardian/patient/${patient.id}/metrics`}
              className="rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Métricas lúdicas
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500">Sessões registradas</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{summary.totalSessions}</p>
          <p className="text-sm text-gray-600">
            {recentSessions.length > 0
              ? `Última: ${new Date(
                  recentSessions[0].sessionDate
                ).toLocaleDateString("pt-BR")}`
              : "Nenhuma sessão ainda"}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500">Atividades lúdicas</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{summary.totalActivities}</p>
          <p className="text-sm text-gray-600">
            {recentActivities.length > 0
              ? `Última: ${new Date(
                  recentActivities[0].executionDate
                ).toLocaleDateString("pt-BR")}`
              : "Nenhuma atividade registrada"}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500">Equipe</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {summary.activeProfessionals.length}
          </p>
          <p className="text-sm text-gray-600">Profissionais ativos no caso</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Objetivos em andamento</h2>
            <span className="text-xs font-medium text-gray-500">
              Visualização somente leitura
            </span>
          </div>
          {activeObjectives.length === 0 ? (
            <p className="text-sm text-gray-600">Nenhum objetivo ativo no momento.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {activeObjectives.map((obj) => (
                <div
                  key={obj.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 hover:border-indigo-200"
                >
                  <p className="text-xs font-semibold text-indigo-600">
                    {THERAPEUTIC_AREA_LABELS[obj.area]}
                  </p>
                  <h3 className="mt-1 font-semibold text-gray-900">{obj.title}</h3>
                  {obj.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{obj.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Equipe multidisciplinar</h2>
          </div>
          <div className="space-y-3">
            {summary.activeProfessionals.slice(0, 4).map((prof) => (
              <div
                key={prof.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                  {prof.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{prof.user.name}</p>
                  <p className="text-xs text-gray-600">{prof.roleInCase}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Para alterar permissões ou dúvidas, fale com a clínica.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Últimos registros</h2>
          <Link
            href={`/guardian/patient/${patient.id}/metrics`}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Ver detalhamento
          </Link>
        </div>
        {recentActivities.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">Nenhuma atividade registrada ainda.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-lg border border-gray-200 p-4 hover:border-indigo-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(activity.executionDate).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-xs text-gray-600">
                      Engajamento: {activity.engagement || "N/D"} • Resultado:{" "}
                      {activity.outcome || "N/D"}
                    </p>
                  </div>
                  {activity.duration && (
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {activity.duration} min
                    </span>
                  )}
                </div>
                {activity.notes && (
                  <p className="mt-2 text-sm text-gray-700 line-clamp-2">{activity.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
