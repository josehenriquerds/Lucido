/**
 * Hook simplificado para drag-and-drop em jogos educacionais
 * Wrapper em volta de usePointerDrag com defaults otimizados
 */

import { useCallback } from "react";
import { usePointerDrag, type PointerDragConfig } from "./usePointerDrag";

export interface DragDropConfig {
  /** Dados do item sendo arrastado */
  itemId: string;
  itemData?: Record<string, any>;

  /** Se o item pode ser arrastado */
  disabled?: boolean;

  /** Callback quando drag inicia */
  onDragStart?: (itemId: string, data?: Record<string, any>) => void;

  /** Callback durante movimento */
  onDragMove?: (itemId: string, position: { x: number; y: number }) => void;

  /** Callback quando drop acontece */
  onDrop?: (itemId: string, targetId?: string, targetData?: any) => void;

  /** Callback quando drag é cancelado */
  onCancel?: (itemId: string) => void;
}

/**
 * Hook para elementos arrastáveis
 */
export function useDraggable(config: DragDropConfig) {
  const {
    itemId,
    itemData = {},
    disabled = false,
    onDragStart,
    onDragMove,
    onDrop,
    onCancel
  } = config;

  const dragConfig: PointerDragConfig = {
    // Otimizado para jogos: threshold pequeno mas presente
    pressThreshold: 6,
    // Permite movimento em ambos os eixos
    axis: 'both',
    // Lock axis para melhor UX em listas
    lockAxis: true,
    // Dados do item
    dragData: { itemId, ...itemData },
    // Previne scroll durante drag
    preventDefault: true,

    onDragStart: useCallback((event: PointerEvent, data?: Record<string, any>) => {
      onDragStart?.(itemId, data);
    }, [itemId, onDragStart]),

    onDragMove: useCallback((event: PointerEvent, position: { x: number; y: number }) => {
      onDragMove?.(itemId, position);
    }, [itemId, onDragMove]),

    onDragEnd: useCallback((event: PointerEvent, position: { x: number; y: number }, target?: Element | null) => {
      if (target) {
        const targetId = target.getAttribute('data-drop-target-id');
        const targetData = target.getAttribute('data-drop-target-data');

        try {
          const parsedData = targetData ? JSON.parse(targetData) : undefined;
          onDrop?.(itemId, targetId || undefined, parsedData);
        } catch {
          onDrop?.(itemId, targetId || undefined, undefined);
        }
      } else {
        onCancel?.(itemId);
      }
    }, [itemId, onDrop, onCancel]),

    onDragCancel: useCallback(() => {
      onCancel?.(itemId);
    }, [itemId, onCancel])
  };

  const { dragState, dragRef, cancelDrag } = usePointerDrag(dragConfig);

  return {
    /** Ref para anexar ao elemento arrastável */
    dragRef,
    /** Estado do drag */
    isDragging: dragState.isDragging,
    /** Função para cancelar drag */
    cancelDrag,
    /** Props para o elemento (inclui classes CSS e ARIA) */
    dragProps: {
      className: `drag-handle touch-ripple ${disabled ? 'opacity-50 pointer-events-none' : ''}`,
      'aria-grabbed': dragState.isDragging,
      'aria-disabled': disabled,
      'aria-describedby': `${itemId}-instructions`,
      tabIndex: disabled ? -1 : 0,
      role: 'button',
      // Data attributes para identificação
      'data-drag-item-id': itemId,
      'data-drag-item-type': itemData.type || 'item'
    },
    /** Elemento de instruções para leitores de tela */
    instructionsId: `${itemId}-instructions`,
    ariaInstructions: disabled
      ? `${itemId} está desabilitado`
      : `Arraste ${itemId} ou use Espaço para pegar, setas para navegar, Enter para soltar`
  };
}

export interface DropZoneConfig {
  /** ID único do drop zone */
  targetId: string;
  targetData?: Record<string, any>;

  /** Se pode receber drops */
  disabled?: boolean;

  /** Tipos de items aceitos (opcional) */
  acceptedTypes?: string[];

  /** Callback quando item é dropado */
  onDrop?: (droppedItemId: string, targetId: string, droppedData?: any, targetData?: any) => void;

  /** Callback quando item entra na área */
  onDragEnter?: (itemId: string, targetId: string) => void;

  /** Callback quando item sai da área */
  onDragLeave?: (itemId: string, targetId: string) => void;
}

/**
 * Hook para drop zones (áreas que recebem drops)
 */
export function useDropZone(config: DropZoneConfig) {
  const {
    targetId,
    targetData = {},
    disabled = false,
    acceptedTypes,
    onDrop,
    onDragEnter,
    onDragLeave
  } = config;

  return {
    /** Props para o drop zone */
    dropProps: {
      'data-drop-target': 'true',
      'data-drop-target-id': targetId,
      'data-drop-target-data': JSON.stringify(targetData),
      'data-accepted-types': acceptedTypes?.join(',') || '*',
      className: `drop-target ${disabled ? 'opacity-50 pointer-events-none' : ''}`,
      'aria-dropeffect': (disabled ? 'none' : 'move') as 'none' | 'move',
      'aria-describedby': `${targetId}-drop-instructions`,
      role: 'region',
      tabIndex: -1, // Só focável durante navegação por teclado
      'aria-label': `Área para soltar itens: ${targetId}`
    },
    /** Elemento de instruções para drop zone */
    dropInstructionsId: `${targetId}-drop-instructions`,
    dropAriaInstructions: disabled
      ? `Área ${targetId} está desabilitada`
      : `Solte itens aqui ou pressione Enter quando estiver carregando um item`
  };
}

/**
 * Hook para elementos que são tanto arrastáveis quanto drop zones
 */
export function useDragDropHybrid(
  dragConfig: DragDropConfig,
  dropConfig: DropZoneConfig
) {
  const draggable = useDraggable(dragConfig);
  const dropZone = useDropZone(dropConfig);

  return {
    ...draggable,
    ...dropZone,
    hybridProps: {
      ...draggable.dragProps,
      ...dropZone.dropProps,
      className: `${draggable.dragProps.className} ${dropZone.dropProps.className}`.trim()
    }
  };
}