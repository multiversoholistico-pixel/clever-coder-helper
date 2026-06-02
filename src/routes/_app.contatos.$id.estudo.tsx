import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import {
  calcularMapa, interpretar,
  TEXTO_ALMA, TEXTO_APARENCIA, TEXTO_DESTINO, TEXTO_LICAO, TEXTO_DIA,
  TEXTO_ANO, TEXTO_MES, TEXTO_DESAFIO, TEXTO_PINACULO, TEXTO_CICLO,
  TEXTO_AUSENCIA, TEXTO_EXCESSO, TEXTO_CARMICO, TEXTO_VOGAL, TEXTO_PLANO,
  valoresLetras, txt, type MapaNumerologico,
} from "@/lib/numerologia";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("contatos")
        .select("id, primeiro_nome, segundo_nome, sobrenome, data_nascimento, genero")
        .eq("id", id).single();
      if (error) { toast.error(error.message); setLoading(false); return; }
      setContato(data as Contato);
      setLoading(false);
    })();
  }, [id]);

  const nomeCompleto = useMemo(() => contato
    ? [contato.primeiro_nome, contato.segundo_nome, contato.sobrenome].filter(Boolean).join(" ")
    : "", [contato]);

  const mapa: MapaNumerologico | null = useMemo(() =>
    contato ? calcularMapa(nomeCompleto, contato.data_nascimento) : null,
    [contato, nomeCompleto]);

  if (loading) return <p className="text-muted-foreground">Calculando mapa…</p>;
  if (!contato || !mapa) return <p>Contato não encontrado.</p>;

  const dataFmt = new Date(contato.data_nascimento + "T00:00:00").toLocaleDateString("pt-BR");

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 -mx-2 px-2 py-2 bg-background/95 backdrop-blur border-b flex flex-wrap items-center justify-between gap-2 print:hidden">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/contatos"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Link>
        </Button>
        <Button size="default" onClick={() => window.print()} className="shadow-md">
          <Printer className="h-4 w-4 mr-2" /> Imprimir / Exportar PDF
        </Button>
      </div>

      <article className="mapa-impressao mx-auto max-w-[800px] bg-card text-card-foreground rounded-lg border print:border-0 print:rounded-none print:max-w-none">
        <Capa nome={nomeCompleto} data={dataFmt} />
        <Pagina><MapaResumido mapa={mapa} nome={nomeCompleto} /></Pagina>
        <Pagina><TrianguloDivino mapa={mapa} primeiroNome={contato.primeiro_nome} /></Pagina>
        <Pagina><Secao titulo="Alma (Idealidade)" numero={mapa.alma.final} calculo={`Vogais: total ${mapa.alma.total} → ${mapa.alma.passos.join(" → ")}`} texto={txt(TEXTO_ALMA, mapa.alma.final)} intro="O Número da Alma revela o desejo oculto, o que nos motiva e o EU que só você conhece." /></Pagina>
        <Pagina><Secao titulo="Aparência (Personalidade Exterior)" numero={mapa.aparencia.final} calculo={`Consoantes: total ${mapa.aparencia.total} → ${mapa.aparencia.passos.join(" → ")}`} texto={txt(TEXTO_APARENCIA, mapa.aparencia.final)} intro="Como o mundo te vê à primeira vista — a autoimagem que projeta e atrai." /></Pagina>
        <Pagina><Secao titulo="Destino (Expressão)" numero={mapa.destino.final} calculo={`Nome completo: total ${mapa.destino.total} → ${mapa.destino.passos.join(" → ")}`} texto={txt(TEXTO_DESTINO, mapa.destino.final)} intro="Revela seus talentos, habilidades potenciais e a forma como se manifesta no mundo." /></Pagina>
        <Pagina><AusenciasExcessos mapa={mapa} /></Pagina>
        <Pagina><Secao titulo="Lição de Vida" numero={mapa.licaoVida.final} calculo={`${mapa.licaoVida.dia} + ${mapa.licaoVida.mes} + ${mapa.licaoVida.ano} = ${mapa.licaoVida.total} → ${mapa.licaoVida.passos.join(" → ")}`} texto={txt(TEXTO_LICAO, mapa.licaoVida.final)} intro="A grande lição que veio aprender nesta encarnação. Importante na escolha da carreira." /></Pagina>
        <Pagina><Secao titulo={`Dia Natalício — ${mapa.diaN.dia}`} numero={mapa.diaN.final} calculo={`Dia: ${mapa.diaN.dia} → ${mapa.diaN.final}`} texto={txt(TEXTO_DIA, mapa.diaN.final)} intro="O dia de nascimento indica o talento interior oculto." /></Pagina>
        <Pagina><Secao titulo="Número Poderoso (Maturidade)" numero={mapa.maturidade.final} calculo={`Destino ${mapa.destino.final} + Lição ${mapa.licaoVida.final} = ${mapa.maturidade.total} → ${mapa.maturidade.passos.join(" → ")}`} texto={txt(TEXTO_LICAO, mapa.maturidade.final)} intro="Farol que guia a maturidade; chave para uma velhice plenamente ativa." /></Pagina>
        <Pagina><AnoPessoal mapa={mapa} /></Pagina>
        <Pagina><Essencia mapa={mapa} /></Pagina>
        <Pagina><Desafios mapa={mapa} /></Pagina>
        <Pagina><Pinaculos mapa={mapa} /></Pagina>
        <Pagina><Ciclos mapa={mapa} /></Pagina>
        <Pagina><Carmicos mapa={mapa} /></Pagina>
        <Pagina><PrimeiraVogalSec mapa={mapa} /></Pagina>
        <Pagina><PlanoTemperamento mapa={mapa} /></Pagina>
        <Pagina><MesesPessoais mapa={mapa} /></Pagina>
        <Pagina><Anjo mapa={mapa} /></Pagina>
      </article>

      <div className="flex justify-center print:hidden">
        <Button size="lg" onClick={() => window.print()} className="shadow-md">
          <Printer className="h-4 w-4 mr-2" /> Imprimir / Exportar PDF
        </Button>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 18mm; }
          body { background: white !important; }
          .mapa-impressao { box-shadow: none !important; }
        }
        .pagina-mapa { padding: 28px 32px; }
        .pagina-mapa + .pagina-mapa { border-top: 1px solid hsl(var(--border)); }
        @media print {
          .pagina-mapa { page-break-after: always; padding: 0 0 24px 0; }
          .pagina-mapa + .pagina-mapa { border-top: none; padding-top: 0; }
        }
      `}</style>
    </div>
  );
}

// ------------ subcomponentes ------------

function Pagina({ children }: { children: React.ReactNode }) {
  return <section className="pagina-mapa">{children}</section>;
}

function Capa({ nome, data }: { nome: string; data: string }) {
  return (
    <section className="pagina-mapa text-center" style={{ minHeight: 420 }}>
      <h1 className="text-4xl font-serif tracking-tight mt-12">Mapa Numerológico</h1>
      <div className="my-16 text-5xl">🌳</div>
      <p className="text-2xl font-medium">{nome}</p>
      <p className="text-muted-foreground mt-1">{data}</p>
      <p className="mt-16 text-sm text-muted-foreground italic">Numerologia Pitagórica</p>
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-serif border-b pb-1 mb-4">{children}</h2>;
}

function Secao({ titulo, numero, calculo, texto, intro }: { titulo: string; numero: number; calculo: string; texto: string; intro?: string }) {
  const i = interpretar(numero);
  return (
    <>
      <H2>{titulo}</H2>
      {intro && <p className="text-sm text-muted-foreground italic mb-3">{intro}</p>}
      <div className="flex items-baseline gap-4 mb-3">
        <span className="text-6xl font-semibold text-primary">{numero}</span>
        <div>
          <p className="font-medium">{i.titulo}</p>
          <p className="text-xs text-muted-foreground">{calculo}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed">{texto}</p>
    </>
  );
}

function MapaResumido({ mapa, nome }: { mapa: MapaNumerologico; nome: string }) {
  const partes = nome.split(" ").filter(Boolean);
  const calcParte = (p: string) => ({
    nome: p.toUpperCase(),
    alma: somaParcial(p, true),
    aparencia: somaParcial(p, false),
    destino: somaParcial(p, null),
  });
  const linhas = partes.map(calcParte);
  return (
    <>
      <H2>Mapa Resumido</H2>
      <p className="text-sm mb-1"><strong>{nome}</strong> — {new Date(mapa.dataNascimento + "T00:00:00").toLocaleDateString("pt-BR")} — {mapa.idade} anos</p>
      <table className="w-full text-sm border-collapse my-3">
        <thead className="bg-muted">
          <tr>
            <th className="border px-2 py-1 text-left"></th>
            {linhas.map((l) => <th key={l.nome} className="border px-2 py-1">{l.nome}</th>)}
            <th className="border px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          <Linha label="Idealidade (Alma)" valores={linhas.map((l) => l.alma)} total={mapa.alma} />
          <Linha label="Aparência" valores={linhas.map((l) => l.aparencia)} total={mapa.aparencia} />
          <Linha label="Destino" valores={linhas.map((l) => l.destino)} total={mapa.destino} />
        </tbody>
      </table>
      <p className="text-sm">Quantidade de letras: <strong>{mapa.inclusao.total}</strong></p>
      <p className="text-sm">Idade atual: <strong>{mapa.idade} anos</strong></p>

      <h3 className="font-medium mt-6 mb-2">Mapa de Inclusão</h3>
      <table className="w-full text-sm border-collapse">
        <thead className="bg-muted"><tr>{[1,2,3,4,5,6,7,8,9].map((n) => <th key={n} className="border px-2 py-1">{n}</th>)}</tr></thead>
        <tbody><tr>{[1,2,3,4,5,6,7,8,9].map((n) => <td key={n} className="border px-2 py-1 text-center">{mapa.inclusao.contagem[n] || "—"}</td>)}</tr></tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-2">Ausências: {mapa.inclusao.ausencias.join(", ") || "nenhuma"} · Excessos: {mapa.inclusao.excessos.join(", ") || "nenhum"}</p>
    </>
  );
}

function Linha({ label, valores, total }: { label: string; valores: number[]; total: { total: number; passos: number[]; final: number } }) {
  return (
    <tr>
      <td className="border px-2 py-1 font-medium">{label}</td>
      {valores.map((v, i) => <td key={i} className="border px-2 py-1 text-center">{v}</td>)}
      <td className="border px-2 py-1 text-center font-semibold">{total.total} / {total.passos.slice(1).join(" / ") || total.final}</td>
    </tr>
  );
}

function somaParcial(palavra: string, vogal: boolean | null) {
  return valoresLetras(palavra).filter((x) => vogal === null ? true : (vogal ? x.vogal : !x.vogal)).reduce((s, x) => s + x.valor, 0);
}

function TrianguloDivino({ mapa, primeiroNome }: { mapa: MapaNumerologico; primeiroNome: string }) {
  return (
    <>
      <H2>Triângulo Divino</H2>
      <p className="text-sm text-muted-foreground italic mb-3">Vibrações do primeiro nome — letras (9 anos) e grupos (27 anos).</p>
      <p className="text-sm mb-2"><strong>Primeiro nome:</strong> {primeiroNome.toUpperCase()}</p>
      <h3 className="font-medium mt-3 mb-1">Ciclos de 9 anos (letras)</h3>
      <table className="w-full text-sm border-collapse">
        <thead className="bg-muted"><tr><th className="border px-2 py-1">Letra</th><th className="border px-2 py-1">Valor</th><th className="border px-2 py-1">Período</th></tr></thead>
        <tbody>
          {mapa.triangulo.ciclos9.map((c, i) => (
            <tr key={i}><td className="border px-2 py-1 text-center font-medium">{c.letra}</td><td className="border px-2 py-1 text-center">{c.valor}</td><td className="border px-2 py-1 text-center">{c.idadeInicio} – {c.idadeFim} anos</td></tr>
          ))}
        </tbody>
      </table>
      <h3 className="font-medium mt-4 mb-1">Ciclos de 27 anos</h3>
      <table className="w-full text-sm border-collapse">
        <thead className="bg-muted"><tr><th className="border px-2 py-1">Grupo</th><th className="border px-2 py-1">Soma</th><th className="border px-2 py-1">Reduz</th><th className="border px-2 py-1">Período</th></tr></thead>
        <tbody>
          {mapa.triangulo.ciclos27.map((c, i) => (
            <tr key={i}><td className="border px-2 py-1 text-center">{["Juventude","Sabedoria","Poder","Espírito"][i] ?? `Grupo ${i+1}`}</td><td className="border px-2 py-1 text-center">{c.soma}</td><td className="border px-2 py-1 text-center font-semibold">{c.valor}</td><td className="border px-2 py-1 text-center">{c.idadeInicio} – {c.idadeFim} anos</td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function AusenciasExcessos({ mapa }: { mapa: MapaNumerologico }) {
  return (
    <>
      <H2>Ausências e Excessos</H2>
      <p className="text-sm text-muted-foreground italic mb-3">Os números que faltam apontam lições; os em excesso indicam talentos a equilibrar.</p>
      <h3 className="font-medium mt-2">Ausências</h3>
      {mapa.inclusao.ausencias.length === 0 ? <p className="text-sm">Nenhuma ausência — todos os números estão representados.</p> : (
        <ul className="text-sm list-disc ml-5 space-y-1 mt-1">
          {mapa.inclusao.ausencias.map((n) => <li key={n}><strong>Ausência de {n}:</strong> {txt(TEXTO_AUSENCIA, n)}</li>)}
        </ul>
      )}
      <h3 className="font-medium mt-4">Excessos</h3>
      {mapa.inclusao.excessos.length === 0 ? <p className="text-sm">Nenhum excesso significativo.</p> : (
        <ul className="text-sm list-disc ml-5 space-y-1 mt-1">
          {mapa.inclusao.excessos.map((n) => <li key={n}><strong>Excesso de {n}:</strong> {txt(TEXTO_EXCESSO, n)}</li>)}
        </ul>
      )}
    </>
  );
}

function AnoPessoal({ mapa }: { mapa: MapaNumerologico }) {
  return <Secao titulo={`Ano Pessoal ${mapa.anoRef}`} numero={mapa.anoP.final}
    calculo={`Dia + Mês + Ano (${mapa.anoRef}) reduzido = ${mapa.anoP.total} → ${mapa.anoP.final}`}
    texto={txt(TEXTO_ANO, mapa.anoP.final)}
    intro="Energia que rege o ciclo entre seu último e seu próximo aniversário." />;
}

function Essencia({ mapa }: { mapa: MapaNumerologico }) {
  return <Secao titulo="Essência (Letras em Trânsito)" numero={mapa.essencia}
    calculo={`Letras ativas aos ${mapa.idade} anos`}
    texto={txt(TEXTO_ANO, mapa.essencia)}
    intro="As lições com que estará lidando neste ciclo; soma das letras ativas dos três nomes na idade atual." />;
}

function Desafios({ mapa }: { mapa: MapaNumerologico }) {
  return (
    <>
      <H2>Desafios</H2>
      <p className="text-sm text-muted-foreground italic mb-3">Provas a vencer em cada fase da vida.</p>
      <ul className="space-y-3 text-sm">
        <li><strong>1º Desafio (juventude) — nº {mapa.desafios.primeiro}:</strong> {txt(TEXTO_DESAFIO, mapa.desafios.primeiro)}</li>
        <li><strong>2º Desafio (adulto jovem) — nº {mapa.desafios.segundo}:</strong> {txt(TEXTO_DESAFIO, mapa.desafios.segundo)}</li>
        <li><strong>Desafio Principal — nº {mapa.desafios.principal}:</strong> {txt(TEXTO_DESAFIO, mapa.desafios.principal)}</li>
        <li><strong>4º Desafio (maturidade) — nº {mapa.desafios.ultimo}:</strong> {txt(TEXTO_DESAFIO, mapa.desafios.ultimo)}</li>
      </ul>
    </>
  );
}

function Pinaculos({ mapa }: { mapa: MapaNumerologico }) {
  return (
    <>
      <H2>Pináculos</H2>
      <p className="text-sm text-muted-foreground italic mb-3">Períodos de oportunidades e transformações ao longo da vida.</p>
      <div className="space-y-4 text-sm">
        {mapa.pinaculos.pinaculos.map((p, i) => (
          <div key={i}>
            <p className="font-medium">{["1º","2º","3º","4º"][i]} Pináculo — {mapa.pinaculos.periodos[i]} — nº {p}</p>
            <p>{txt(TEXTO_PINACULO, p)}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Ciclos({ mapa }: { mapa: MapaNumerologico }) {
  return (
    <>
      <H2>Ciclos de Vida</H2>
      <p className="text-sm text-muted-foreground italic mb-3">Formativo, Produtivo e Colheita.</p>
      <div className="space-y-4 text-sm">
        <div><p className="font-medium">Formativo {mapa.ciclos.formativo.valor} — {mapa.ciclos.formativo.periodo}</p><p>{TEXTO_CICLO.formativo[mapa.ciclos.formativo.valor]}</p></div>
        <div><p className="font-medium">Produtivo {mapa.ciclos.produtivo.valor} — {mapa.ciclos.produtivo.periodo}</p><p>{TEXTO_CICLO.produtivo[mapa.ciclos.produtivo.valor]}</p></div>
        <div><p className="font-medium">Colheita {mapa.ciclos.colheita.valor} — {mapa.ciclos.colheita.periodo}</p><p>{TEXTO_CICLO.colheita[mapa.ciclos.colheita.valor]}</p></div>
      </div>
    </>
  );
}

function Carmicos({ mapa }: { mapa: MapaNumerologico }) {
  return (
    <>
      <H2>Números Cármicos</H2>
      <p className="text-sm text-muted-foreground italic mb-3">Dívidas de vidas passadas a serem reequilibradas.</p>
      {mapa.carmicos.length === 0 ? <p className="text-sm">Nenhum número cármico identificado nos cálculos principais.</p> : (
        <ul className="space-y-2 text-sm">
          {mapa.carmicos.map((n) => <li key={n}><strong>Cármico {n}:</strong> {txt(TEXTO_CARMICO, n)}</li>)}
        </ul>
      )}
    </>
  );
}

function PrimeiraVogalSec({ mapa }: { mapa: MapaNumerologico }) {
  return (
    <>
      <H2>Primeira Vogal — {mapa.pVogal || "—"}</H2>
      <p className="text-sm text-muted-foreground italic mb-3">Como reage instintivamente a estímulos externos.</p>
      <p className="text-sm">{TEXTO_VOGAL[mapa.pVogal] ?? "Sem interpretação cadastrada."}</p>
    </>
  );
}

function PlanoTemperamento({ mapa }: { mapa: MapaNumerologico }) {
  const labels: Record<string, string> = { fisico: "Físico", mental: "Mental", emocional: "Emocional", intuitivo: "Intuitivo" };
  return (
    <>
      <H2>Plano de Temperamento</H2>
      <p className="text-sm text-muted-foreground italic mb-3">Distribuição das letras do nome pelos quatro planos.</p>
      <table className="w-full text-sm border-collapse mb-3">
        <thead className="bg-muted"><tr><th className="border px-2 py-1">Físico</th><th className="border px-2 py-1">Mental</th><th className="border px-2 py-1">Emocional</th><th className="border px-2 py-1">Intuitivo</th></tr></thead>
        <tbody><tr><td className="border px-2 py-1 text-center">{mapa.plano.fisico}</td><td className="border px-2 py-1 text-center">{mapa.plano.mental}</td><td className="border px-2 py-1 text-center">{mapa.plano.emocional}</td><td className="border px-2 py-1 text-center">{mapa.plano.intuitivo}</td></tr></tbody>
      </table>
      <p className="text-sm"><strong>Predominante — {labels[mapa.plano.predominante]}:</strong> {TEXTO_PLANO[mapa.plano.predominante]}</p>
      <p className="text-sm mt-2"><strong>Secundário — {labels[mapa.plano.secundario]}:</strong> {TEXTO_PLANO[mapa.plano.secundario]}</p>
    </>
  );
}

function MesesPessoais({ mapa }: { mapa: MapaNumerologico }) {
  return (
    <>
      <H2>Meses Pessoais — {mapa.anoRef}</H2>
      <p className="text-sm text-muted-foreground italic mb-3">Energia regente de cada mês deste ano.</p>
      <div className="space-y-3 text-sm">
        {mapa.meses.map((m) => (
          <div key={m.mes}><p className="font-medium">{m.mes} — Mês Pessoal {m.valor}</p><p>{txt(TEXTO_MES, m.valor)}</p></div>
        ))}
      </div>
    </>
  );
}

function Anjo({ mapa }: { mapa: MapaNumerologico }) {
  return (
    <>
      <H2>Anjo da Guarda Cabalístico</H2>
      <p className="text-sm text-muted-foreground italic mb-3">Calculado a partir da data de nascimento.</p>
      <p className="text-sm"><strong>Anjo:</strong> {mapa.anjo.nome} (nº {mapa.anjo.numero} entre os 72 gênios da Cabala)</p>
      <p className="text-sm mt-2 text-muted-foreground">Consulte um oráculo cabalístico tradicional para o salmo, horário, planeta, cor, vela, incenso, planta, metal e pedra associados.</p>
    </>
  );
}
