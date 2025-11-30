"use client";

import { useEffect, useState } from "react";
import { useClinical } from "@/components/clinical-provider";

export default function SettingsPage() {
  const { currentUser, getProfessionalProfileByUserId, updateProfessionalProfile } = useClinical();
  const [specialties, setSpecialties] = useState("");
  const [approaches, setApproaches] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [modalities, setModalities] = useState<string[]>(["ONLINE"]);
  const [ageRange, setAgeRange] = useState("");
  const [appearInMarketplace, setAppearInMarketplace] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const profile = getProfessionalProfileByUserId(currentUser.id);
    if (profile) {
      setSpecialties(profile.specialties.join(", "));
      setApproaches(profile.approaches?.join(", ") || "");
      setCity(profile.city || "");
      setState(profile.state || "");
      setModalities(profile.modalities);
      setAgeRange(profile.ageRange || "");
      setAppearInMarketplace(profile.appearInMarketplace);
    }
  }, [currentUser, getProfessionalProfileByUserId]);

  if (!currentUser) {
    return <div className="text-gray-700">Carregando...</div>;
  }

  const handleSave = () => {
    updateProfessionalProfile({
      userId: currentUser.id,
      specialties: specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      approaches: approaches
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      city,
      state,
      modalities: modalities as Array<"ONLINE" | "IN_PERSON">,
      ageRange,
      appearInMarketplace,
    });
  };

  const toggleModality = (value: "ONLINE" | "IN_PERSON") => {
    setModalities((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil Profissional</h1>
        <p className="text-sm text-gray-600">
          Defina como deseja aparecer na rede e no marketplace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Especialidades</label>
            <input
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="Psicologia, ABA, Fono..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Abordagens</label>
            <input
              value={approaches}
              onChange={(e) => setApproaches(e.target.value)}
              placeholder="DIR/Floortime, PECS..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700">Cidade</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">UF</label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Modalidade</label>
            <div className="mt-2 flex gap-2">
              {(["ONLINE", "IN_PERSON"] as const).map((mod) => (
                <button
                  key={mod}
                  onClick={() => toggleModality(mod)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                    modalities.includes(mod)
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  {mod === "ONLINE" ? "Online" : "Presencial"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Faixa etária atendida</label>
            <input
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              placeholder="ex.: 3-10 anos"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="marketplace"
              type="checkbox"
              checked={appearInMarketplace}
              onChange={(e) => setAppearInMarketplace(e.target.checked)}
            />
            <label htmlFor="marketplace" className="text-sm text-gray-700">
              Aparecer no marketplace da rede
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Salvar perfil
        </button>
      </div>
    </div>
  );
}
