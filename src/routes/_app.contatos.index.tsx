import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Calculator } from "lucide-react";

type Contato = {
  id: string;
  primeiro_nome: string;
  segundo_nome: string | null;
  sobrenome: string;
  data_nascimento: string;
  genero: string;
  email: string | null;
  telefone: string | null;
};

export const Route = createFileRoute("/_app/contatos/")({
  head: () => ({ meta: [{ title: "Contatos — Numeria AI" }] }),
  component: ContatosList,
});

function ContatosList() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contatos")
      .select("id, primeiro_nome, segundo_nome, sobrenome, data_nascimento, genero, email, telefone")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setContatos((data as Contato[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Excluir este contato?")) return;
    const { error } = await supabase.from("contatos").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Contato excluído");
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contatos</h1>
          <p className="text-sm text-muted-foreground">Pessoas para análise numerológica</p>
        </div>
        <Button asChild>
          <Link to="/contatos/novo"><Plus className="h-4 w-4 mr-1" /> Novo contato</Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando…</p>
      ) : contatos.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <p className="text-muted-foreground">Nenhum contato cadastrado ainda.</p>
          <Button asChild><Link to="/contatos/novo">Cadastrar primeiro contato</Link></Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {contatos.map((c) => (
            <Card key={c.id} className="p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {[c.primeiro_nome, c.segundo_nome, c.sobrenome].filter(Boolean).join(" ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(c.data_nascimento + "T00:00:00").toLocaleDateString("pt-BR")} · {c.genero}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" disabled title="Em breve">
                  <Calculator className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contatos/$id" params={{ id: c.id }}><Pencil className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => remove(c.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
