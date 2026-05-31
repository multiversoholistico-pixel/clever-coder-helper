import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import logoNumeria from "@/assets/logo-numeria.png";
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
          src={logoNumeria}
          alt="Numeria AI — A evolução da Numerologia Pitagórica"
          className="h-48 w-48 object-contain sm:h-64 sm:w-64"
        />
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Numeria <span className="text-primary">AI</span>
        </h1>
        <p className="text-lg italic text-muted-foreground">
          A evolução da Numerologia Pitagórica
        </p>
      </header>

      <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 pb-16 text-center">
        <p className="text-base text-muted-foreground">
          Uma experiência numerológica personalizada, inteligente e terapêutica.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/login">Entrar / Criar conta</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/contatos">Meus contatos</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex flex-col items-center gap-3">
          <img
            src={marcioFoto}
            alt="Marcio Ribeiro"
            className="h-16 w-16 rounded-full object-cover opacity-80"
          />
          <p>
            Desenvolvido por <strong>Marcio Ribeiro</strong> — Multiverso Holístico
          </p>
          <p>
            © {new Date().getFullYear()} Numeria AI. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
