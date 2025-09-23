"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HOLD_STORAGE_KEY = "lucido:hold-to-click";
const HOLD_DELAY_MS = 500;
const INTERACTIVE_SELECTOR =
  'button, [role="button"], input:not([type="hidden"]), select, textarea, a[href], [data-cursor-target], [tabindex]:not([tabindex="-1"])';

type HoldState = {
  target: HTMLElement | null;
  allowClick: boolean;
  triggered: boolean;
};

function isDisabledElement(element: HTMLElement | null): boolean {
  if (!element) return true;
  if ("disabled" in element && typeof (element as HTMLButtonElement).disabled === "boolean") {
    return (element as HTMLButtonElement).disabled;
  }
  if (element.getAttribute("aria-disabled") === "true") {
    return true;
  }
  return false;
}

export function CursorAssist() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const holdStateRef = useRef<HoldState | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const interactiveRef = useRef<HTMLElement | null>(null);
  const reduceMotionRef = useRef(false);

  const [holdEnabled, setHoldEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      return window.localStorage.getItem(HOLD_STORAGE_KEY) === "on";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(HOLD_STORAGE_KEY, holdEnabled ? "on" : "off");
    } catch {
      // storage failures are non-blocking
    }
    document.body.classList.toggle("cursor-hold-enabled", holdEnabled);
  }, [holdEnabled]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) {
      return;
    }

    document.body.classList.add("has-custom-cursor");
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const step = () => {
      const smoothing = reduceMotionRef.current ? 1 : 0.2;
      currentRef.current.x += (pointerRef.current.x - currentRef.current.x) * smoothing;
      currentRef.current.y += (pointerRef.current.y - currentRef.current.y) * smoothing;

      cursor.style.transform = `translate3d(${currentRef.current.x - 18}px, ${currentRef.current.y - 18}px, 0)`;
      animationRef.current = window.requestAnimationFrame(step);
    };

    const updateTarget = (raw: Element | null) => {
      const candidate = raw instanceof Element ? (raw.closest(INTERACTIVE_SELECTOR) as HTMLElement | null) : null;

      if (interactiveRef.current && interactiveRef.current !== candidate) {
        interactiveRef.current.classList.remove("cursor-target");
        interactiveRef.current.classList.remove("cursor-target--hold");
        interactiveRef.current.classList.remove("cursor-target--hold-active");
      }

      if (candidate && !isDisabledElement(candidate)) {
        candidate.classList.add("cursor-target");
        if (holdEnabled) {
          candidate.classList.add("cursor-target--hold");
        } else {
          candidate.classList.remove("cursor-target--hold");
        }
      }

      if (!candidate) {
        interactiveRef.current = null;
        return;
      }

      interactiveRef.current = candidate;
    };

    const triggerPulse = () => {
      if (!cursorRef.current) return;
      cursorRef.current.classList.remove("pulse");
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      cursorRef.current.offsetWidth;
      cursorRef.current.classList.add("pulse");
    };

    const concludeHold = (didRelease: boolean) => {
      if (holdTimerRef.current) {
        window.clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      cursor.classList.remove("is-holding");
      const state = holdStateRef.current;
      if (state?.target) {
        state.target.classList.remove("cursor-target--hold-active");
      }
      if (!didRelease && state) {
        state.allowClick = false;
      }
    };

    const startHold = (event: PointerEvent) => {
      if (!holdEnabled || event.pointerType === "touch" || event.button !== 0) {
        return;
      }
      const rawTarget = event.target as Element | null;
      const interactiveTarget = rawTarget ? (rawTarget.closest(INTERACTIVE_SELECTOR) as HTMLElement | null) : null;
      if (!interactiveTarget || isDisabledElement(interactiveTarget)) {
        return;
      }

      holdStateRef.current = { target: interactiveTarget, allowClick: false, triggered: false };
      cursor.style.setProperty("--hold-delay", `${HOLD_DELAY_MS}ms`);
      cursor.classList.add("is-holding");
      interactiveTarget.classList.add("cursor-target--hold-active");

      holdTimerRef.current = window.setTimeout(() => {
        const state = holdStateRef.current;
        if (!state) return;
        state.allowClick = true;
        state.triggered = true;
        cursor.classList.remove("is-holding");
        triggerPulse();
        state.target?.classList.remove("cursor-target--hold-active");
        if (state.target && typeof state.target.focus === "function") {
          state.target.focus({ preventScroll: true });
        }
        state.target?.click();
      }, HOLD_DELAY_MS);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        cursor.classList.remove("visible");
        updateTarget(null);
        return;
      }

      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;

      if (!animationRef.current) {
        animationRef.current = window.requestAnimationFrame(step);
      }

      cursor.classList.add("visible");
      updateTarget(event.target as Element | null);
    };

    const handlePointerLeave = () => {
      cursor.classList.remove("visible");
      updateTarget(null);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.button !== 0) {
        return;
      }
      cursor.classList.add("is-pressed");
      startHold(event);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.button !== 0) {
        return;
      }
      cursor.classList.remove("is-pressed");
      triggerPulse();
      concludeHold(true);
    };

    const handlePointerCancel = () => {
      cursor.classList.remove("is-pressed");
      concludeHold(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cursor.classList.remove("visible");
        concludeHold(false);
        updateTarget(null);
      }
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (!holdEnabled) return;
      const state = holdStateRef.current;
      if (!state) return;

      if (!state.allowClick) {
        event.preventDefault();
        event.stopPropagation();
      }

      holdStateRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("pointerup", handlePointerUp, true);
    window.addEventListener("pointercancel", handlePointerCancel, true);
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("click", handleClickCapture, true);

    animationRef.current = window.requestAnimationFrame(step);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("pointerup", handlePointerUp, true);
      window.removeEventListener("pointercancel", handlePointerCancel, true);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("click", handleClickCapture, true);

      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (holdTimerRef.current) {
        window.clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      holdStateRef.current = null;
      interactiveRef.current = null;
      document.body.classList.remove("has-custom-cursor");
      cursor.classList.remove("visible", "is-holding", "is-pressed", "pulse");
    };
  }, [holdEnabled]);

  useEffect(() => {
    const target = interactiveRef.current;
    if (!target) return;
    if (holdEnabled) {
      target.classList.add("cursor-target--hold");
    } else {
      target.classList.remove("cursor-target--hold");
      target.classList.remove("cursor-target--hold-active");
    }
  }, [holdEnabled]);

  const toggleHold = useCallback(() => {
    setHoldEnabled((prev) => !prev);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="lucido-cursor" aria-hidden="true">
        <div className="cursor-hold" />
      </div>
      <div className="cursor-preferences" role="complementary">
        <button
          type="button"
          className="cursor-preferences__button"
          onClick={toggleHold}
          aria-pressed={holdEnabled}
        >
          <span aria-hidden="true">🖱️</span>
          Segurar para clicar
        </button>
        <span className="cursor-preferences__hint">
          {holdEnabled ? "Pressione por 0,5s para confirmar o clique." : "Ative para treinar controle do mouse."}
        </span>
      </div>
    </>
  );
}
