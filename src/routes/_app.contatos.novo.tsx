import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import ContatoForm from "@/components/ContatoForm";

export const Route = createFileRoute("/_app/contatos/novo")({
  head: () => ({ meta: [{ title: "Novo contato — Numeria AI" }] }),
  component: NovoContato,
});

function NovoContato() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <Link to="/contatos" className="text-sm text-muted-foreground hover:text-foreground">← Contatos</Link>
        <h1 className="text-2xl font-semibold mt-2">Novo contato</h1>
      </div>
      <ContatoForm onSaved={() => navigate({ to: "/contatos" })} />
    </div>
  );
}
