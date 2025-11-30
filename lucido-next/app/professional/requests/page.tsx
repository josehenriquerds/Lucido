"use client";

import { useMemo } from "react";
import { useClinical } from "@/components/clinical-provider";
import { LinkRequestOrigin, LinkRequestStatus } from "@/lib/types/clinical";
import { getPatientById } from "@/lib/clinical-data";

export default function LinkRequestsPage() {
  const { currentUser, linkRequests, respondLinkRequest } = useClinical();

  const myRequests = useMemo(
    () => linkRequests.filter((req) => req.professionalId === currentUser?.id),
    [linkRequests, currentUser?.id]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitações de vínculo</h1>
          <p className="text-sm text-gray-600">
            Convites para integrar rede de cuidado de crianças.
          </p>
        </div>
      </div>

      {myRequests.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-700">Nenhuma solicitação no momento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myRequests.map((req) => {
            const patient = getPatientById(req.patientId);
            const origin =
              req.origin === LinkRequestOrigin.FAMILY ? "Família" : "Clínica/Escola";
            const statusLabel =
              req.status === LinkRequestStatus.PENDING
                ? "Pendente"
                : req.status === LinkRequestStatus.ACCEPTED
                ? "Aceita"
                : "Recusada";

            return (
              <div
                key={req.id}
                className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {patient?.name || "Criança"} ({patient?.internalCode || "Sem código"})
                  </p>
                  <p className="text-xs text-gray-600">
                    Origem: {origin} • Status: {statusLabel}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={req.status !== LinkRequestStatus.PENDING}
                    onClick={() => respondLinkRequest(req.id, "ACCEPT")}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Aceitar
                  </button>
                  <button
                    disabled={req.status !== LinkRequestStatus.PENDING}
                    onClick={() => respondLinkRequest(req.id, "REJECT")}
                    className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 disabled:opacity-50"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
