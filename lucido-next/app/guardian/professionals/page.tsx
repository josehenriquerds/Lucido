"use client";

import { useEffect, useMemo, useState } from "react";
import { useClinical } from "@/components/clinical-provider";
import { getUserById } from "@/lib/clinical-data";
import { LinkRequestOrigin } from "@/lib/types/clinical";

export default function GuardianExploreProfessionalsPage() {
  const { getMarketplaceProfessionals, addLinkRequest, patients } = useClinical();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  useEffect(() => {
    if (!selectedPatientId && patients.length > 0) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);
  const [modalityFilter, setModalityFilter] = useState<"ALL" | "ONLINE" | "IN_PERSON">("ALL");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  const professionals = useMemo(() => {
    const base = getMarketplaceProfessionals().map((profile) => {
      const user = getUserById(profile.userId);
      return { profile, user };
    });
    return base.filter(({ profile }) => {
      const matchesModality =
        modalityFilter === "ALL" ||
        profile.modalities.includes(modalityFilter as "ONLINE" | "IN_PERSON");
      const matchesSpecialty =
        !specialtyFilter ||
        profile.specialties.some((spec) =>
          spec.toLowerCase().includes(specialtyFilter.toLowerCase())
        );
      return matchesModality && matchesSpecialty;
    });
  }, [getMarketplaceProfessionals, modalityFilter, specialtyFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explorar Profissionais</h1>
          <p className="text-sm text-gray-600">Marketplace para convidar profissionais à rede.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={modalityFilter}
            onChange={(e) =>
              setModalityFilter(e.target.value as "ALL" | "ONLINE" | "IN_PERSON")
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="ALL">Todos</option>
            <option value="ONLINE">Online</option>
            <option value="IN_PERSON">Presencial</option>
          </select>
          <input
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            placeholder="Filtrar por especialidade"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="text-xs text-gray-600">
            Criança:{" "}
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {professionals.map(({ profile, user }) => (
          <div key={profile.userId} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.name || "Profissional"}
                </p>
                <p className="text-sm text-gray-600">
                  {(profile.city && profile.state && `${profile.city}/${profile.state}`) ||
                    "Cidade não informada"}
                </p>
                <p className="text-xs text-gray-500">{profile.modalities.join(" / ")}</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700">
                Marketplace
              </span>
            </div>
            <div className="mt-2 space-y-1 text-sm text-gray-700">
              <p className="font-semibold">Especialidades</p>
              <div className="flex flex-wrap gap-1">
                {profile.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                  >
                    {spec}
                  </span>
                ))}
              </div>
              {profile.approaches && profile.approaches.length > 0 && (
                <p className="text-xs text-gray-600">Abordagens: {profile.approaches.join(", ")}</p>
              )}
            </div>
            <button
              onClick={() => {
                if (selectedPatientId) {
                  addLinkRequest(selectedPatientId, profile.userId, LinkRequestOrigin.FAMILY);
                }
              }}
              className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Solicitar vínculo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
