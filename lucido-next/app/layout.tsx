import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Lexend } from "next/font/google";
import { Providers } from "@/components/providers";
import "../styles/globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lucido Ocean Trail",
  description: "Trilha lúdica de alfabetização em um recife cheio de descobertas.",
  applicationName: "Lucido",
  keywords: [
    "alfabetização",
    "educação",
    "jogos educativos",
    "vogais",
    "sílabas",
    "soletração",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${lexend.variable} ${atkinson.variable} min-h-screen text-reef-shadow`}>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-bubble focus:bg-reef-sand focus:px-4 focus:py-2 focus:text-reef-shadow"
        >
          Ir para o conteúdo principal
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
