import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Providers } from "@/components/providers";
import { CursorAssist } from "@/components/accessibility/cursor-assist";
import "./globals.css";
import "../styles/mobile-drag-drop.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});


export const metadata: Metadata = {
  title: "Ludico ",
  description: "Trilha da alfebetização em um recife cheio de descobertas.",
  applicationName: "Ludico",
  keywords: [
    "alfabetizaçao",
    "educação",
    "jogos educativos",
    "vogais",
    "silabas",
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
      <body className={`min-h-screen text-reef-shadow ${roboto.variable}`}>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-bubble focus:bg-reef-sand focus:px-4 focus:py-2 focus:text-reef-shadow"
        >
          Ir para o conteudo principal
        </a>
        <div id="sr-announce" aria-live="polite" className="sr-only" />
        <CursorAssist />
        <Providers>
          <main id="conteudo" className="relative z-10 flex min-h-screen flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}





