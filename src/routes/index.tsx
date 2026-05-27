import { createFileRoute } from "@tanstack/react-router";
import logoMarcio from "@/assets/logo-marcio.jpg";
import marcioFoto from "@/assets/marcio-foto.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sinfonia dos Números — Marcio Ribeiro" },
      { name: "description", content: "Estudo numerológico — Marcio Ribeiro, Multiverso Holístico." },
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
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Marcio Ribeiro
        </h1>
        <p className="text-lg text-muted-foreground">
          Multiverso Holístico — Terapias | Cursos | Workshops
        </p>
      </header>

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 pb-16 text-center">
        <img
          src={marcioFoto}
          alt="Marcio Ribeiro"
          className="h-64 w-auto object-contain sm:h-80"
        />
        <p className="max-w-2xl text-base text-muted-foreground">
          Bem-vindo ao Sinfonia dos Números — estudo numerológico personalizado.
        </p>
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Marcio Ribeiro — Multiverso Holístico. Todos os direitos reservados.
        <br />
        Imagens e marca de uso exclusivo, protegidas por direitos autorais.
      </footer>
    </div>
  );
}
