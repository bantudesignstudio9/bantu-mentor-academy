import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Aluno = {
  id: string;
  nome: string;
  telefone: string | null;
  polo: string;
  turma: string | null;
  data_inscricao: string;
  propina: number;
  valor_pago: number;
  estado: string;
  observacoes: string | null;
  programa_id: string | null;
  curso_id: string | null;
  nivel: string | null;
};

export type Programa = {
  id: string;
  nome: string;
  descricao: string | null;
  cor: string;
  activo: boolean;
  ordem: number;
};

export type Curso = {
  id: string;
  programa_id: string;
  nome: string;
  nivel: string | null;
  propina_padrao: number;
  activo: boolean;
  ordem: number;
};

export type Colaborador = {
  id: string;
  nome: string;
  categoria: string;
  disciplina: string | null;
  polo: string;
  telefone: string | null;
  salario_bruto: number;
  data_inicio: string | null;
  data_termino: string | null;
  activo: boolean;
};

export type Presenca = {
  id: string;
  colaborador_id: string;
  data: string;
  estado: string;
  observacao: string | null;
};

export type Pagamento = {
  id: string;
  colaborador_id: string;
  mes_referencia: string;
  bruto: number;
  descontos: number;
  liquido: number;
  pago: boolean;
  data_pagamento: string | null;
};

export type Financa = {
  id: string;
  data: string;
  tipo: string;
  categoria: string;
  descricao: string | null;
  valor: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

async function listar<T>(tabela: string, orderBy: string, asc = true): Promise<T[]> {
  const { data, error } = await db.from(tabela).select("*").order(orderBy, { ascending: asc });
  if (error) throw error;
  return (data ?? []) as T[];
}

export const useAlunos = () =>
  useQuery({ queryKey: ["alunos"], queryFn: () => listar<Aluno>("alunos", "nome") });

export const useColaboradores = () =>
  useQuery({
    queryKey: ["colaboradores"],
    queryFn: () => listar<Colaborador>("colaboradores", "nome"),
  });

export const usePresencas = () =>
  useQuery({ queryKey: ["presencas"], queryFn: () => listar<Presenca>("presencas", "data", false) });

export const usePagamentos = () =>
  useQuery({
    queryKey: ["pagamentos"],
    queryFn: () => listar<Pagamento>("pagamentos", "mes_referencia", false),
  });

export const useProgramas = () =>
  useQuery({ queryKey: ["programas"], queryFn: () => listar<Programa>("programas", "ordem") });

export const useCursos = () =>
  useQuery({ queryKey: ["cursos"], queryFn: () => listar<Curso>("cursos", "ordem") });

export const useFinancas = () =>
  useQuery({ queryKey: ["financas"], queryFn: () => listar<Financa>("financas", "data", false) });

export function useGuardar(tabela: string, chaves: string[]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (registo: Record<string, unknown>) => {
      const { id, ...resto } = registo;
      const query = id
        ? db.from(tabela).update(resto).eq("id", id)
        : db.from(tabela).insert(resto);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => chaves.forEach((k) => qc.invalidateQueries({ queryKey: [k] })),
  });
}

export function useApagar(tabela: string, chaves: string[]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(tabela).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => chaves.forEach((k) => qc.invalidateQueries({ queryKey: [k] })),
  });
}

export function useMarcarPresenca() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (registo: { colaborador_id: string; data: string; estado: string }) => {
      const { error } = await db
        .from("presencas")
        .upsert(registo, { onConflict: "colaborador_id,data" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["presencas"] }),
  });
}

export function useGravarPagamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (registo: Record<string, unknown>) => {
      const { error } = await db
        .from("pagamentos")
        .upsert(registo, { onConflict: "colaborador_id,mes_referencia" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pagamentos"] }),
  });
}
