import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";


export const metadata: Metadata = {
  title: "Lucido Ocean Trail",
  description: "Trilha lÃºdica de alfabetizaÃ§Ã£o em um recife cheio de descobertas.",
  applicationName: "Lucido",
  keywords: [
    "alfabetizaÃ§Ã£o",
    "educaÃ§Ã£o",
    "jogos educativos",
    "vogais",
    "sÃ­labas",
    "soletraÃ§Ã£o",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-screen text-reef-shadow">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-bubble focus:bg-reef-sand focus:px-4 focus:py-2 focus:text-reef-shadow"
        >
          Ir para o conteÃºdo principal
        </a>
        <div id="sr-announce" aria-live="polite" className="sr-only" />
        <Providers>
          <main id="conteudo" className="relative z-10 flex min-h-screen flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}





