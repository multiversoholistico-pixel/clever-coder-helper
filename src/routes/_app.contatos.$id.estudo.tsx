import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { calcularMapa, interpretar, type MapaNumerologico } from "@/lib/numerologia";
import { toast } from "sonner";

type Contato = {
  id: string;
  primeiro_nome: string;
  segundo_nome: string | null;
  sobrenome: string;
  data_nascimento: string;
  genero: string;
};

export const Route = createFileRoute("/_app/contatos/$id/estudo")({
  head: () => ({ meta: [{ title: "Estudo Numerológico — Numeria AI" }] }),
  component: EstudoPage,
});

function EstudoPage() {
  const { id } = Route.useParams();
  const [contato, setContato] = useState<Contato | null>(null);
  const [mapa, setMapa] = useState<MapaNumerologico | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("contatos")
        .select("id, primeiro_nome, segundo_nome, sobrenome, data_nascimento, genero")
        .eq("id", id)
        .single();
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      const c = data as Contato;
      setContato(c);
      const nome = [c.primeiro_nome, c.segundo_nome, c.sobrenome].filter(Boolean).join(" ");
      setMapa(calcularMapa(nome, c.data_nascimento));
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <p className="text-muted-foreground">Calculando mapa…</p>;
  if (!contato || !mapa) return <p>Contato não encontrado.</p>;

  const nomeCompleto = [contato.primeiro_nome, contato.segundo_nome, contato.sobrenome].filter(Boolean).join(" ");
  const dataFmt = new Date(contato.data_nascimento + "T00:00:00").toLocaleDateString("pt-BR");

  const principais = [
    { chave: "Caminho de Vida", valor: mapa.caminhoDeVida, nota: "A jornada essencial desta encarnação." },
    { chave: "Expressão / Destino", valor: mapa.expressao, nota: "Como você se manifesta no mundo." },
    { chave: "Alma / Motivação", valor: mapa.alma, nota: "Seus desejos mais profundos." },
    { chave: "Personalidade", valor: mapa.personalidade, nota: "Como os outros te percebem." },
    { chave: "Dia de Nascimento", valor: mapa.diaNascimento, nota: "Talento natural revelado pelo dia." },
    { chave: "Ano Pessoal", valor: mapa.anoPessoal, nota: `Energia regente do ano de ${new Date().getFullYear()}.` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/contatos"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Link>
        </Button>
      </div>

      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Estudo Numerológico Pitagórico</p>
        <h1 className="text-3xl font-semibold">{nomeCompleto}</h1>
        <p className="text-sm text-muted-foreground">Nascimento: {dataFmt}</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        {principais.map((p) => {
          const i = interpretar(p.valor);
          return (
            <Card key={p.chave} className="p-5 space-y-2">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">{p.chave}</h2>
                <span className="text-4xl font-semibold text-primary">{p.valor}</span>
              </div>
              <p className="text-xs italic text-muted-foreground">{p.nota}</p>
              <div className="pt-2 border-t">
                <p className="font-medium text-sm">{i.titulo}</p>
                <p className="text-sm text-muted-foreground">{i.descricao}</p>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Card className="p-5 space-y-3">
          <h2 className="font-medium">Ciclos de Vida</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><p className="text-xs text-muted-foreground">1º ciclo</p><p className="text-2xl font-semibold">{mapa.ciclos.primeiro}</p></div>
            <div><p className="text-xs text-muted-foreground">2º ciclo</p><p className="text-2xl font-semibold">{mapa.ciclos.segundo}</p></div>
            <div><p className="text-xs text-muted-foreground">3º ciclo</p><p className="text-2xl font-semibold">{mapa.ciclos.terceiro}</p></div>
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h2 className="font-medium">Desafios</h2>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div><p className="text-xs text-muted-foreground">1º</p><p className="text-2xl font-semibold">{mapa.desafios.primeiro}</p></div>
            <div><p className="text-xs text-muted-foreground">2º</p><p className="text-2xl font-semibold">{mapa.desafios.segundo}</p></div>
            <div><p className="text-xs text-muted-foreground">Principal</p><p className="text-2xl font-semibold text-primary">{mapa.desafios.principal}</p></div>
            <div><p className="text-xs text-muted-foreground">Final</p><p className="text-2xl font-semibold">{mapa.desafios.ultimo}</p></div>
          </div>
        </Card>
      </section>

      <p className="text-xs text-muted-foreground text-center pt-4">
        Cálculos baseados na Numerologia Pitagórica. Interpretações resumidas — versão completa com cruzamentos terapêuticos em breve.
      </p>
    </div>
  );
}
