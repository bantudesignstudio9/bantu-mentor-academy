ALTER TABLE public.financas ADD COLUMN IF NOT EXISTS aluno_id uuid REFERENCES public.alunos(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS financas_aluno_id_idx ON public.financas(aluno_id);

CREATE OR REPLACE FUNCTION public.recalcular_valor_pago(_aluno uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _aluno IS NULL THEN RETURN; END IF;
  UPDATE public.alunos a
  SET valor_pago = COALESCE((
    SELECT SUM(f.valor) FROM public.financas f
    WHERE f.aluno_id = _aluno AND f.tipo = 'receita' AND f.categoria = 'propinas'
  ), 0)
  WHERE a.id = _aluno;
END;
$$;

CREATE OR REPLACE FUNCTION public.financas_sync_aluno()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP <> 'INSERT' THEN PERFORM public.recalcular_valor_pago(OLD.aluno_id); END IF;
  IF TG_OP <> 'DELETE' THEN PERFORM public.recalcular_valor_pago(NEW.aluno_id); END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS financas_sync_aluno_trg ON public.financas;
CREATE TRIGGER financas_sync_aluno_trg
AFTER INSERT OR UPDATE OR DELETE ON public.financas
FOR EACH ROW EXECUTE FUNCTION public.financas_sync_aluno();

CREATE OR REPLACE FUNCTION public.alunos_propina_do_curso()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v numeric;
BEGIN
  IF NEW.curso_id IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.curso_id IS DISTINCT FROM OLD.curso_id) THEN
    SELECT propina_padrao INTO v FROM public.cursos WHERE id = NEW.curso_id;
    IF v IS NOT NULL AND v > 0 THEN NEW.propina = v; END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS alunos_propina_do_curso_trg ON public.alunos;
CREATE TRIGGER alunos_propina_do_curso_trg
BEFORE INSERT OR UPDATE ON public.alunos
FOR EACH ROW EXECUTE FUNCTION public.alunos_propina_do_curso();

CREATE OR REPLACE FUNCTION public.cursos_propagar_propina()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.propina_padrao IS DISTINCT FROM OLD.propina_padrao THEN
    UPDATE public.alunos SET propina = NEW.propina_padrao WHERE curso_id = NEW.id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS cursos_propagar_propina_trg ON public.cursos;
CREATE TRIGGER cursos_propagar_propina_trg
AFTER UPDATE ON public.cursos
FOR EACH ROW EXECUTE FUNCTION public.cursos_propagar_propina();