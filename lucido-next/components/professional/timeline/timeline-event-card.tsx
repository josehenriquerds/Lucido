import type { TimelineEvent } from "@/lib/types/clinical";
import { EventType, SESSION_TYPE_LABELS, THERAPEUTIC_AREA_LABELS } from "@/lib/types/clinical";

interface TimelineEventCardProps {
  event: TimelineEvent;
}

export function TimelineEventCard({ event }: TimelineEventCardProps) {
  const getEventIcon = (type: EventType): string => {
    const icons: Record<EventType, string> = {
      [EventType.SESSION]: "📋",
      [EventType.ACTIVITY_EXECUTION]: "🎮",
      [EventType.IMPORTANT_NOTE]: "📌",
      [EventType.CRISIS]: "⚠️",
      [EventType.MILESTONE]: "🎉",
      [EventType.MEDICATION_CHANGE]: "💊",
      [EventType.DIAGNOSIS_UPDATE]: "🩺",
      [EventType.OTHER]: "📄",
    };
    return icons[type] || "📄";
  };

  const getEventColor = (type: EventType): string => {
    const colors: Record<EventType, string> = {
      [EventType.SESSION]: "bg-blue-50 border-blue-200 text-blue-900",
      [EventType.ACTIVITY_EXECUTION]: "bg-green-50 border-green-200 text-green-900",
      [EventType.IMPORTANT_NOTE]: "bg-yellow-50 border-yellow-200 text-yellow-900",
      [EventType.CRISIS]: "bg-red-50 border-red-200 text-red-900",
      [EventType.MILESTONE]: "bg-purple-50 border-purple-200 text-purple-900",
      [EventType.MEDICATION_CHANGE]: "bg-orange-50 border-orange-200 text-orange-900",
      [EventType.DIAGNOSIS_UPDATE]: "bg-indigo-50 border-indigo-200 text-indigo-900",
      [EventType.OTHER]: "bg-gray-50 border-gray-200 text-gray-900",
    };
    return colors[type] || colors[EventType.OTHER];
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const session = event.metadata?.session;
  const professional = event.metadata?.professional;
  const activity = event.metadata?.activity;
  const execution = event.metadata?.activityExecution;

  return (
    <div className={`rounded-xl border-2 p-4 ${getEventColor(event.type)}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-3xl">{getEventIcon(event.type)}</div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-1 flex items-start justify-between">
            <h3 className="font-semibold">{event.title}</h3>
            <span className="text-xs opacity-75">{formatDate(event.date)}</span>
          </div>

          {event.description && (
            <p className="mb-3 text-sm opacity-90">{event.description}</p>
          )}

          {/* Session Details */}
          {session && (
            <div className="mt-3 space-y-2 rounded-lg bg-white/50 p-3 text-sm">
              {professional && (
                <p className="font-medium">
                  👤 {professional.name} • {SESSION_TYPE_LABELS[session.sessionType]}
                </p>
              )}
              {session.areaFocus && (
                <p>🎯 Foco: {THERAPEUTIC_AREA_LABELS[session.areaFocus]}</p>
              )}
              {session.duration && <p>⏱️ Duração: {session.duration} minutos</p>}
              {session.observations && (
                <p className="mt-2 italic">&ldquo;{session.observations.slice(0, 150)}...&rdquo;</p>
              )}
            </div>
          )}

          {/* Activity Execution Details */}
          {execution && activity && (
            <div className="mt-3 space-y-2 rounded-lg bg-white/50 p-3 text-sm">
              <p className="font-medium">🎮 {activity.name}</p>
              {execution.engagement && <p>⚡ Engajamento: {execution.engagement}</p>}
              {execution.outcome && <p>✅ Resultado: {execution.outcome}</p>}
              {execution.notes && (
                <p className="mt-2 italic">&ldquo;{execution.notes}&rdquo;</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
