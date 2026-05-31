// Motor de Numerologia Pitagórica — Numeria AI

const TABELA_PITAGORICA: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

const VOGAIS = new Set(["A", "E", "I", "O", "U", "Y"]);

/** Remove acentos e normaliza para A-Z maiúsculo. */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

/** Reduz a um dígito, preservando números mestres 11, 22 e 33. */
export function reduzir(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) {
    const soma = String(n).split("").reduce((s, d) => s + Number(d), 0);
    if (soma === 11 || soma === 22 || soma === 33) return soma;
    n = soma;
  }
  return n;
}

function somarLetras(texto: string, filtro: (letra: string) => boolean): number {
  const limpo = normalizar(texto);
  let total = 0;
  for (const letra of limpo) {
    if (filtro(letra)) total += TABELA_PITAGORICA[letra] ?? 0;
  }
  return total;
}

export function numeroExpressao(nomeCompleto: string): number {
  return reduzir(somarLetras(nomeCompleto, () => true));
}

export function numeroAlma(nomeCompleto: string): number {
  return reduzir(somarLetras(nomeCompleto, (l) => VOGAIS.has(l)));
}

export function numeroPersonalidade(nomeCompleto: string): number {
  return reduzir(somarLetras(nomeCompleto, (l) => !VOGAIS.has(l)));
}

function somarDigitos(n: number): number {
  return String(n).split("").reduce((s, d) => s + Number(d), 0);
}

/** Caminho de vida: soma reduzida da data completa. */
export function caminhoDeVida(dataISO: string): number {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const rDia = reduzir(dia);
  const rMes = reduzir(mes);
  const rAno = reduzir(somarDigitos(ano));
  return reduzir(rDia + rMes + rAno);
}

export function diaNascimento(dataISO: string): number {
  const dia = Number(dataISO.split("-")[2]);
  return reduzir(dia);
}

/** Ano pessoal para o ano de referência. */
export function anoPessoal(dataISO: string, anoRef: number = new Date().getFullYear()): number {
  const [, mes, dia] = dataISO.split("-").map(Number);
  return reduzir(reduzir(dia) + reduzir(mes) + reduzir(somarDigitos(anoRef)));
}

export function ciclosDeVida(dataISO: string) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  return {
    primeiro: reduzir(mes),
    segundo: reduzir(dia),
    terceiro: reduzir(somarDigitos(ano)),
  };
}

export function desafios(dataISO: string) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const m = reduzir(mes);
  const d = reduzir(dia);
  const a = reduzir(somarDigitos(ano));
  const d1 = Math.abs(m - d);
  const d2 = Math.abs(d - a);
  const dPrincipal = Math.abs(d1 - d2);
  const d3 = Math.abs(m - a);
  return { primeiro: d1, segundo: d2, principal: dPrincipal, ultimo: d3 };
}

export type MapaNumerologico = {
  expressao: number;
  alma: number;
  personalidade: number;
  caminhoDeVida: number;
  diaNascimento: number;
  anoPessoal: number;
  ciclos: ReturnType<typeof ciclosDeVida>;
  desafios: ReturnType<typeof desafios>;
};

export function calcularMapa(nomeCompleto: string, dataNascimento: string): MapaNumerologico {
  return {
    expressao: numeroExpressao(nomeCompleto),
    alma: numeroAlma(nomeCompleto),
    personalidade: numeroPersonalidade(nomeCompleto),
    caminhoDeVida: caminhoDeVida(dataNascimento),
    diaNascimento: diaNascimento(dataNascimento),
    anoPessoal: anoPessoal(dataNascimento),
    ciclos: ciclosDeVida(dataNascimento),
    desafios: desafios(dataNascimento),
  };
}

/** Interpretações pitagóricas resumidas por número. */
export const INTERPRETACOES: Record<number, { titulo: string; descricao: string }> = {
  1: { titulo: "Liderança e Iniciativa", descricao: "Independência, pioneirismo, força de vontade. Necessidade de afirmar a própria identidade e abrir caminhos." },
  2: { titulo: "Cooperação e Sensibilidade", descricao: "Diplomacia, parceria, intuição. Aprende através do equilíbrio entre dar e receber." },
  3: { titulo: "Expressão e Criatividade", descricao: "Comunicação, alegria, talento artístico. A vida pede para criar e inspirar através da palavra." },
  4: { titulo: "Estrutura e Trabalho", descricao: "Disciplina, organização, construção. Edifica bases sólidas através do esforço constante." },
  5: { titulo: "Liberdade e Mudança", descricao: "Versatilidade, aventura, transformação. Aprende através da experiência e do movimento." },
  6: { titulo: "Amor e Responsabilidade", descricao: "Família, cuidado, harmonia. Missão de servir e cuidar dos que ama." },
  7: { titulo: "Sabedoria e Introspecção", descricao: "Análise, espiritualidade, mistério. Busca a verdade através do silêncio e do estudo." },
  8: { titulo: "Poder e Realização Material", descricao: "Autoridade, gestão, abundância. Aprende a equilibrar poder, ética e prosperidade." },
  9: { titulo: "Humanitarismo e Compaixão", descricao: "Generosidade, idealismo, encerramento de ciclos. Vive para servir a coletividade." },
  11: { titulo: "Mestre Intuitivo", descricao: "Número mestre. Inspiração, espiritualidade elevada, missão de iluminar. Sensibilidade fora do comum." },
  22: { titulo: "Mestre Construtor", descricao: "Número mestre. Capacidade de materializar grandes visões a serviço da humanidade." },
  33: { titulo: "Mestre do Amor Incondicional", descricao: "Número mestre. Cura, compaixão e serviço amoroso elevado ao mais alto grau." },
};

export function interpretar(n: number) {
  return INTERPRETACOES[n] ?? { titulo: `Número ${n}`, descricao: "Sem interpretação cadastrada." };
}
