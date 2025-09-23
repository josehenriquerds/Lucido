"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getLetterTheme } from "@/lib/letter-theme";

export type LetterCardProps = {
  value: string;               // "A"
  asButton?: boolean;
  emphasized?: boolean;        // aumenta ainda mais (para telas TV)
  showHelperImage?: boolean;   // mostra imagem/emoji da letra
  ariaLabel?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  pressed?: boolean;
  children?: React.ReactNode;
};

export const LetterCard = forwardRef<HTMLButtonElement | HTMLDivElement, LetterCardProps>(
  (
    {
      value,
      asButton = false,
      emphasized = false,
      showHelperImage = true,
      ariaLabel,
      className,
      onClick,
      disabled = false,
      pressed = false,
      children,
      ...props
    },
    ref
  ) => {
    const letter = value.toUpperCase();
    const theme = getLetterTheme(letter);

    if (!theme) {
      console.warn(`No theme found for letter: ${letter}`);
      return null;
    }

    const fontSize = emphasized
      ? "clamp(28px, 8vw, 112px)"
      : "clamp(20px, 6vw, 88px)";

    const outlineWidth = emphasized ? "6px" : "4px";

    const baseClasses = cn(
      "relative rounded-2xl p-2 sm:p-4 md:p-6 bg-white shadow-[0_6px_24px_rgba(15,23,42,.12)] transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2",
      className
    );

    const cardContent = (
      <>
        {/* Card interior com gradiente */}
        <div
          className="group relative grid aspect-square w-full place-items-center rounded-2xl overflow-hidden transition-transform duration-200"
          style={{ background: theme.bg }}
        >
          {/* Letra principal */}
          <span
            className="relative font-black text-slate-900 drop-shadow-[0_1px_0_rgba(255,255,255,.6)] select-none"
            style={{ fontSize }}
            aria-hidden="true"
          >
            {letter}
          </span>

          {/* Imagem/emoji helper */}
          {showHelperImage && (
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
              {theme.image ? (
                <div className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12">
                  <Image
                    src={theme.image}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 24px, (max-width: 768px) 32px, 48px"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <span
                  className="text-lg sm:text-2xl md:text-4xl select-none"
                  aria-hidden="true"
                >
                  {theme.emoji}
                </span>
              )}
            </div>
          )}

          {/* Outline colorido */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-200"
            style={{
              boxShadow: `0 0 0 ${outlineWidth} ${theme.color} inset`,
              opacity: pressed ? 0.8 : 1
            }}
          />

          {/* Efeito hover para botões */}
          {asButton && (
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
          )}
        </div>

        {/* Conteúdo adicional */}
        {children}
      </>
    );

    if (asButton) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={cn(
            baseClasses,
            "min-h-[48px] min-w-[48px] sm:min-h-[64px] sm:min-w-[64px] cursor-pointer hover:shadow-[0_8px_32px_rgba(15,23,42,.16)]",
            disabled && "opacity-50 cursor-not-allowed",
            "hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
          )}
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel || theme.labelPT}
          aria-pressed={pressed}
          role="button"
          {...props}
        >
          {cardContent}
        </button>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={baseClasses}
        aria-label={ariaLabel || theme.labelPT}
        {...props}
      >
        {cardContent}
      </div>
    );
  }
);

LetterCard.displayName = "LetterCard";