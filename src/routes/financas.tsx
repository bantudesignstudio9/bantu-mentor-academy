import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import {
  Campo,
  Etiqueta,
  Linha,
  NeuButton,
  NeuCard,
  NeuInput,
  NeuSelect,
  PageHeader,
  Stat,
  Tabela,
} from "@/components/neu";
import { useAlunos, useApagar, useFinancas, useGuardar, usePagamentos } from "@/lib/data";
import { dataCurta, hoje, kz, mesLegivel } from "@/lib/format";

export const Route = createFileRoute("/financas")({
  head: () => ({
    meta: [
      { title: "Finanças — Bantu Mentor Academy" },
      {
        name: "description",
        content:
          "Receitas, despesas com material, pessoal e escolas, saldo mensal do programa de formação em Kwanza.",
      },
      { property: "og:title", content: "Finanças — Bantu Mentor Academy" },
      { property: "og:description", content: "Controlo financeiro mensal do programa." },
    ],
  }),
  component: Financas,
});

const CATEGORIAS = [
  "propinas",
  "material",
  "pessoal",
  "escolas",
  "transporte",
  "geral",
];

function Financas() {
  const { data: financas = [] } = useFinancas();
  const { data: alunos = [] } = useAlunos();
  const { data: pagamentos = [] } = usePagamentos();
  const guardar = useGuardar("financas", ["financas", "alunos"]);
  const apagar = useApagar("financas", ["financas", "alunos"]);

  const [form, setForm] = useState<{
    data: string;
    tipo: string;
    categoria: string;
    descricao: string;
    valor: number;
    aluno_id: string | null;
  }>({
    data: hoje(),
    tipo: "despesa",
    categoria: "material",
    descricao: "",
    valor: 0,
    aluno_id: null,
  });

  const ehPropina = form.categoria === "propinas";
  const alunoSel = alunos.find((a) => a.id === form.aluno_id) ?? null;
  const totalAluno = Number(alunoSel?.propina ?? 0);
  const pagoAluno = Number(alunoSel?.valor_pago ?? 0);
  const faltaAluno = Math.max(totalAluno - pagoAluno, 0);
  const nomeAluno = (id: string | null) => alunos.find((a) => a.id === id)?.nome ?? null;

  const receitasAlunos = alunos.reduce((s, a) => s + Number(a.valor_pago), 0);
  const receitas = financas
    .filter((f) => f.tipo === "receita" && f.categoria !== "propinas")
    .reduce((s, f) => s + Number(f.valor), 0);
  const despesas = financas
    .filter((f) => f.tipo === "despesa")
    .reduce((s, f) => s + Number(f.valor), 0);
  const salarios = pagamentos.filter((p) => p.pago).reduce((s, p) => s + Number(p.liquido), 0);
  const saldo = receitas + receitasAlunos - despesas - salarios;

  const serie = useMemo(() => {
    const mapa = new Map<string, { mes: string; receita: number; despesa: number }>();
    financas.forEach((f) => {
      const mes = f.data.slice(0, 7);
      const item = mapa.get(mes) ?? { mes, receita: 0, despesa: 0 };
      if (f.tipo === "receita") item.receita += Number(f.valor);
      else item.despesa += Number(f.valor);
      mapa.set(mes, item);
    });
    return [...mapa.values()].sort((a, b) => a.mes.localeCompare(b.mes));
  }, [financas]);

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (ehPropina && !form.aluno_id) {
      toast.error("Escolha o aluno da propina");
      return;
    }
    guardar.mutate(
      {
        ...form,
        tipo: ehPropina ? "receita" : form.tipo,
        valor: Number(form.valor) || 0,
        aluno_id: ehPropina ? form.aluno_id : null,
      },
      {
        onSuccess: () => {
          toast.success(ehPropina ? "Propina registada" : "Movimento registado");
          setForm({ ...form, descricao: "", valor: 0 });
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  return (
    <AppShell>
      <PageHeader
        titulo="Finanças"
        descricao="Receitas e despesas do programa, com o saldo líquido em Kwanza."
        accao={<Etiqueta tom={saldo >= 0 ? "ok" : "erro"}>Saldo: {kz(saldo)}</Etiqueta>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat titulo="Propinas recebidas" valor={kz(receitasAlunos)} tom="gold" />
        <Stat titulo="Outras receitas" valor={kz(receitas)} />
        <Stat titulo="Despesas" valor={kz(despesas)} tom="neutro" />
        <Stat titulo="Salários pagos" valor={kz(salarios)} />
      </div>

      <NeuCard gloss className="mb-6">
        <h2 className="etched font-display text-lg font-bold">Evolução mensal</h2>
        <p className="mb-4 text-xs text-muted-foreground">Receitas e despesas registadas</p>
        <div className="h-64">
          {serie.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={serie}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="mes"
                  tickFormatter={(m: string) => mesLegivel(m).slice(0, 3)}
                  tick={{ fontSize: 12 }}
                  stroke="var(--muted-foreground)"
                />
                <YAxis tick={{ fontSize: 11 }} width={70} stroke="var(--muted-foreground)" />
                <Tooltip
                  formatter={(v: number) => kz(v)}
                  labelFormatter={(m: string) => mesLegivel(m)}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="var(--chart-3)"
                  fill="var(--chart-3)"
                  fillOpacity={0.25}
                />
                <Area
                  type="monotone"
                  dataKey="despesa"
                  stroke="var(--chart-4)"
                  fill="var(--chart-4)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="pt-24 text-center text-sm text-muted-foreground">
              Registe movimentos para ver a evolução.
            </p>
          )}
        </div>
      </NeuCard>

      <NeuCard gloss className="mb-6">
        <form onSubmit={submeter} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Campo label="Data">
            <NeuInput
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
            />
          </Campo>
          <Campo label="Tipo">
            <NeuSelect
              value={ehPropina ? "receita" : form.tipo}
              disabled={ehPropina}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </NeuSelect>
          </Campo>
          <Campo label="Categoria">
            <NeuSelect
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c}
                </option>
              ))}
            </NeuSelect>
          </Campo>
          {ehPropina && (
            <Campo label="Aluno">
              <NeuSelect
                value={String(form.aluno_id ?? "")}
                onChange={(e) => setForm({ ...form, aluno_id: e.target.value || null })}
              >
                <option value="">Escolher aluno…</option>
                {alunos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </NeuSelect>
            </Campo>
          )}
          <Campo label="Descrição">
            <NeuInput
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
          </Campo>
          <div className="flex items-end gap-2">
            <Campo label="Valor (Kz)" className="flex-1">
              <NeuInput
                type="number"
                value={String(form.valor)}
                onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
              />
            </Campo>
            <NeuButton variant="gold" type="submit" disabled={guardar.isPending}>
              <Plus className="size-4" />
            </NeuButton>
          </div>
        </form>

        {ehPropina && alunoSel ? (
          <div className="neu-inset mt-4 grid gap-3 rounded-2xl p-4 sm:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Aluno
              </p>
              <p className="mt-1 font-semibold">{alunoSel.nome}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Propina total
              </p>
              <p className="mt-1 font-semibold">{kz(totalAluno)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Já pago
              </p>
              <p className="mt-1 font-semibold">{kz(pagoAluno)}</p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Em falta
              </p>
              <Etiqueta tom={faltaAluno > 0 ? "erro" : "ok"}>{kz(faltaAluno)}</Etiqueta>
              {faltaAluno > 0 ? (
                <NeuButton
                  type="button"
                  className="px-3 py-1.5"
                  onClick={() => setForm({ ...form, valor: faltaAluno })}
                >
                  Usar valor em falta
                </NeuButton>
              ) : null}
            </div>
          </div>
        ) : null}
      </NeuCard>

      <Tabela cabecalho={["Data", "Tipo", "Categoria", "Aluno", "Descrição", "Valor", ""]}>
        {financas.map((f) => (
          <Linha key={f.id}>
            <td className="px-3 py-3">{nomeAluno(f.aluno_id) ?? "—"}</td>
            <td className="px-3 py-3">{dataCurta(f.data)}</td>
            <td className="px-3 py-3">
              <Etiqueta tom={f.tipo === "receita" ? "ok" : "erro"}>{f.tipo}</Etiqueta>
            </td>
            <td className="px-3 py-3 capitalize">{f.categoria}</td>
            <td className="px-3 py-3">{f.descricao || "—"}</td>
            <td className="px-3 py-3 font-semibold">{kz(f.valor)}</td>
            <td className="px-3 py-3">
              <div className="flex justify-end">
                <NeuButton className="px-2 py-1.5" onClick={() => apagar.mutate(f.id)}>
                  <Trash2 className="size-3.5" />
                </NeuButton>
              </div>
            </td>
          </Linha>
        ))}
        {!financas.length && (
          <Linha>
            <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
              Sem movimentos registados.
            </td>
          </Linha>
        )}
      </Tabela>
    </AppShell>
  );
}
