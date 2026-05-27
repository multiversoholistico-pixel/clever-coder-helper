import { createFileRoute } from "@tanstack/react-router";
import logoMarcio from "@/assets/logo-marcio.jpg";
import marcioFoto from "@/assets/marcio-foto.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Numeria AI — A evolução da Numerologia Pitagórica" },
      { name: "description", content: "Numeria AI — a evolução da Numerologia Pitagórica. Estudo numerológico inteligente por Marcio Ribeiro." },
      { property: "og:title", content: "Numeria AI — A evolução da Numerologia Pitagórica" },
      { property: "og:description", content: "Numeria AI — a evolução da Numerologia Pitagórica." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 pt-16 pb-10 text-center">
        <img
          src={logoMarcio}
          alt="Marcio Ribeiro — Multiverso Holístico"
          className="h-40 w-40 rounded-full object-cover shadow-lg sm:h-52 sm:w-52"
        />
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Numeria <span className="text-primary">AI</span>
        </h1>
        <p className="text-lg italic text-muted-foreground">
          A evolução da Numerologia Pitagórica
        </p>
      </header>

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 pb-16 text-center">
        <img
          src={marcioFoto}
          alt="Marcio Ribeiro"
          className="h-64 w-auto object-contain sm:h-80"
        />
        <p className="max-w-2xl text-base text-muted-foreground">
          Uma experiência numerológica personalizada, inteligente e terapêutica —
          desenvolvida por <strong>Marcio Ribeiro</strong>, Multiverso Holístico.
        </p>
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Numeria AI — Marcio Ribeiro, Multiverso Holístico. Todos os direitos reservados.
        <br />
        Imagens e marca de uso exclusivo, protegidas por direitos autorais.
      </footer>
    </div>
  );
}
