"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { getSyllableTheme } from "@/lib/letter-theme";

export type SyllableCardProps = {
  syllable: string;           // "PA"
  isPrimary?: boolean;        // destaque (ex.: chamada)
  asButton?: boolean;
  showHelperImage?: boolean;  // mostra emoji/imagem
  ariaLabel?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  pressed?: boolean;
  marked?: boolean;           // estado de marcado (bingo)
  children?: React.ReactNode;
};

export const SyllableCard = forwardRef<HTMLButtonElement | HTMLDivElement, SyllableCardProps>(
  (
    {
      syllable,
      isPrimary = false,
      asButton = false,
      ariaLabel,
      className,
      onClick,
      disabled = false,
      pressed = false,
      marked = false,
      children,
      ...props
    },
    ref
  ) => {
    const upper = syllable.toUpperCase();
    const theme = getSyllableTheme(upper);
    if (!theme) return null;

    // Letras grandes porém seguras para pílulas responsivas
    const fontSize = isPrimary
      ? "clamp(22px, 4.5vw, 40px)"
      : "clamp(18px, 3.8vw, 32px)";

    const outline = isPrimary ? 6 : 3;

    // Contêiner da pílula (preenche largura do grid; altura fluida)
    const base = cn(
      "group relative w-full rounded-[18px] overflow-hidden",
      "bg-white/96 backdrop-blur-[2px]",
      "shadow-[0_6px_24px_rgba(15,23,42,.10)] transition-all duration-200",
      // foco com outline (não usa ring grande → evita overflow)
      "focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-500 focus-visible:outline-offset-[2px]",
      disabled && "opacity-50 cursor-not-allowed",
      className
    );

    // Miolo com gradiente suave e animações de hover/active
    const inner = cn(
      "relative flex items-center justify-center w-full h-full min-h-[48px] sm:min-h-[56px] px-4 sm:px-6",
      "transition-transform duration-200 will-change-transform",
      "data-[state=hover]:scale-[1.01] data-[state=active]:scale-[0.98]"
    );

    // Fundo: mais colorido no primário
    const bgStyle = {
      background: isPrimary
        ? theme.bg ?? `linear-gradient(180deg, ${theme.color}1A, #ffffff)`
        : "linear-gradient(180deg, #FFFFFF, #F8FAFC)",
    } as React.CSSProperties;

    const Content = (
      <>
        <div className={inner} style={bgStyle}>
          {/* Sílabas grandes e com sombra suave p/ leitura */}
          <span
            className="relative font-extrabold leading-none tracking-wider select-none drop-shadow-[0_1px_0_rgba(255,255,255,.7)]"
            style={{ fontSize, color: isPrimary ? theme.color : "#111827" }}
            aria-hidden="true"
          >
            {upper}
          </span>

          {/* Emoji/Imagem auxiliar – direita da pílula */}
          {/* {showHelperImage && (
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 opacity-90">
              {theme.image ? (
                <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                  <Image
                    src={theme.image}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="32px"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <span className="text-2xl sm:text-3xl select-none" aria-hidden="true">
                  {theme.emoji}
                </span>
              )}
            </div>
          )} */}

          {/* Outline colorido (inset) para não “vazar” */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[18px]"
            style={{ boxShadow: `0 0 0 ${outline}px ${theme.color} inset`, opacity: pressed ? 0.85 : 1 }}
          />

          {/* Selo de marcado (carimbo sutil) */}
          {marked && (
            <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-emerald-500/10 animate-correctPulse" />
          )}
        </div>

        {children}
      </>
    );

    if (asButton) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={base}
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel || `Sílaba ${upper}`}
          aria-pressed={pressed}
          role="button"
          // estados para o scale do miolo
          onMouseEnter={(e) => e.currentTarget.firstElementChild?.setAttribute("data-state", "hover")}
          onMouseLeave={(e) => e.currentTarget.firstElementChild?.setAttribute("data-state", "")}
          onMouseDown={(e) => e.currentTarget.firstElementChild?.setAttribute("data-state", "active")}
          onMouseUp={(e) => e.currentTarget.firstElementChild?.setAttribute("data-state", "hover")}
          onTouchStart={(e) => e.currentTarget.firstElementChild?.setAttribute("data-state", "active")}
          onTouchEnd={(e) => e.currentTarget.firstElementChild?.setAttribute("data-state", "hover")}
          {...props}
        >
          {Content}
        </button>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={base}
        aria-label={ariaLabel || `Sílaba ${upper}`}
        {...props}
      >
        {Content}
      </div>
    );
  }
);

SyllableCard.displayName = "SyllableCard";
