"use client";

import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortingStrategy = "grid" | "vertical" | "horizontal";

export function SortableGrid<T extends { id: string }>({
  items,
  renderItem,
  strategy = "grid",
  className
}: {
  items: T[];
  renderItem: (item: T, isDragging: boolean) => React.ReactNode;
  strategy?: SortingStrategy;
  className?: string;
}) {
  const strategies = {
    grid: rectSortingStrategy,
    vertical: verticalListSortingStrategy,
    horizontal: horizontalListSortingStrategy
  };

  return (
    <SortableContext items={items.map(item => item.id)} strategy={strategies[strategy]}>
      <div className={className}>
        {items.map(item => (
          <SortableItem key={item.id} id={item.id}>
            {(isDragging) => renderItem(item, isDragging)}
          </SortableItem>
        ))}
      </div>
    </SortableContext>
  );
}

function SortableItem({
  id,
  children
}: {
  id: string;
  children: (isDragging: boolean) => React.ReactNode;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-grabbed={isDragging}
      className="touch-none"
    >
      {children(isDragging)}
    </div>
  );
}