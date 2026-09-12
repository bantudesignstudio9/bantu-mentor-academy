REVOKE ALL ON FUNCTION public.recalcular_valor_pago(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.financas_sync_aluno() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cursos_propagar_propina() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.alunos_propina_do_curso() FROM PUBLIC, anon, authenticated;