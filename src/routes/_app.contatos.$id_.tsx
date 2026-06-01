import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ContatoForm, { type ContatoFormValues } from "@/components/ContatoForm";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/contatos/$id_")({
  head: () => ({ meta: [{ title: "Editar contato — Numeria AI" }] }),
  component: EditarContato,
});

function EditarContato() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<ContatoFormValues | null>(null);

  useEffect(() => {
    supabase.from("contatos").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error) {
        toast.error(error.message);
        return;
      }
      setInitial({
        primeiro_nome: data.primeiro_nome ?? "",
        segundo_nome: data.segundo_nome ?? "",
        sobrenome: data.sobrenome ?? "",
        data_nascimento: data.data_nascimento ?? "",
        genero: data.genero ?? "feminino",
        email: data.email ?? "",
        telefone: data.telefone ?? "",
        observacao: data.observacao ?? "",
      });
    });
  }, [id]);

  return (
    <div className="space-y-6">
      <div>
        <Link to="/contatos" className="text-sm text-muted-foreground hover:text-foreground">← Contatos</Link>
        <h1 className="text-2xl font-semibold mt-2">Editar contato</h1>
      </div>
      {initial ? (
        <ContatoForm id={id} initial={initial} onSaved={() => navigate({ to: "/contatos" })} />
      ) : (
        <p className="text-muted-foreground">Carregando…</p>
      )}
    </div>
  );
}
