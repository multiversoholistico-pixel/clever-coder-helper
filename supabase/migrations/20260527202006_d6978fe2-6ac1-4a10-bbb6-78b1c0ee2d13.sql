
-- Tabela de contatos
CREATE TABLE public.contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primeiro_nome TEXT NOT NULL,
  segundo_nome TEXT,
  sobrenome TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  email TEXT,
  telefone TEXT,
  genero TEXT NOT NULL DEFAULT 'feminino' CHECK (genero IN ('masculino','feminino','nome_social')),
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de textos interpretativos (originais + customizados pelo usuário)
CREATE TABLE public.conteudos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL,
  numero_tipo INTEGER NOT NULL,
  texto_original TEXT NOT NULL,
  texto_masculino TEXT,
  texto_feminino TEXT,
  texto_social TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tipo, numero_tipo)
);

CREATE INDEX idx_conteudos_lookup ON public.conteudos(tipo, numero_tipo);
CREATE INDEX idx_contatos_nome ON public.contatos(primeiro_nome, sobrenome);

-- Grants (app público, sem auth nesta fase — single-user local-style)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contatos TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conteudos TO anon, authenticated;
GRANT ALL ON public.contatos TO service_role;
GRANT ALL ON public.conteudos TO service_role;

ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conteudos ENABLE ROW LEVEL SECURITY;

-- Acesso aberto nesta fase (app desktop-style single user). Auth multi-usuário virá em fase futura se desejado.
CREATE POLICY "Acesso aberto contatos" ON public.contatos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acesso aberto conteudos" ON public.conteudos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Trigger de updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_contatos_updated BEFORE UPDATE ON public.contatos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_conteudos_updated BEFORE UPDATE ON public.conteudos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
