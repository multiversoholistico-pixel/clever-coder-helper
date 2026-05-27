# Plano: Sinfonia dos Números — Webapp

## O que descobri no software original

- **Java desktop Swing** com SQLite embutido
- **89 classes / ~5.000 linhas** de lógica numerológica
- Banco com **17 categorias de interpretações** (~170 textos): essência, alma, aparência, destino, lição de vida, ciclos, desafios, pináculos, ano/mês/dia pessoal, dia natalício, números cármicos / de ausência / de excesso / poderosos, etc.
- Cadastro de **contatos** (nome, sobrenome, data nascimento, email, telefone)
- **Impressão PDF** via canvas Swing (pirâmide, triângulo, pináculo, desafio, assinatura, mapa resumo, trânsito de letras, temperamento)

## Direção escolhida pelo usuário

- **Reconstruir como webapp** (React + Lovable Cloud / Postgres no lugar do SQLite)
- Adicionar campo **gênero** (masculino / feminino / nome social) que afeta **somente textos e pronomes** — cálculos permanecem idênticos
- Melhorar textos e PDFs

## Fases (cada fase = 1 mensagem)

### Fase 1 — Fundação (esta)
- Ativar Lovable Cloud
- Criar esquema do banco: `contatos` (com campo `genero`), `conteudos` (textos interpretativos)
- Migrar os ~170 textos do SQLite original para o Postgres
- Portar o módulo de **cálculo** (`Calculos.java`) — tabela pitagórica de letras, redução numerológica, número da expressão, alma, aparência, destino, lição de vida — como TypeScript puro testável
- Layout base do app: lista de contatos + formulário de cadastro (com seletor de gênero)

### Fase 2 — Mapa numerológico completo
- Tela de mapa por contato exibindo todas as 17 categorias
- Renderização das interpretações com **pronomes corretos** segundo gênero (ele/ela/elu, "ela é", "ele é", concordâncias)
- Editor inline de textos (para você melhorar a redação direto na interface; salva em `conteudo_cust`)

### Fase 3 — Visuais (pirâmide, triângulo, pináculo, desafio, ciclos)
- Recriar os canvas de impressão como SVG React (mais nítido que o canvas Java original)

### Fase 4 — Exportação PDF
- Gerar PDF do mapa completo (server-side, alta qualidade, com os visuais SVG)
- Layout impresso reformulado (melhor tipografia que o original)

### Fase 5 — Refinamentos
- Busca, filtros, exportar/importar contatos
- Polimento de UI e responsividade

## Detalhes técnicos

- Stack: TanStack Start + React + Tailwind + shadcn (template atual)
- Backend: Lovable Cloud (Postgres + Auth opcional)
- Cálculos: módulo TS portado linha-a-linha do Java original, com testes unitários comparando contra valores conhecidos
- PDF: renderização server-side via React → HTML → PDF (preserva os SVGs)
- Pronomes: helper `pronomes(genero)` retorna objeto `{ele, dele, é}` interpolado nos textos por placeholders `{ele}`, `{dele}`, etc.

## O que faço agora (Fase 1)

1. Ativo Lovable Cloud
2. Crio migration com tabelas + seed dos 170 textos extraídos do SQLite original
3. Porto `Calculos.java` → `src/lib/numerologia/calculos.ts`
4. Telas: lista de contatos + cadastro com campo gênero
5. Tela placeholder de "mapa" mostrando os números calculados (interpretações vêm na Fase 2)

Confirma para eu começar a Fase 1?