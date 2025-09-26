/**
 * Hook robusto para drag-and-drop com Pointer Events
 * Suporta mouse, touch e caneta de forma unificada
 * Otimizado para performance e compatibilidade móvel
 */

import { useCallback, useEffect, useRef, useState } from "react";

export interface PointerPosition {
  x: number;
  y: number;
}

export interface DragState {
  isDragging: boolean;
  startPosition: PointerPosition | null;
  currentPosition: PointerPosition | null;
  dragOffset: PointerPosition;
}

export interface PointerDragConfig {
  /** Eixo permitido para arrastar: 'x' | 'y' | 'both' */
  axis?: 'x' | 'y' | 'both';

  /** Threshold em pixels para iniciar o drag (evita drag acidental) */
  pressThreshold?: number;

  /** Trava o eixo após exceder threshold (melhora UX em listas roláveis) */
  lockAxis?: boolean;

  /** Elemento que pode ser arrastado (default: próprio elemento) */
  dragHandle?: HTMLElement | null;

  /** Dados a serem transferidos durante o drag */
  dragData?: Record<string, any>;

  /** Previne comportamento padrão (scroll, etc.) */
  preventDefault?: boolean;

  /** Callbacks do ciclo de vida do drag */
  onDragStart?: (event: PointerEvent, data?: Record<string, any>) => void;
  onDragMove?: (event: PointerEvent, position: PointerPosition, offset: PointerPosition) => void;
  onDragEnd?: (event: PointerEvent, position: PointerPosition, target?: Element | null) => void;
  onDragCancel?: (event?: PointerEvent) => void;
}

export interface PointerDragResult {
  /** Estado atual do drag */
  dragState: DragState;

  /** Ref para anexar ao elemento arrastável */
  dragRef: React.RefObject<HTMLElement | null>;

  /** Handlers para anexar manualmente (caso não use dragRef) */
  handlers: {
    onPointerDown: (event: PointerEvent) => void;
    onPointerMove: (event: PointerEvent) => void;
    onPointerUp: (event: PointerEvent) => void;
    onPointerCancel: (event: PointerEvent) => void;
  };

  /** Função para cancelar drag programaticamente */
  cancelDrag: () => void;

  /** Função para verificar se ponto está sobre elemento drop válido */
  getDropTarget: (x: number, y: number) => Element | null;
}

/**
 * Hook principal para implementar drag-and-drop com Pointer Events
 */
export function usePointerDrag(config: PointerDragConfig = {}): PointerDragResult {
  const {
    axis = 'both',
    pressThreshold = 8,
    lockAxis = true,
    dragHandle,
    dragData = {},
    preventDefault = true,
    onDragStart,
    onDragMove,
    onDragEnd,
    onDragCancel
  } = config;

  const dragRef = useRef<HTMLElement | null>(null);
  const rafIdRef = useRef<number | undefined>(undefined);
  const activePointerRef = useRef<number | null>(null);
  const lockedAxisRef = useRef<'x' | 'y' | null>(null);

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startPosition: null,
    currentPosition: null,
    dragOffset: { x: 0, y: 0 }
  });

  /**
   * Calcula se o movimento excedeu o threshold
   */
  const exceedsThreshold = useCallback((start: PointerPosition, current: PointerPosition): boolean => {
    const deltaX = Math.abs(current.x - start.x);
    const deltaY = Math.abs(current.y - start.y);
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY) >= pressThreshold;
  }, [pressThreshold]);

  /**
   * Determina o eixo principal do movimento
   */
  const getDominantAxis = useCallback((start: PointerPosition, current: PointerPosition): 'x' | 'y' => {
    const deltaX = Math.abs(current.x - start.x);
    const deltaY = Math.abs(current.y - start.y);
    return deltaX > deltaY ? 'x' : 'y';
  }, []);

  /**
   * Aplica restrições de eixo ao offset
   */
  const constrainOffset = useCallback((offset: PointerPosition): PointerPosition => {
    const lockedAxis = lockedAxisRef.current;

    if (axis === 'x' || lockedAxis === 'x') {
      return { x: offset.x, y: 0 };
    }

    if (axis === 'y' || lockedAxis === 'y') {
      return { x: 0, y: offset.y };
    }

    return offset;
  }, [axis]);

  /**
   * Encontra elemento drop válido no ponto especificado
   */
  const getDropTarget = useCallback((x: number, y: number): Element | null => {
    // Temporariamente oculta o elemento sendo arrastado
    const dragElement = dragRef.current;
    const originalPointerEvents = dragElement?.style.pointerEvents;

    if (dragElement) {
      dragElement.style.pointerEvents = 'none';
    }

    const elementBelow = document.elementFromPoint(x, y);
    const dropTarget = elementBelow?.closest('[data-drop-target="true"]') || null;

    // Restaura pointer-events
    if (dragElement && originalPointerEvents !== undefined) {
      dragElement.style.pointerEvents = originalPointerEvents;
    }

    return dropTarget;
  }, []);

  /**
   * Inicia o drag
   */
  const startDrag = useCallback((event: PointerEvent) => {
    if (activePointerRef.current !== null) return;

    const element = dragRef.current;
    if (!element) return;

    // Verifica se o drag deve iniciar neste elemento/handle
    const targetElement = dragHandle || element;
    if (!targetElement.contains(event.target as Node)) return;

    activePointerRef.current = event.pointerId;
    element.setPointerCapture(event.pointerId);

    const startPosition = { x: event.clientX, y: event.clientY };

    setDragState({
      isDragging: false, // Ainda não começou (aguarda threshold)
      startPosition,
      currentPosition: startPosition,
      dragOffset: { x: 0, y: 0 }
    });

    if (preventDefault) {
      event.preventDefault();
    }

    // Adiciona classe CSS para otimizações
    element.classList.add('drag-active');
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // Previne scroll na página durante drag
    document.body.style.touchAction = 'none';
    document.body.style.overflowY = 'hidden';

  }, [dragHandle, preventDefault]);

  /**
   * Atualiza posição durante drag
   */
  const updateDrag = useCallback((event: PointerEvent) => {
    if (activePointerRef.current !== event.pointerId) return;

    const currentPosition = { x: event.clientX, y: event.clientY };

    setDragState(prevState => {
      if (!prevState.startPosition) return prevState;

      const hasExceededThreshold = exceedsThreshold(prevState.startPosition, currentPosition);

      // Se ainda não iniciou o drag, verifica threshold
      if (!prevState.isDragging && !hasExceededThreshold) {
        return {
          ...prevState,
          currentPosition
        };
      }

      // Primeira vez que excede threshold - inicia drag oficialmente
      if (!prevState.isDragging && hasExceededThreshold) {
        if (lockAxis && axis === 'both') {
          lockedAxisRef.current = getDominantAxis(prevState.startPosition, currentPosition);
        }

        onDragStart?.(event, dragData);

        // Adiciona classe para styling durante drag
        const element = dragRef.current;
        if (element) {
          element.classList.add('drag-dragging');
          element.style.willChange = 'transform';
        }
      }

      // Calcula offset com restrições de eixo
      const rawOffset = {
        x: currentPosition.x - prevState.startPosition.x,
        y: currentPosition.y - prevState.startPosition.y
      };

      const constrainedOffset = constrainOffset(rawOffset);

      // Usa rAF para performance
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        onDragMove?.(event, currentPosition, constrainedOffset);
      });

      return {
        ...prevState,
        isDragging: true,
        currentPosition,
        dragOffset: constrainedOffset
      };
    });

    if (preventDefault) {
      event.preventDefault();
    }
  }, [exceedsThreshold, lockAxis, axis, getDominantAxis, constrainOffset, dragData, onDragStart, onDragMove, preventDefault]);

  /**
   * Finaliza o drag
   */
  const endDrag = useCallback((event: PointerEvent) => {
    if (activePointerRef.current !== event.pointerId) return;

    const element = dragRef.current;
    const wasDragging = dragState.isDragging;

    // Cleanup
    if (element) {
      element.releasePointerCapture(event.pointerId);
      element.classList.remove('drag-active', 'drag-dragging');
      element.style.willChange = '';
    }

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    activePointerRef.current = null;
    lockedAxisRef.current = null;

    // Restaura comportamento da página
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.touchAction = '';
    document.body.style.overflowY = '';

    // Só chama onDragEnd se realmente estava arrastando
    if (wasDragging) {
      const dropTarget = getDropTarget(event.clientX, event.clientY);
      onDragEnd?.(event, { x: event.clientX, y: event.clientY }, dropTarget);
    }

    setDragState({
      isDragging: false,
      startPosition: null,
      currentPosition: null,
      dragOffset: { x: 0, y: 0 }
    });

    if (preventDefault) {
      event.preventDefault();
    }
  }, [dragState.isDragging, getDropTarget, onDragEnd, preventDefault]);

  /**
   * Cancela o drag
   */
  const cancelDrag = useCallback(() => {
    const element = dragRef.current;

    if (element && activePointerRef.current !== null) {
      element.releasePointerCapture(activePointerRef.current);
      element.classList.remove('drag-active', 'drag-dragging');
      element.style.willChange = '';
    }

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    activePointerRef.current = null;
    lockedAxisRef.current = null;

    // Restaura comportamento da página
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.touchAction = '';
    document.body.style.overflowY = '';

    setDragState({
      isDragging: false,
      startPosition: null,
      currentPosition: null,
      dragOffset: { x: 0, y: 0 }
    });

    onDragCancel?.();
  }, [onDragCancel]);

  /**
   * Event handlers para anexar aos elementos
   */
  const handlers = {
    onPointerDown: startDrag,
    onPointerMove: updateDrag,
    onPointerUp: endDrag,
    onPointerCancel: cancelDrag
  };

  /**
   * Anexa event listeners ao elemento quando dragRef é definido
   */
  useEffect(() => {
    const element = dragRef.current;
    if (!element) return;

    // Adiciona listeners com passive: false para poder preventDefault
    element.addEventListener('pointerdown', startDrag, { passive: false });
    element.addEventListener('pointermove', updateDrag, { passive: false });
    element.addEventListener('pointerup', endDrag, { passive: false });
    element.addEventListener('pointercancel', cancelDrag, { passive: false });

    return () => {
      element.removeEventListener('pointerdown', startDrag);
      element.removeEventListener('pointermove', updateDrag);
      element.removeEventListener('pointerup', endDrag);
      element.removeEventListener('pointercancel', cancelDrag);
    };
  }, [startDrag, updateDrag, endDrag, cancelDrag]);

  /**
   * Cleanup ao desmontar
   */
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Restaura estado da página caso componente desmonte durante drag
      if (activePointerRef.current !== null) {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.touchAction = '';
        document.body.style.overflowY = '';
      }
    };
  }, []);

  return {
    dragState,
    dragRef,
    handlers,
    cancelDrag,
    getDropTarget
  };
}