/**
 * Hook para navegação por teclado em drag-and-drop
 * Implementa padrões WAI-ARIA para acessibilidade
 */

import { useCallback, useEffect, useRef, useState } from "react";

export interface KeyboardDragDropConfig {
  /** Lista de elementos arrastáveis */
  draggableItems: Array<{
    id: string;
    element: HTMLElement;
    label: string;
  }>;

  /** Lista de drop zones */
  dropZones: Array<{
    id: string;
    element: HTMLElement;
    label: string;
    accepts?: string[];
  }>;

  /** Callback quando item é dropado via teclado */
  onKeyboardDrop?: (itemId: string, targetId: string) => void;

  /** Callback para anunciar mudanças */
  onAnnounce?: (message: string) => void;
}

export interface KeyboardDragDropState {
  /** Item atualmente selecionado */
  selectedItem: string | null;
  /** Item sendo "carregado" (pego para drag) */
  carriedItem: string | null;
  /** Drop zone com foco */
  focusedDropZone: string | null;
  /** Modo atual */
  mode: 'browse' | 'drag';
}

/**
 * Hook para suporte a teclado no drag-and-drop
 */
export function useKeyboardDragDrop(config: KeyboardDragDropConfig) {
  const {
    draggableItems = [],
    dropZones = [],
    onKeyboardDrop,
    onAnnounce
  } = config;

  const [state, setState] = useState<KeyboardDragDropState>({
    selectedItem: null,
    carriedItem: null,
    focusedDropZone: null,
    mode: 'browse'
  });

  const announceRef = useRef<(message: string) => void>(() => {});
  announceRef.current = onAnnounce || (() => {});

  /**
   * Anuncia mensagem para leitores de tela
   */
  const announce = useCallback((message: string) => {
    announceRef.current!(message);

    // Fallback: atualiza aria-live region
    const liveRegion = document.getElementById('sr-announce');
    if (liveRegion) {
      liveRegion.textContent = message;
      // Limpa após um tempo para não acumular
      setTimeout(() => {
        if (liveRegion.textContent === message) {
          liveRegion.textContent = '';
        }
      }, 1000);
    }
  }, []);

  /**
   * Encontra próximo item na lista
   */
  const getNextItem = useCallback((
    items: Array<{ id: string; element: HTMLElement }>,
    currentId: string | null,
    direction: 'next' | 'previous'
  ): string | null => {
    if (items.length === 0) return null;
    if (!currentId) return items[0].id;

    const currentIndex = items.findIndex(item => item.id === currentId);
    if (currentIndex === -1) return items[0].id;

    if (direction === 'next') {
      return items[(currentIndex + 1) % items.length].id;
    } else {
      return items[(currentIndex - 1 + items.length) % items.length].id;
    }
  }, []);

  /**
   * Move foco entre elementos
   */
  const moveFocus = useCallback((direction: 'next' | 'previous') => {
    setState(prevState => {
      if (prevState.mode === 'browse') {
        // Navegando entre items arrastáveis
        const nextItemId = getNextItem(draggableItems, prevState.selectedItem, direction);

        if (nextItemId) {
          const item = draggableItems.find(i => i.id === nextItemId);
          if (item) {
            item.element.focus();
            announce(`${item.label}. Pressione Espaço para pegar ou Enter para ações.`);
          }
        }

        return {
          ...prevState,
          selectedItem: nextItemId
        };
      } else if (prevState.mode === 'drag') {
        // Navegando entre drop zones
        const nextZoneId = getNextItem(dropZones, prevState.focusedDropZone, direction);

        if (nextZoneId) {
          const zone = dropZones.find(z => z.id === nextZoneId);
          if (zone) {
            zone.element.focus();
            announce(`${zone.label}. Pressione Espaço para soltar ou Escape para cancelar.`);
          }
        }

        return {
          ...prevState,
          focusedDropZone: nextZoneId
        };
      }

      return prevState;
    });
  }, [draggableItems, dropZones, getNextItem, announce]);

  /**
   * Pega item para arrastar
   */
  const pickupItem = useCallback((itemId: string) => {
    const item = draggableItems.find(i => i.id === itemId);
    if (!item) return;

    setState(prevState => ({
      ...prevState,
      carriedItem: itemId,
      mode: 'drag',
      focusedDropZone: dropZones.length > 0 ? dropZones[0].id : null
    }));

    // Atualiza ARIA attributes
    item.element.setAttribute('aria-grabbed', 'true');

    // Foca no primeiro drop zone disponível
    if (dropZones.length > 0) {
      dropZones[0].element.focus();
      announce(`${item.label} pego. Navegue até a área de destino e pressione Espaço para soltar.`);
    }

    // Atualiza dropeffect nos drop zones
    dropZones.forEach(zone => {
      const accepts = zone.accepts || [];
      if (accepts.length === 0 || accepts.includes('*')) {
        zone.element.setAttribute('aria-dropeffect', 'move');
      }
    });
  }, [draggableItems, dropZones, announce]);

  /**
   * Solta item no drop zone
   */
  const dropItem = useCallback((zoneId: string) => {
    const { carriedItem } = state;
    if (!carriedItem) return;

    const item = draggableItems.find(i => i.id === carriedItem);
    const zone = dropZones.find(z => z.id === zoneId);

    if (!item || !zone) return;

    // Verifica se o drop zone aceita este tipo de item
    const accepts = zone.accepts || ['*'];
    if (accepts.length > 0 && !accepts.includes('*')) {
      // Aqui poderia verificar tipo do item se implementado
      // Por enquanto, aceita todos
    }

    setState(prevState => ({
      ...prevState,
      carriedItem: null,
      mode: 'browse',
      focusedDropZone: null,
      selectedItem: carriedItem
    }));

    // Remove ARIA attributes
    item.element.setAttribute('aria-grabbed', 'false');
    dropZones.forEach(z => {
      z.element.setAttribute('aria-dropeffect', 'none');
    });

    // Executa callback
    onKeyboardDrop?.(carriedItem, zoneId);

    // Volta foco para o item
    item.element.focus();
    announce(`${item.label} solto em ${zone.label}.`);
  }, [state, draggableItems, dropZones, onKeyboardDrop, announce]);

  /**
   * Cancela drag
   */
  const cancelDrag = useCallback(() => {
    const { carriedItem } = state;
    if (!carriedItem) return;

    const item = draggableItems.find(i => i.id === carriedItem);

    setState(prevState => ({
      ...prevState,
      carriedItem: null,
      mode: 'browse',
      focusedDropZone: null,
      selectedItem: carriedItem
    }));

    // Remove ARIA attributes
    if (item) {
      item.element.setAttribute('aria-grabbed', 'false');
    }
    dropZones.forEach(z => {
      z.element.setAttribute('aria-dropeffect', 'none');
    });

    // Volta foco para o item
    if (item) {
      item.element.focus();
      announce(`Arrasto cancelado. ${item.label} não foi movido.`);
    }
  }, [state, draggableItems, dropZones, announce]);

  /**
   * Handler de teclado principal
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, target } = event;
    const element = target as HTMLElement;

    // Encontra contexto atual
    const currentItem = draggableItems.find(item => item.element === element);
    const currentZone = dropZones.find(zone => zone.element === element);

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        moveFocus('next');
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        moveFocus('previous');
        break;

      case ' ': // Espaço
        event.preventDefault();
        if (state.mode === 'browse' && currentItem) {
          pickupItem(currentItem.id);
        } else if (state.mode === 'drag' && currentZone) {
          dropItem(currentZone.id);
        }
        break;

      case 'Enter':
        if (currentItem) {
          // Enter pode ter comportamento específico por item
          announce(`${currentItem.label} ativado.`);
        } else if (currentZone) {
          // Enter em drop zone - mesma ação que Espaço
          event.preventDefault();
          if (state.mode === 'drag') {
            dropItem(currentZone.id);
          }
        }
        break;

      case 'Escape':
        if (state.mode === 'drag') {
          event.preventDefault();
          cancelDrag();
        }
        break;

      case 'Home':
        event.preventDefault();
        if (state.mode === 'browse' && draggableItems.length > 0) {
          setState(prev => ({ ...prev, selectedItem: draggableItems[0].id }));
          draggableItems[0].element.focus();
          announce(`Primeiro item: ${draggableItems[0].label}`);
        } else if (state.mode === 'drag' && dropZones.length > 0) {
          setState(prev => ({ ...prev, focusedDropZone: dropZones[0].id }));
          dropZones[0].element.focus();
          announce(`Primeira área: ${dropZones[0].label}`);
        }
        break;

      case 'End':
        event.preventDefault();
        if (state.mode === 'browse' && draggableItems.length > 0) {
          const lastItem = draggableItems[draggableItems.length - 1];
          setState(prev => ({ ...prev, selectedItem: lastItem.id }));
          lastItem.element.focus();
          announce(`Último item: ${lastItem.label}`);
        } else if (state.mode === 'drag' && dropZones.length > 0) {
          const lastZone = dropZones[dropZones.length - 1];
          setState(prev => ({ ...prev, focusedDropZone: lastZone.id }));
          lastZone.element.focus();
          announce(`Última área: ${lastZone.label}`);
        }
        break;
    }
  }, [state, draggableItems, dropZones, moveFocus, pickupItem, dropItem, cancelDrag, announce]);

  /**
   * Inicializa ARIA attributes nos elementos
   */
  useEffect(() => {
    // Configura draggable items
    draggableItems.forEach(item => {
      item.element.setAttribute('draggable', 'true');
      item.element.setAttribute('aria-grabbed', 'false');
      item.element.setAttribute('tabindex', '0');
      item.element.setAttribute('role', 'button');
      item.element.setAttribute('aria-label',
        `${item.label}. Pressione Espaço para pegar, setas para navegar.`
      );
    });

    // Configura drop zones
    dropZones.forEach(zone => {
      zone.element.setAttribute('aria-dropeffect', 'none');
      zone.element.setAttribute('tabindex', '-1'); // Só focável durante drag
      zone.element.setAttribute('role', 'region');
      zone.element.setAttribute('aria-label',
        `${zone.label}. Área para soltar itens.`
      );
    });
  }, [draggableItems, dropZones]);

  /**
   * Anexa event listeners
   */
  useEffect(() => {
    const elements = [
      ...draggableItems.map(item => item.element),
      ...dropZones.map(zone => zone.element)
    ];

    elements.forEach(element => {
      element.addEventListener('keydown', handleKeyDown);
    });

    return () => {
      elements.forEach(element => {
        element.removeEventListener('keydown', handleKeyDown);
      });
    };
  }, [handleKeyDown, draggableItems, dropZones]);

  return {
    state,
    actions: {
      pickupItem,
      dropItem,
      cancelDrag,
      moveFocus
    }
  };
}