
-- Add owner column to contatos and scope all policies to the owner
ALTER TABLE public.contatos ADD COLUMN IF NOT EXISTS user_id uuid;

UPDATE public.contatos SET user_id = '6e659e27-f585-4150-a9e6-5da070ffe0a5' WHERE user_id IS NULL;

ALTER TABLE public.contatos ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.contatos ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE INDEX IF NOT EXISTS idx_contatos_user_id ON public.contatos(user_id);

-- Replace permissive policies with owner-scoped ones
DROP POLICY IF EXISTS "Auth select contatos" ON public.contatos;
DROP POLICY IF EXISTS "Auth insert contatos" ON public.contatos;
DROP POLICY IF EXISTS "Auth update contatos" ON public.contatos;
DROP POLICY IF EXISTS "Auth delete contatos" ON public.contatos;

CREATE POLICY "Owner can select contatos"
  ON public.contatos FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owner can insert contatos"
  ON public.contatos FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update contatos"
  ON public.contatos FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can delete contatos"
  ON public.contatos FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- conteudos: shared reference data. Allow read for authenticated, restrict writes to service_role only.
DROP POLICY IF EXISTS "Auth insert conteudos" ON public.conteudos;
DROP POLICY IF EXISTS "Auth update conteudos" ON public.conteudos;
DROP POLICY IF EXISTS "Auth delete conteudos" ON public.conteudos;
-- SELECT policy for authenticated stays in place.
