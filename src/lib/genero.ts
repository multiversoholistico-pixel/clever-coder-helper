// Adapta textos do estudo ao gênero/tratamento da pessoa. Nunca altera cálculos.
export type Genero = "feminino" | "masculino" | "neutro";
export type Perfil = { genero: Genero; nome: string };

// Palavras masculinas usadas nos textos → forma feminina
const FEM: Record<string, string> = {
  amoroso: "amorosa", organizado: "organizada", dedicado: "dedicada", criativo: "criativa",
  autoritário: "autoritária", seguro: "segura", generoso: "generosa", ansioso: "ansiosa",
  cauteloso: "cautelosa", disciplinado: "disciplinada", ambicioso: "ambiciosa", carinhoso: "carinhosa",
  nervoso: "nervosa", teimoso: "teimosa", rígido: "rígida", apegado: "apegada", sozinho: "sozinha",
  ciumento: "ciumenta", desconfiado: "desconfiada", inquieto: "inquieta", reservado: "reservada",
  solitário: "solitária", isolado: "isolada", preocupado: "preocupada", tímido: "tímida",
  introvertido: "introvertida", honesto: "honesta", corajoso: "corajosa", ousado: "ousada",
  dominador: "dominadora", preguiçoso: "preguiçosa", ele: "ela", dele: "dela", amigo: "amiga",
  "um líder": "uma líder", "o líder": "a líder", nativo: "nativa",
};
// Neutro: linguagem inclusiva com "pessoa"/forma neutra simples
const NEU: Record<string, string> = { ele: "essa pessoa", dele: "dessa pessoa", "um líder": "uma liderança", "o líder": "a liderança", nativo: "pessoa nativa" };

function aplicar(texto: string, dic: Record<string, string>) {
  let out = texto;
  for (const [m, f] of Object.entries(dic).sort((a, b) => b[0].length - a[0].length)) {
    const re = new RegExp(`(^|[^\\p{L}])(${m})(s?)(?=[^\\p{L}]|$)`, "giu");
    out = out.replace(re, (_x, pre: string, w: string, pl: string) => {
      const r = w[0] === w[0].toUpperCase() ? f[0].toUpperCase() + f.slice(1) : f;
      return pre + r + pl;
    });
  }
  return out;
}

export function adaptarTexto(texto: string, p: Perfil): string {
  if (!texto) return texto;
  let t = texto.replace(/\{nome\}/g, p.nome);
  // marcadores opcionais: {o|a|e} escolhem a forma por gênero
  t = t.replace(/\{([^|{}]*)\|([^|{}]*)(?:\|([^|{}]*))?\}/g, (_m, mas, fem, neu) =>
    p.genero === "feminino" ? fem : p.genero === "neutro" ? (neu ?? `${mas}/${fem}`) : mas);
  t = t.replace(/(\p{L}+)\(a\)/gu, (_m, w: string) =>
    p.genero === "feminino" ? w.replace(/o$/, "a") : p.genero === "neutro" ? `${w}(a)` : w);
  if (p.genero === "feminino") t = aplicar(t, FEM);
  else if (p.genero === "neutro") t = aplicar(t, NEU);
  return t;
}

export function saudacao(p: Perfil) {
  return p.genero === "feminino" ? `Querida ${p.nome}` : p.genero === "masculino" ? `Querido ${p.nome}` : `Olá, ${p.nome}`;
}
