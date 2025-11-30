"use client";

import { useEffect, useMemo, useState } from "react";
import { useClinical } from "@/components/clinical-provider";

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export default function ProfessionalChatPage() {
  const { currentUser, patients, getPatientSummary } = useClinical();

  const conversations = useMemo(() => {
    if (!currentUser) return [];

    return patients.flatMap((patient) => {
      const summary = getPatientSummary(patient.id);
      if (!summary) return [];

      return summary.activeProfessionals
        .filter((prof) => prof.user.id !== currentUser.id)
        .map((prof) => ({
          id: `${patient.id}-${prof.user.id}`,
          patientName: patient.name,
          patientId: patient.id,
          professionalName: prof.user.name,
          professionalRole: prof.roleInCase,
        }));
    });
  }, [currentUser, getPatientSummary, patients]);

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>(
    {}
  );
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setMessagesByConversation((prev) => {
      const next = { ...prev };
      conversations.forEach((conv) => {
        if (!next[conv.id]) {
          next[conv.id] = [
            {
              id: `${conv.id}-1`,
              author: conv.professionalName,
              content: "Atualização rápida: atividade digital teve alto engajamento.",
              timestamp: new Date().toLocaleString("pt-BR"),
            },
            {
              id: `${conv.id}-2`,
              author: currentUser?.name || "Você",
              content: "Ótimo! Vou registrar na timeline do caso.",
              timestamp: new Date().toLocaleString("pt-BR"),
            },
          ];
        }
      });
      return next;
    });
  }, [conversations, currentUser?.name]);

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);
  const messages = selectedConversationId ? messagesByConversation[selectedConversationId] || [] : [];

  const handleSend = () => {
    if (!selectedConversationId || !draft.trim() || !currentUser) return;
    setMessagesByConversation((prev) => {
      const next = { ...prev };
      const newMessage: Message = {
        id: `${selectedConversationId}-${Date.now()}`,
        author: currentUser.name,
        content: draft.trim(),
        timestamp: new Date().toLocaleString("pt-BR"),
      };
      next[selectedConversationId] = [...(next[selectedConversationId] || []), newMessage];
      return next;
    });
    setDraft("");
  };

  if (!currentUser) {
    return <div className="text-gray-700">Carregando chat...</div>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <h1 className="text-lg font-bold text-gray-900">Chat entre profissionais</h1>
          <p className="text-sm text-gray-600">
            Coordene atendimentos e combine próximas sessões.
          </p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-gray-600">
              Nenhum colega vinculado aos seus pacientes ainda.
            </p>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === selectedConversationId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition ${
                    isActive ? "bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {conv.professionalName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{conv.professionalName}</p>
                    <p className="text-xs text-gray-600">{conv.professionalRole}</p>
                    <p className="mt-1 text-xs text-indigo-700 font-semibold">
                      Caso: {conv.patientName}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {selectedConversation ? (
          <>
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div>
                <p className="text-sm text-gray-600">Conversa sobre</p>
                <h2 className="text-lg font-bold text-gray-900">{selectedConversation.patientName}</h2>
                <p className="text-xs text-gray-500">Com {selectedConversation.professionalName}</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Multidisciplinar
              </span>
            </div>

            <div className="flex h-[60vh] flex-col justify-between">
              <div className="space-y-3 overflow-y-auto p-4">
                {messages.map((message) => {
                  const isAuthor = message.author === currentUser.name;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isAuthor ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg border p-3 text-sm shadow-sm ${
                          isAuthor
                            ? "border-indigo-200 bg-indigo-50 text-indigo-900"
                            : "border-gray-200 bg-gray-50 text-gray-900"
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between gap-2 text-xs text-gray-600">
                          <span className="font-semibold text-gray-800">{message.author}</span>
                          <span>{message.timestamp}</span>
                        </div>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Escreva uma atualização rápida..."
                  />
                  <button
                    onClick={handleSend}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-sm text-gray-600">
            Selecione uma conversa para começar.
          </div>
        )}
      </div>
    </div>
  );
}
