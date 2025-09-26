/**
 * Componente para instruções de acessibilidade em drag-and-drop
 * Fornece textos para leitores de tela
 */

interface DragInstructionsProps {
  /** ID único para referenciar via aria-describedby */
  id: string;
  /** Texto das instruções */
  children: string;
  /** Se deve ser anunciado imediatamente (aria-live) */
  live?: boolean;
}

/**
 * Instruções ocultas para leitores de tela
 */
export function DragInstructions({ id, children, live = false }: DragInstructionsProps) {
  return (
    <div
      id={id}
      className="sr-only"
      aria-live={live ? "polite" : undefined}
      aria-atomic="true"
    >
      {children}
    </div>
  );
}

/**
 * Componente para anúncios dinâmicos
 */
interface DragAnnouncementProps {
  message: string;
}

export function DragAnnouncement({ message }: DragAnnouncementProps) {
  if (!message) return null;

  return (
    <div
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      {message}
    </div>
  );
}