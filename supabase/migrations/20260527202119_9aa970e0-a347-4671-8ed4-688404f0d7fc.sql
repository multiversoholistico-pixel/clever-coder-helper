
-- Remover políticas abertas
DROP POLICY IF EXISTS "Acesso aberto contatos" ON public.contatos;
DROP POLICY IF EXISTS "Acesso aberto conteudos" ON public.conteudos;

-- Revogar acesso anônimo
REVOKE ALL ON public.contatos FROM anon;
REVOKE ALL ON public.conteudos FROM anon;

-- Contatos: somente autenticados
CREATE POLICY "Auth select contatos" ON public.contatos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert contatos" ON public.contatos
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth update contatos" ON public.contatos
  FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete contatos" ON public.contatos
  FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Conteudos: somente autenticados
CREATE POLICY "Auth select conteudos" ON public.conteudos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert conteudos" ON public.conteudos
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth update conteudos" ON public.conteudos
  FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete conteudos" ON public.conteudos
  FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
