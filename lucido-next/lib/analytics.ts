export function trackEvent(): void {
  if (process.env.NODE_ENV === "development") return;
  // Analytics intencionalmente desativado para preservar privacidade.
}
