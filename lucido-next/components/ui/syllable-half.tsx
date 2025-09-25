"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface SyllableHalfProps {
  text: string;
  color?: string;
  onDrop?: (droppedText: string) => void;
  onDragStart?: () => void;
  draggable?: boolean;
  isMatched?: boolean;
  isTarget?: boolean;
  isEmpty?: boolean;
  className?: string;
  disabled?: boolean;
}

export function SyllableHalf({
  text,
  color = "#3B82F6",
  onDrop,
  onDragStart,
  draggable = true,
  isMatched = false,
  isTarget = false,
  isEmpty = false,
  className,
  disabled = false,
}: SyllableHalfProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number; element: HTMLElement | null }>({ x: 0, y: 0, element: null });

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable || disabled) return;
    e.dataTransfer.setData("text/plain", text);
    onDragStart?.();
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isTarget || disabled) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isTarget || disabled) return;
    e.preventDefault();
    const droppedText = e.dataTransfer.getData("text/plain");
    setIsDragOver(false);
    onDrop?.(droppedText);
  };

  // Touch events para mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!draggable || disabled || isTarget) return;

    const touch = e.touches[0];
    if (!touch) return;

    setIsDragging(true);
    touchRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      element: e.currentTarget as HTMLElement
    };

    onDragStart?.();

    // Previne scroll no mobile
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !touchRef.current.element) return;

    const touch = e.touches[0];
    if (!touch) return;

    // Move o elemento visualmente
    const element = touchRef.current.element;
    const deltaX = touch.clientX - touchRef.current.x;
    const deltaY = touch.clientY - touchRef.current.y;

    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    element.style.zIndex = '1000';
    element.style.opacity = '0.8';

    // Encontra elemento sob o toque
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetElement = elementBelow?.closest('[data-drop-target="true"]') as HTMLElement;

    // Atualiza estado de drag over
    if (targetElement && targetElement !== element) {
      setIsDragOver(true);
    } else {
      setIsDragOver(false);
    }

    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !touchRef.current.element) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    // Reset visual state
    const element = touchRef.current.element;
    element.style.transform = '';
    element.style.zIndex = '';
    element.style.opacity = '';

    // Encontra elemento de destino
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetElement = elementBelow?.closest('[data-drop-target="true"]') as HTMLElement;

    if (targetElement && targetElement !== element) {
      // Simula drop
      onDrop?.(text);
    }

    setIsDragging(false);
    setIsDragOver(false);
    touchRef.current = { x: 0, y: 0, element: null };
  };

  const baseClasses = cn(
    "relative flex items-center justify-center rounded-full font-bold transition-all duration-300 select-none",
    "border-2 shadow-lg",
    {
      // Estados de drag
      "cursor-grab active:cursor-grabbing": draggable && !disabled && !isTarget,
      "cursor-not-allowed opacity-50": disabled,

      // Target específico
      "border-dashed border-gray-300 bg-white/80": isTarget && isEmpty && !isDragOver,
      "border-dashed border-blue-400 bg-blue-50 scale-105": isTarget && isEmpty && isDragOver,

      // Sílaba normal
      "border-white bg-white shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1":
        !isTarget && !isEmpty,

      // Matched state
      "ring-4 ring-green-400 animate-pulse": isMatched,

      // Sizes responsivas
      "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24": true,
      "text-lg sm:text-xl md:text-2xl": true,
    },
    className
  );

  return (
    <div
      ref={dragRef}
      className={baseClasses}
      draggable={draggable && !disabled && !isTarget}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-drop-target={isTarget ? "true" : "false"}
      style={
        !isTarget && !isEmpty && !isMatched
          ? {
              background: `linear-gradient(135deg, ${color}20, ${color}40)`,
              borderColor: color,
              color: color,
            }
          : undefined
      }
      aria-label={
        isTarget
          ? isEmpty
            ? "Área de soltar sílaba"
            : `Sílaba ${text} conectada`
          : `Sílaba ${text}`
      }
    >
      {isEmpty && isTarget ? (
        <span className="text-gray-400 text-xl">?</span>
      ) : (
        <>
          <span className="relative z-10">{text}</span>
          {/* Efeito de brilho sutil */}
          {!isTarget && !isEmpty && (
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                background: `radial-gradient(circle at 30% 30%, white, transparent)`,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}