CREATE TABLE public.alunos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  nome text NOT NULL,
  telefone text,
  polo text NOT NULL DEFAULT 'Caála',
  turma text,
  data_inscricao date NOT NULL DEFAULT current_date,
  propina numeric NOT NULL DEFAULT 0,
  valor_pago numeric NOT NULL DEFAULT 0,
  estado text NOT NULL DEFAULT 'activo',
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.colaboradores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  nome text NOT NULL,
  categoria text NOT NULL DEFAULT 'professor',
  disciplina text,
  polo text NOT NULL DEFAULT 'Caála',
  telefone text,
  salario_bruto numeric NOT NULL DEFAULT 0,
  data_inicio date,
  data_termino date,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.presencas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  colaborador_id uuid NOT NULL REFERENCES public.colaboradores(id) ON DELETE CASCADE,
  data date NOT NULL,
  estado text NOT NULL DEFAULT 'presente',
  observacao text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (colaborador_id, data)
);

CREATE TABLE public.pagamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  colaborador_id uuid NOT NULL REFERENCES public.colaboradores(id) ON DELETE CASCADE,
  mes_referencia text NOT NULL,
  bruto numeric NOT NULL DEFAULT 0,
  descontos numeric NOT NULL DEFAULT 0,
  liquido numeric NOT NULL DEFAULT 0,
  pago boolean NOT NULL DEFAULT false,
  data_pagamento date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (colaborador_id, mes_referencia)
);

CREATE TABLE public.financas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  data date NOT NULL DEFAULT current_date,
  tipo text NOT NULL DEFAULT 'despesa',
  categoria text NOT NULL DEFAULT 'geral',
  descricao text,
  valor numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.alunos TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.colaboradores TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.presencas TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pagamentos TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financas TO anon, authenticated;
GRANT ALL ON public.alunos, public.colaboradores, public.presencas, public.pagamentos, public.financas TO service_role;

ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presencas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "acesso aberto alunos" ON public.alunos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "acesso aberto colaboradores" ON public.colaboradores FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "acesso aberto presencas" ON public.presencas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "acesso aberto pagamentos" ON public.pagamentos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "acesso aberto financas" ON public.financas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER alunos_updated BEFORE UPDATE ON public.alunos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER colaboradores_updated BEFORE UPDATE ON public.colaboradores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.colaboradores (nome, categoria, disciplina, polo, salario_bruto, activo) VALUES
 ('Bibiana Geraldo','professor','Redação','Caála',20000,true),
 ('Cláudio Quintas','professor','Oratória','Caála',20000,true),
 ('Costantino Sunguete','professor','Oratória','Huambo',20000,true),
 ('Engrácia João','professor','Inglês','Caála',20000,true),
 ('Eugénio Sacupema','professor','Caligrafia','Caála',40000,true),
 ('Maria Kamalata','professor','Inglês','Huambo',20000,true),
 ('Palmira Canangui','professor','Redação','Huambo',20000,true),
 ('Agente de Campo 1','agente',NULL,'Caála',14000,true),
 ('Agente de Campo 2','agente',NULL,'Huambo',12000,true);