// Motor completo de Numerologia Pitagórica — Numeria AI
// Implementa todos os itens do mapa modelo (Silmara Cezar):
// Mapa Resumido, Inclusão, Triângulo Divino, Alma, Aparência, Destino,
// Ausências, Excessos, Lição de Vida, Dia Natalício, Maturidade,
// Ano/Mês Pessoal, Essência, Desafios, Pináculos, Ciclos, Cármicos,
// Primeira Vogal, Plano de Temperamento, Anjo.

export const TABELA_PITAGORICA: Record<string, number> = {
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

export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z ]/g, "");
}

export function reduzir(n: number, preservarMestres = true): number {
  if (preservarMestres && (n === 11 || n === 22 || n === 33)) return n;
  while (n > 9) {
    const soma = String(n).split("").reduce((s, d) => s + Number(d), 0);
    if (preservarMestres && (soma === 11 || soma === 22 || soma === 33)) return soma;
    n = soma;
  }
  return n;
}

function somarDigitos(n: number): number {
  return String(n).split("").reduce((s, d) => s + Number(d), 0);
}

export function valoresLetras(palavra: string): { letra: string; valor: number; vogal: boolean }[] {
  return normalizar(palavra)
    .replace(/ /g, "")
    .split("")
    .map((l) => ({ letra: l, valor: TABELA_PITAGORICA[l] ?? 0, vogal: VOGAIS.has(l) }));
}

function somaParcial(palavra: string, filtro: (l: string) => boolean) {
  return valoresLetras(palavra)
    .filter((x) => filtro(x.letra))
    .reduce((s, x) => s + x.valor, 0);
}

/** Retorna soma total, primeira redução intermediária e número final reduzido. */
export function detalheReducao(n: number) {
  const passos: number[] = [n];
  let cur = n;
  while (cur > 9 && cur !== 11 && cur !== 22 && cur !== 33) {
    cur = somarDigitos(cur);
    passos.push(cur);
  }
  return { passos, final: cur };
}

// ============ Cálculos por nome ============

export function calcAlma(nomeCompleto: string) {
  const total = somaParcial(nomeCompleto, (l) => VOGAIS.has(l));
  return { total, ...detalheReducao(total) };
}
export function calcAparencia(nomeCompleto: string) {
  const total = somaParcial(nomeCompleto, (l) => !VOGAIS.has(l));
  return { total, ...detalheReducao(total) };
}
export function calcDestino(nomeCompleto: string) {
  const total = somaParcial(nomeCompleto, () => true);
  return { total, ...detalheReducao(total) };
}

// ============ Cálculos por data ============

export function calcLicaoDeVida(dataISO: string) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const total = dia + mes + somarDigitos(ano);
  return { total, ...detalheReducao(total), dia, mes, ano };
}

export function calcDiaNatalicio(dataISO: string) {
  const dia = Number(dataISO.split("-")[2]);
  return { dia, final: reduzir(dia) };
}

export function calcMaturidade(expressao: number, licaoVida: number) {
  const total = expressao + licaoVida;
  return { total, ...detalheReducao(total) };
}

export function calcAnoPessoal(dataISO: string, anoRef: number) {
  const [, mes, dia] = dataISO.split("-").map(Number);
  const total = reduzir(dia) + reduzir(mes) + reduzir(somarDigitos(anoRef));
  return { total, final: reduzir(total) };
}

export function calcMesPessoal(anoPessoal: number, mes: number) {
  return reduzir(anoPessoal + mes);
}

export function mesesPessoaisAnoAtual(dataISO: string, anoRef: number) {
  const ap = calcAnoPessoal(dataISO, anoRef).final;
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  return meses.map((nome, i) => ({ mes: nome, numero: i + 1, valor: calcMesPessoal(ap, i + 1) }));
}

export function calcDesafios(dataISO: string) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const m = reduzir(mes, false);
  const d = reduzir(dia, false);
  const a = reduzir(somarDigitos(ano), false);
  const d1 = Math.abs(m - d);
  const d2 = Math.abs(d - a);
  const d3 = Math.abs(d1 - d2);
  const d4 = Math.abs(m - a);
  return { primeiro: d1, segundo: d2, principal: d3, ultimo: d4 };
}

export function calcPinaculos(dataISO: string, licaoVida: number) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const m = reduzir(mes, false);
  const d = reduzir(dia, false);
  const a = reduzir(somarDigitos(ano), false);
  const p1 = reduzir(m + d);
  const p2 = reduzir(d + a);
  const p3 = reduzir(p1 + p2);
  const p4 = reduzir(m + a);
  const fim1 = 36 - licaoVida;
  return {
    pinaculos: [p1, p2, p3, p4],
    periodos: [
      `De 0 a ${fim1} anos`,
      `De ${fim1 + 1} a ${fim1 + 9} anos`,
      `De ${fim1 + 10} a ${fim1 + 18} anos`,
      `De ${fim1 + 19} anos em diante`,
    ],
  };
}

export function calcCiclos(dataISO: string, licaoVida: number) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const fim1 = 36 - licaoVida;
  return {
    formativo: { valor: reduzir(mes, false), periodo: `0 a ${fim1} anos` },
    produtivo: { valor: reduzir(dia, false), periodo: `${fim1 + 1} a ${fim1 + 27} anos` },
    colheita: { valor: reduzir(somarDigitos(ano), false), periodo: `${fim1 + 28} anos em diante` },
  };
}

// ============ Mapa de Inclusão ============

export function mapaInclusao(nomeCompleto: string) {
  const contagem: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const { valor } of valoresLetras(nomeCompleto)) {
    if (valor >= 1 && valor <= 9) contagem[valor]++;
  }
  const total = Object.values(contagem).reduce((s, n) => s + n, 0);
  const ausencias = Object.entries(contagem).filter(([, c]) => c === 0).map(([n]) => Number(n));
  // Excessos: aparições significativas (>= média + 1). Convencionalmente >=4 num nome médio.
  const media = total / 9;
  const excessos = Object.entries(contagem).filter(([, c]) => c >= Math.max(4, Math.ceil(media + 1))).map(([n]) => Number(n));
  return { contagem, total, ausencias, excessos };
}

// ============ Plano de Temperamento ============
// Físico: E, W, D, M; Emocional: B, I, O, R, S, T, X, Z (em algumas escolas: 2,3,6)
// Mental: A, H, J, G, L, N, P (1,8); Intuitivo: F, K, Q, U, V, Y (7,9)
// Adotamos a classificação clássica brasileira (Silmara Cezar):
// Físico: E, W (associadas a 5) + corpo; representado por número 4, 5
// Mantemos a versão simplificada por número:
// Físico: 1,8 ; Mental: 1,8 — para evitar duplicidade usamos categorias por LETRA.
const PLANO_LETRA: Record<string, "fisico" | "mental" | "emocional" | "intuitivo"> = {
  E: "fisico", W: "fisico", D: "fisico", M: "fisico",
  A: "mental", H: "mental", J: "mental", N: "mental", P: "mental", G: "mental", L: "mental",
  B: "emocional", I: "emocional", O: "emocional", R: "emocional", S: "emocional", T: "emocional", X: "emocional", Z: "emocional",
  C: "intuitivo", F: "intuitivo", K: "intuitivo", Q: "intuitivo", U: "intuitivo", V: "intuitivo", Y: "intuitivo",
};

export function planoTemperamento(nomeCompleto: string) {
  const c = { fisico: 0, mental: 0, emocional: 0, intuitivo: 0 };
  for (const { letra } of valoresLetras(nomeCompleto)) {
    const p = PLANO_LETRA[letra];
    if (p) c[p]++;
  }
  const total = c.fisico + c.mental + c.emocional + c.intuitivo;
  const ordenado = (Object.entries(c) as [keyof typeof c, number][]).sort((a, b) => b[1] - a[1]);
  return { ...c, total, predominante: ordenado[0][0], secundario: ordenado[1][0] };
}

// ============ Números Cármicos ============

export function numerosCarmicos(nomeCompleto: string, dataISO: string) {
  const carmicos = [13, 14, 16, 19];
  const presentes = new Set<number>();
  const checar = (n: number) => { if (carmicos.includes(n)) presentes.add(n); };
  const alma = calcAlma(nomeCompleto);
  const apa = calcAparencia(nomeCompleto);
  const des = calcDestino(nomeCompleto);
  const lv = calcLicaoDeVida(dataISO);
  [alma, apa, des, lv].forEach((x) => x.passos.forEach(checar));
  return [...presentes].sort();
}

// ============ Primeira Vogal ============
export function primeiraVogal(nomeCompleto: string) {
  for (const l of normalizar(nomeCompleto).replace(/ /g, "")) {
    if (VOGAIS.has(l)) return l;
  }
  return "";
}

// ============ Anjo Cabalístico (72 anjos) ============
const ANJOS = [
  "VEHUIAH","JELIEL","SITAEL","ELEMIAH","MAHASIAH","LELAHEL","ACHAIAH","CAHETHEL",
  "HAZIEL","ALADIAH","LAUVIAH","HAHAIAH","IEZALEL","MEBAHEL","HARIEL","HAKAMIAH",
  "LAUVIAH II","CALIEL","LEUVIAH","PAHALIAH","NELCHAEL","IEIAIEL","MELAHEL","HAHIUIAH",
  "NITH-HAIAH","HAAIAH","IERATHEL","SEHEIAH","REIYEL","OMAEL","LECABEL","VASARIAH",
  "IEHUIAH","LEHAHIAH","CHAVAKHIAH","MENADEL","ANIEL","HAAMIAH","REHAEL","IEIAZEL",
  "HAHAHEL","MIKAEL","VEUALIAH","IELAHIAH","SEALIAH","ARIEL","ASALIAH","MIHAEL",
  "VEHUEL","DANIEL","HAHASIAH","IMAMIAH","NANAEL","NITHAEL","MEBAHIAH","POIEL",
  "NEMAMIAH","IEIALEL","HARAHEL","MITZRAEL","UMABEL","IAH-HEL","ANAUEL","MEHIEL",
  "DAMABIAH","MANAKEL","EYAEL","HABUHIAH","ROCHEL","JABAMIAH","HAIAIEL","MUMIAH",
];

export function anjoGuardiao(dataISO: string) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  const d = new Date(Date.UTC(ano, mes - 1, dia));
  const inicio = Date.UTC(ano, 2, 21); // 21 de março
  let diff = Math.floor((d.getTime() - inicio) / 86400000);
  if (diff < 0) diff += 365;
  const idx = Math.floor(diff / (365 / 72)) % 72;
  return { nome: ANJOS[idx], numero: idx + 1 };
}

// ============ Triângulo Divino ============
// Vibrações de 9 anos (letras do primeiro nome) e 27 anos (sabedoria/juventude/poder/espírito)
export function trianguloDivino(primeiroNome: string) {
  const letras = valoresLetras(primeiroNome);
  const ciclos9 = letras.map((l, i) => ({
    letra: l.letra,
    valor: reduzir(l.valor),
    idadeInicio: i * 9,
    idadeFim: (i + 1) * 9,
  }));
  // 27 anos: somar grupos de 3 letras
  const ciclos27: { soma: number; valor: number; idadeInicio: number; idadeFim: number }[] = [];
  for (let i = 0; i < letras.length; i += 3) {
    const grupo = letras.slice(i, i + 3);
    const soma = grupo.reduce((s, x) => s + x.valor, 0);
    ciclos27.push({ soma, valor: reduzir(soma), idadeInicio: i * 9, idadeFim: (i + 3) * 9 });
  }
  return { ciclos9, ciclos27 };
}

// ============ Essência (letras em trânsito) ============
// Cada letra do nome vibra por sua duração (valor reduzido). Somam-se as letras
// ativas dos três nomes na idade atual.
export function essenciaAtual(nomeCompleto: string, idade: number) {
  const partes = normalizar(nomeCompleto).split(" ").filter(Boolean);
  let soma = 0;
  for (const parte of partes) {
    const letras = valoresLetras(parte);
    let pos = 0;
    for (const l of letras) {
      const dur = reduzir(l.valor);
      if (idade >= pos && idade < pos + dur) {
        soma += l.valor;
        break;
      }
      pos += dur;
    }
  }
  return reduzir(soma);
}

// ============ Resumo completo ============

export type MapaNumerologico = ReturnType<typeof calcularMapa>;

export function calcularMapa(nomeCompleto: string, dataNascimento: string, dataReferencia = new Date()) {
  const alma = calcAlma(nomeCompleto);
  const aparencia = calcAparencia(nomeCompleto);
  const destino = calcDestino(nomeCompleto);
  const licaoVida = calcLicaoDeVida(dataNascimento);
  const diaN = calcDiaNatalicio(dataNascimento);
  const maturidade = calcMaturidade(destino.final, licaoVida.final);
  const anoRef = dataReferencia.getFullYear();
  const anoP = calcAnoPessoal(dataNascimento, anoRef);
  const meses = mesesPessoaisAnoAtual(dataNascimento, anoRef);
  const desafios = calcDesafios(dataNascimento);
  const pinaculos = calcPinaculos(dataNascimento, licaoVida.final);
  const ciclos = calcCiclos(dataNascimento, licaoVida.final);
  const inclusao = mapaInclusao(nomeCompleto);
  const plano = planoTemperamento(nomeCompleto);
  const carmicos = numerosCarmicos(nomeCompleto, dataNascimento);
  const pVogal = primeiraVogal(nomeCompleto);
  const anjo = anjoGuardiao(dataNascimento);
  const partes = nomeCompleto.split(" ").filter(Boolean);
  const triangulo = trianguloDivino(partes[0] ?? "");
  const dataN = new Date(dataNascimento + "T00:00:00");
  const idade = Math.floor((dataReferencia.getTime() - dataN.getTime()) / (365.25 * 86400000));
  const essencia = essenciaAtual(nomeCompleto, idade);

  return {
    nomeCompleto, dataNascimento, idade, anoRef,
    alma, aparencia, destino, licaoVida, diaN, maturidade,
    anoP, meses, desafios, pinaculos, ciclos,
    inclusao, plano, carmicos, pVogal, anjo, triangulo, essencia,
  };
}

// ============ Interpretações ============

type Texto = { titulo: string; descricao: string };

const T = (titulo: string, descricao: string): Texto => ({ titulo, descricao });

export const INTERPRETACOES: Record<number, Texto> = {
  0: T("Vazio fértil", "Período sem desafio único e consistente; convite à introspecção e à fé nos próprios ideais."),
  1: T("Liderança e iniciativa", "Independência, pioneirismo, força de vontade. Necessidade de afirmar a própria identidade e abrir caminhos."),
  2: T("Cooperação e sensibilidade", "Diplomacia, parceria, intuição. Aprende através do equilíbrio entre dar e receber. Pede paciência e tato."),
  3: T("Expressão e criatividade", "Comunicação, alegria, talento artístico. A vida pede para criar e inspirar através da palavra."),
  4: T("Estrutura e trabalho", "Disciplina, organização, construção. Edifica bases sólidas através do esforço constante e da ordem."),
  5: T("Liberdade e mudança", "Versatilidade, aventura, transformação. Aprende através da experiência, do movimento e da curiosidade."),
  6: T("Amor e responsabilidade", "Família, cuidado, harmonia. Missão de servir, acolher e cuidar dos que ama; senso estético apurado."),
  7: T("Sabedoria e introspecção", "Análise, espiritualidade, mistério. Busca a verdade através do silêncio, do estudo e da meditação."),
  8: T("Poder e realização material", "Autoridade, gestão, abundância. Aprende a equilibrar poder, ética e prosperidade."),
  9: T("Humanitarismo e compaixão", "Generosidade, idealismo, encerramento de ciclos. Vive para servir a coletividade e inspirar."),
  11: T("Mestre intuitivo", "Inspiração, espiritualidade elevada, missão de iluminar. Sensibilidade fora do comum."),
  22: T("Mestre construtor", "Capacidade de materializar grandes visões a serviço da humanidade."),
  33: T("Mestre do amor incondicional", "Cura, compaixão e serviço amoroso elevados ao mais alto grau."),
};

export const TEXTO_ALMA: Record<number, string> = {
  1: "Alma que deseja independência, liderar e abrir seus próprios caminhos. Anseia por reconhecimento e originalidade.",
  2: "Alma que busca paz, parceria e sintonia emocional. Felicidade vem da companhia e da cooperação.",
  3: "Alma alegre, expressiva, que floresce na criatividade, na arte e no convívio social.",
  4: "Alma que deseja estabilidade, ordem e construir algo sólido e duradouro com as próprias mãos.",
  5: "Alma livre, que anseia por movimento, descobertas, novidades e variedade de experiências.",
  6: "Alma devotada ao amor, à família e ao cuidado. Realiza-se servindo e harmonizando o lar.",
  7: "Alma introspectiva, sábia, que ama o conhecimento e busca compreender os mistérios da vida.",
  8: "Alma que aspira poder, conquista material e autoridade. Realiza-se quando lidera com integridade.",
  9: "Alma universal, idealista, que se realiza ajudando o próximo e servindo causas maiores.",
  11: "Alma iluminada, mediúnica e idealista. Realiza-se inspirando outros pela sensibilidade espiritual.",
  22: "Alma construtora de grandes obras coletivas; quer transformar visões em realidade tangível.",
  33: "Alma de mestre do amor; serve, ensina e cura através do coração aberto.",
};

export const TEXTO_APARENCIA: Record<number, string> = {
  1: "Aparência forte, autônoma e determinada. Passa imagem de líder e pioneiro.",
  2: "Aparência suave, gentil e acolhedora. Transmite paz e disposição para ouvir.",
  3: "Aparência alegre, simpática, comunicativa, com brilho artístico.",
  4: "Aparência sóbria, responsável e confiável. Passa segurança e disciplina.",
  5: "Aparência dinâmica, jovem e versátil. Atrai pela curiosidade e leveza.",
  6: "Aparência acolhedora, maternal/paternal e harmoniosa; inspira confiança.",
  7: "Aparência reservada, intelectual, misteriosa. Causa impressão de profundidade.",
  8: "Aparência imponente, segura e profissional. Transmite autoridade e prosperidade.",
  9: "Aparência nobre, magnética e idealista. Inspira admiração e compaixão.",
  11: "Aparência sensível e luminosa; uma presença que toca pela vibração espiritual.",
  22: "Aparência sólida e visionária ao mesmo tempo; inspira grandes projetos.",
  33: "Aparência calorosa e generosa; presença que cura e acolhe.",
};

export const TEXTO_DESTINO: Record<number, string> = {
  1: "Destino de liderança, pioneirismo, conquistas pessoais e abertura de novos caminhos.",
  2: "Destino de cooperação, diplomacia e parceria; brilha em mediações e relacionamentos.",
  3: "Destino expressivo e artístico; comunicação, criatividade e alegria são as ferramentas.",
  4: "Destino de construção sólida; recompensa virá do trabalho metódico, organizado e diligente.",
  5: "Destino de mudanças, viagens e liberdade; aprende e ensina pela experiência.",
  6: "Destino de servir a família e a comunidade; harmonia, beleza e responsabilidade.",
  7: "Destino de estudo, pesquisa e espiritualidade; missão de buscar e compartilhar sabedoria.",
  8: "Destino de poder, gestão e prosperidade material; aprende a usar a autoridade com ética.",
  9: "Destino humanitário e universal; serve, ensina e encerra ciclos para abrir novos.",
  11: "Destino de inspiração espiritual; canaliza para iluminar e elevar consciências.",
  22: "Destino de realizar grandes obras de impacto coletivo e duradouro.",
  33: "Destino de mestre amoroso, dedicado à cura e ao serviço incondicional.",
};

export const TEXTO_LICAO: Record<number, string> = {
  1: "Aprender independência, coragem e iniciativa; tornar-se líder da própria vida.",
  2: "Aprender cooperação, paciência e a arte da diplomacia; equilibrar dar e receber.",
  3: "Aprender a expressar-se com alegria e autenticidade; cultivar a criatividade.",
  4: "Aprender disciplina, ordem e a construir bases sólidas com perseverança.",
  5: "Aprender a usar a liberdade com responsabilidade; abraçar a mudança sem dispersão.",
  6: "Aprender a amar, servir e cuidar sem se anular; cultivar harmonia e justiça.",
  7: "Aprender a confiar na intuição, aprofundar o conhecimento e a vida interior.",
  8: "Aprender a lidar com poder, dinheiro e autoridade de forma ética e construtiva.",
  9: "Aprender o desapego, a compaixão e a entrega ao bem maior.",
  11: "Aprender a sustentar a alta sensibilidade e canalizá-la para inspirar.",
  22: "Aprender a manifestar grandes visões com método e responsabilidade.",
  33: "Aprender a amar incondicionalmente e a servir como mestre compassivo.",
};

export const TEXTO_DIA: Record<number, string> = {
  1: "Talento natural de liderança, originalidade e autonomia.",
  2: "Talento natural para mediar, cooperar e perceber emoções.",
  3: "Talento natural para comunicar, criar e entreter.",
  4: "Talento natural para organizar, planejar e construir.",
  5: "Talento natural para se adaptar, viajar e comunicar mudanças.",
  6: "Talento natural para cuidar, harmonizar ambientes e aconselhar.",
  7: "Talento natural para analisar, pesquisar e compreender em profundidade.",
  8: "Talento natural para administrar, negociar e gerar resultados materiais.",
  9: "Talento natural para servir, ensinar e inspirar multidões.",
  11: "Intuição aguçada; talento para inspirar pela sensibilidade espiritual.",
  22: "Talento para realizar projetos grandiosos com base sólida.",
  33: "Talento para curar, ensinar e amar incondicionalmente.",
};

export const TEXTO_ANO: Record<number, string> = {
  1: "Ano de novos começos, iniciativa e ousadia. Plante hoje o que colherá nos próximos 9 anos.",
  2: "Ano de paciência, parcerias e cooperação. Cultive vínculos e seja diplomático.",
  3: "Ano de expressão, criatividade e vida social. Comunique, divulgue, mostre seu trabalho.",
  4: "Ano de trabalho, ordem e construção. Organize, planeje e estabeleça bases sólidas.",
  5: "Ano de mudanças, liberdade e movimento. Esteja aberto ao novo e a viagens.",
  6: "Ano de família, amor e responsabilidade. Foco no lar, em relacionamentos e harmonia.",
  7: "Ano de introspecção, estudo e espiritualidade. Aprofunde-se; evite negócios precipitados.",
  8: "Ano de poder, conquistas materiais e reconhecimento profissional. Pense alto, com pés no chão.",
  9: "Ano de encerramento de ciclos, desapego e serviço. Finalize o que precisa terminar.",
  11: "Ano de inspiração espiritual e missão; preste atenção em sinais e intuições.",
  22: "Ano para concretizar grandes visões; trabalho intenso com alto impacto.",
  33: "Ano de serviço amoroso e cura profunda em si e nos outros.",
};

export const TEXTO_MES: Record<number, string> = {
  1: "Nova fase. Tome decisões, parta para a ação, abra portas. Mês ativo e cheio de oportunidades.",
  2: "Mês de associações e parcerias. Aguarde o melhor momento; cuidado com sensibilidade à flor da pele.",
  3: "Vida social intensa, criatividade em alta. Ótimo para divulgar projetos e falar em público.",
  4: "Mês de planejamento, ordem e praticidade. Organize tarefas e cumpra prazos.",
  5: "Mudanças, viagens curtas, novos contatos. Magnetismo em alta — aproveite para apresentar projetos.",
  6: "Foco na família, lar e responsabilidades afetivas. Harmonize relacionamentos.",
  7: "Mês para aprimorar tarefas, estudar e meditar. Evite iniciar negócios precipitadamente.",
  8: "Mês de execução. Ótimas oportunidades comerciais. Pense grande, sem perder os pés do chão.",
  9: "Mês de encerramentos. Não tenha medo de soltar o que terminou. Evite iniciar coisas novas.",
};

export const TEXTO_DESAFIO: Record<number, string> = {
  0: "Desafio sutil; pede manter fé e foco nos próprios ideais e descobrir o ser interior.",
  1: "Desafio de afirmar a própria vontade sem ser autoritário; conquistar autoconfiança.",
  2: "Desafio de lidar com a sensibilidade; aprender a não se ferir com tudo e a se posicionar.",
  3: "Desafio de focar a criatividade; evitar dispersão e crítica excessiva.",
  4: "Desafio de aceitar ordem e rotina; aprender a trabalhar duro sem rigidez.",
  5: "Desafio do excesso e da impaciência; aprender a usar a liberdade com sabedoria.",
  6: "Desafio de equilibrar serviço e autocuidado; não se anular nem controlar os outros.",
  7: "Desafio do isolamento; aprender a confiar e dividir a vida interior.",
  8: "Desafio com dinheiro e poder; aprender a lidar com autoridade e prosperidade.",
  9: "Desafio do desapego e da decepção; aprender a soltar e a servir.",
};

export const TEXTO_PINACULO: Record<number, string> = {
  1: "Período que pede coragem, independência e força de vontade; conquistas pelo próprio esforço.",
  2: "Período de parcerias, sensibilidade e paciência; cresce-se pela cooperação.",
  3: "Período altamente criativo e social; auto-expressão e talentos artísticos em destaque.",
  4: "Período de trabalho árduo e muitas recompensas; bases duradouras se constroem.",
  5: "Período de mudanças rápidas, viagens e liberdade; muitas novidades e contatos.",
  6: "Período de responsabilidades familiares e afetivas; serviço, amor e harmonia em foco.",
  7: "Período de estudo, introspecção e crescimento interior; especialização e sabedoria.",
  8: "Período de poder, conquistas materiais e expansão profissional; cuidado com excessos.",
  9: "Período de encerramentos, serviço humanitário e desapego; preparação para novo ciclo.",
  11: "Período de inspiração espiritual elevada; missão de iluminar.",
  22: "Período para realizar grandes projetos coletivos.",
  33: "Período de serviço amoroso e cura profunda.",
};

export const TEXTO_CICLO: Record<string, Record<number, string>> = {
  formativo: {
    1: "Infância marcada por autonomia precoce; aprende cedo a contar consigo.",
    2: "Infância sensível, ligada à mãe ou parcerias; aprende cooperação.",
    3: "Infância alegre, criativa e social; expressão desde cedo.",
    4: "Infância com responsabilidades; aprende ordem e trabalho cedo.",
    5: "Infância cheia de mudanças, viagens, adaptações.",
    6: "Infância focada no lar, na família e nas responsabilidades afetivas.",
    7: "Infância introspectiva, estudiosa, solitária e observadora.",
    8: "Infância marcada por questões de poder, dinheiro ou autoridade na família.",
    9: "Infância marcada por sensibilidade ao sofrimento alheio e por idealismo.",
  },
  produtivo: {
    1: "Fase produtiva de afirmação e liderança; abrir caminhos próprios.",
    2: "Fase produtiva via parcerias, sociedades e cooperação.",
    3: "Fase produtiva criativa, comunicativa e social.",
    4: "Fase produtiva de trabalho intenso, construção e estabilidade.",
    5: "Fase produtiva de muitas mudanças, mobilidade e novos contatos.",
    6: "Fase produtiva voltada ao lar, à família e ao serviço afetivo.",
    7: "Fase produtiva de especialização, estudo e vida interior.",
    8: "Fase produtiva de poder, prosperidade material e gestão.",
    9: "Fase produtiva humanitária, com serviço a causas maiores.",
  },
  colheita: {
    1: "Colheita de autonomia, autoridade pessoal e reconhecimento.",
    2: "Colheita em parcerias, companheirismo e harmonia.",
    3: "Colheita em expressão artística, alegria e vida social.",
    4: "Colheita do trabalho — estabilidade e patrimônio sólido.",
    5: "Colheita em liberdade, viagens e novas vivências.",
    6: "Colheita em família, amor e harmonia conquistada.",
    7: "Colheita em sabedoria, reconhecimento intelectual e paz interior.",
    8: "Colheita em poder, prosperidade e influência consolidada.",
    9: "Colheita humanitária; admiração e gratidão da coletividade.",
  },
};

export const TEXTO_AUSENCIA: Record<number, string> = {
  1: "Precisa desenvolver iniciativa, autoconfiança e liderança.",
  2: "Precisa aprender a cooperar, ter paciência e equilibrar parcerias.",
  3: "Precisa cultivar a expressão criativa, soltar a comunicação e o entusiasmo.",
  4: "Precisa desenvolver ordem, disciplina e perseverança no trabalho.",
  5: "Precisa aprender a abraçar mudanças e a sair da zona de conforto.",
  6: "Precisa cultivar responsabilidade afetiva e cuidado com a família.",
  7: "Precisa aprofundar estudos e cultivar uma vida interior consistente.",
  8: "Precisa aprender a lidar com dinheiro, poder e autoridade.",
  9: "Precisa desenvolver compaixão, generosidade e visão coletiva.",
};

export const TEXTO_EXCESSO: Record<number, string> = {
  1: "Tendência ao excesso de autoritarismo e ego; precisa equilibrar com escuta.",
  2: "Tendência à dependência emocional e indecisão; precisa firmeza.",
  3: "Tendência à dispersão e superficialidade; precisa foco.",
  4: "Tendência à rigidez e workaholismo; precisa leveza.",
  5: "Tendência à inquietação e excessos sensoriais; precisa disciplina.",
  6: "Tendência ao controle afetivo e martírio; precisa autocuidado.",
  7: "Tendência ao isolamento e ceticismo; precisa abertura emocional.",
  8: "Tendência à ambição desmedida e materialismo; precisa ética.",
  9: "Tendência ao idealismo desligado da realidade; precisa praticidade.",
};

export const TEXTO_CARMICO: Record<number, string> = {
  13: "Carma do medo das mudanças e da transformação. Lição: trabalho material consciente, superando inércia e negatividade.",
  14: "Carma do excesso de liberdade mal usada em outras vidas. Lição: temperança, disciplina e moderação.",
  16: "Carma do orgulho e abuso afetivo. Lição: humildade, espiritualidade e respeito ao próximo.",
  19: "Carma do abuso de poder. Lição: usar a força e a autoridade a serviço do bem comum.",
};

export const TEXTO_VOGAL: Record<string, string> = {
  A: "Sempre se interessa por ideias novas, mas prefere as que vêm da própria mente. Defende seu ponto de vista, dificilmente se deixa dirigir.",
  E: "Reage com inquietude e necessidade de liberdade; busca o novo e a movimentação constante.",
  I: "Reage com sensibilidade, intuição e emoção; muito influenciado pelo ambiente.",
  O: "Reage com método, responsabilidade e cautela; pondera antes de agir.",
  U: "Reage com criatividade e generosidade; oscila entre entusiasmo e melancolia.",
  Y: "Reage com dualidade, intuição forte e necessidade de escolha entre dois caminhos.",
};

export const TEXTO_PLANO: Record<string, string> = {
  fisico: "Tendência à ação, ao concreto e ao corpo. Pratica mais do que teoriza; precisa cuidar do equilíbrio entre fazer e descansar.",
  mental: "Tendência ao raciocínio, à lógica e à análise. Vive das ideias; precisa colocar em prática o que pensa.",
  emocional: "Tendência aos sentimentos, à arte e aos relacionamentos. Age mais com o coração que com a mente.",
  intuitivo: "Tendência à percepção, à espiritualidade e ao abstrato. Busca respostas no silêncio e na meditação.",
};

export function interpretar(n: number): Texto {
  return INTERPRETACOES[n] ?? T(`Número ${n}`, "Sem interpretação cadastrada.");
}

export function txt(dic: Record<number, string>, n: number): string {
  return dic[n] ?? "Sem interpretação cadastrada para esse número.";
}
