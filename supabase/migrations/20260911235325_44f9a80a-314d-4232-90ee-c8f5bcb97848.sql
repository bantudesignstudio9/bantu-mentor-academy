CREATE TABLE public.programas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  nome text NOT NULL,
  descricao text,
  cor text NOT NULL DEFAULT 'teal',
  activo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.programas TO anon, authenticated;
GRANT ALL ON public.programas TO service_role;
ALTER TABLE public.programas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "acesso aberto programas" ON public.programas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.cursos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  programa_id uuid NOT NULL REFERENCES public.programas(id) ON DELETE CASCADE,
  nome text NOT NULL,
  nivel text,
  propina_padrao numeric NOT NULL DEFAULT 0,
  activo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cursos TO anon, authenticated;
GRANT ALL ON public.cursos TO service_role;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "acesso aberto cursos" ON public.cursos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_programas_updated_at BEFORE UPDATE ON public.programas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cursos_updated_at BEFORE UPDATE ON public.cursos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.alunos
  ADD COLUMN programa_id uuid REFERENCES public.programas(id) ON DELETE SET NULL,
  ADD COLUMN curso_id uuid REFERENCES public.cursos(id) ON DELETE SET NULL,
  ADD COLUMN nivel text;

INSERT INTO public.programas (id, nome, descricao, cor, ordem) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Your Voice Matters', 'Programa de cursos de desenvolvimento pessoal e comunicação.', 'teal', 1),
  ('22222222-2222-4222-8222-222222222222', 'Reforço Escolar', 'Acompanhamento e reforço escolar do ensino primário ao segundo ciclo.', 'gold', 2);

INSERT INTO public.cursos (programa_id, nome, nivel, ordem) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Oratória', NULL, 1),
  ('11111111-1111-4111-8111-111111111111', 'Inglês', NULL, 2),
  ('22222222-2222-4222-8222-222222222222', 'Língua Portuguesa', 'Primário', 1),
  ('22222222-2222-4222-8222-222222222222', 'Matemática', 'Primário', 2),
  ('22222222-2222-4222-8222-222222222222', 'Caligrafia', 'Primário', 3),
  ('22222222-2222-4222-8222-222222222222', 'Língua Portuguesa', 'Iº ciclo', 4),
  ('22222222-2222-4222-8222-222222222222', 'Matemática', 'Iº ciclo', 5),
  ('22222222-2222-4222-8222-222222222222', 'Caligrafia', 'Iº ciclo', 6),
  ('22222222-2222-4222-8222-222222222222', 'Química', 'Iº ciclo', 7),
  ('22222222-2222-4222-8222-222222222222', 'Física', 'Iº ciclo', 8),
  ('22222222-2222-4222-8222-222222222222', 'Biologia', 'Iº ciclo', 9),
  ('22222222-2222-4222-8222-222222222222', 'Plano personalizado', 'IIº ciclo / Secundário', 10);