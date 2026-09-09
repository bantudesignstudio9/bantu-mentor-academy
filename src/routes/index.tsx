import { createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap,
  Users,
  TrendingUp,
  Wallet,
  CalendarCheck,
  PiggyBank,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { NeuCard, PageHeader, Stat, Etiqueta } from "@/components/neu";
import {
  useAlunos,
  useColaboradores,
  useFinancas,
  usePagamentos,
  usePresencas,
} from "@/lib/data";
import { kz, mesRef, mesLegivel, pct, num } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel — Bantu Mentor Academy" },
      {
        name: "description",
        content:
          "Painel de gestão da Bantu Mentor Academy: alunos, colaboradores, assiduidade, pagamentos e finanças do programa de formação.",
      },
      { property: "og:title", content: "Painel — Bantu Mentor Academy" },
      {
        property: "og:description",
        content: "Gestão de alunos, assiduidade, pagamentos e finanças em Kwanza.",
      },
    ],
  }),
  component: Painel,
});

function Painel() {
  const alunos = useAlunos().data ?? [];
  const colaboradores = useColaboradores().data ?? [];
  const presencas = usePresencas().data ?? [];
  const pagamentos = usePagamentos().data ?? [];
  const financas = useFinancas().data ?? [];

  const receitasAlunos = alunos.reduce((s, a) => s + Number(a.valor_pago), 0);
  const receitasExtra = financas
    .filter((f) => f.tipo === "receita")
    .reduce((s, f) => s + Number(f.valor), 0);
  const despesas = financas
    .filter((f) => f.tipo === "despesa")
    .reduce((s, f) => s + Number(f.valor), 0);
  const salarios = pagamentos
    .filter((p) => p.pago)
    .reduce((s, p) => s + Number(p.liquido), 0);
  const saldo = receitasAlunos + receitasExtra - despesas - salarios;

  const presentes = presencas.filter((p) => p.estado === "presente").length;
  const assiduidade = presencas.length ? (presentes / presencas.length) * 100 : 0;

  const emDivida = alunos.filter((a) => Number(a.valor_pago) < Number(a.propina));

  const porPolo = Object.entries(
    alunos.reduce<Record<string, number>>((acc, a) => {
      acc[a.polo] = (acc[a.polo] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([polo, total]) => ({ polo, total }));

  const fluxo = [
    { nome: "Propinas", valor: receitasAlunos },
    { nome: "Outras receitas", valor: receitasExtra },
    { nome: "Despesas", valor: despesas },
    { nome: "Salários", valor: salarios },
  ];

  const cores = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];
  const mes = mesRef();

  return (
    <AppShell>
      <PageHeader
        titulo="Painel geral"
        descricao={`Resumo do programa de formação — ${mesLegivel(mes)}.`}
        accao={<Etiqueta tom={saldo >= 0 ? "ok" : "erro"}>Saldo: {kz(saldo)}</Etiqueta>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          titulo="Alunos inscritos"
          valor={num(alunos.length)}
          nota={`${emDivida.length} com propina em falta`}
          icone={<GraduationCap className="size-5" />}
        />
        <Stat
          titulo="Colaboradores activos"
          valor={num(colaboradores.filter((c) => c.activo).length)}
          nota={`${colaboradores.length} no total`}
          tom="gold"
          icone={<Users className="size-5" />}
        />
        <Stat
          titulo="Assiduidade"
          valor={pct(assiduidade)}
          nota={`${presencas.length} marcações registadas`}
          icone={<CalendarCheck className="size-5" />}
        />
        <Stat
          titulo="Receita total"
          valor={kz(receitasAlunos + receitasExtra)}
          nota={`Despesas: ${kz(despesas + salarios)}`}
          tom="gold"
          icone={<TrendingUp className="size-5" />}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <NeuCard gloss className="lg:col-span-2">
          <h2 className="etched font-display text-lg font-bold">Movimento financeiro</h2>
          <p className="mb-4 text-xs text-muted-foreground">Valores acumulados em Kwanza</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fluxo}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="nome" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={70} />
                <Tooltip
                  formatter={(v: number) => kz(v)}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                  {fluxo.map((_, i) => (
                    <Cell key={i} fill={cores[i % cores.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeuCard>

        <NeuCard gloss>
          <h2 className="etched font-display text-lg font-bold">Alunos por polo</h2>
          <p className="mb-2 text-xs text-muted-foreground">Distribuição actual</p>
          <div className="h-56">
            {porPolo.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={porPolo}
                    dataKey="total"
                    nameKey="polo"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {porPolo.map((_, i) => (
                      <Cell key={i} fill={cores[i % cores.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="pt-16 text-center text-sm text-muted-foreground">
                Ainda sem alunos registados.
              </p>
            )}
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {porPolo.map((p, i) => (
              <li key={p.polo} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: cores[i % cores.length] }}
                  />
                  {p.polo}
                </span>
                <span className="font-semibold">{p.total}</span>
              </li>
            ))}
          </ul>
        </NeuCard>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <NeuCard gloss>
          <h2 className="etched flex items-center gap-2 font-display text-lg font-bold">
            <Wallet className="size-4" /> Propinas em falta
          </h2>
          <ul className="mt-3 space-y-2">
            {emDivida.slice(0, 6).map((a) => (
              <li
                key={a.id}
                className="neu-inset flex items-center justify-between rounded-xl px-3 py-2 text-sm"
              >
                <span>{a.nome}</span>
                <span className="font-semibold text-destructive">
                  {kz(Number(a.propina) - Number(a.valor_pago))}
                </span>
              </li>
            ))}
            {!emDivida.length && (
              <li className="text-sm text-muted-foreground">Todas as propinas estão liquidadas.</li>
            )}
          </ul>
        </NeuCard>

        <NeuCard gloss>
          <h2 className="etched flex items-center gap-2 font-display text-lg font-bold">
            <PiggyBank className="size-4" /> Últimos movimentos
          </h2>
          <ul className="mt-3 space-y-2">
            {financas.slice(0, 6).map((f) => (
              <li
                key={f.id}
                className="neu-inset flex items-center justify-between rounded-xl px-3 py-2 text-sm"
              >
                <span>
                  {f.descricao || f.categoria}
                  <span className="ml-2 text-xs text-muted-foreground">{f.data}</span>
                </span>
                <span
                  className={
                    f.tipo === "receita" ? "font-semibold text-success" : "font-semibold text-destructive"
                  }
                >
                  {f.tipo === "receita" ? "+" : "−"}
                  {kz(f.valor)}
                </span>
              </li>
            ))}
            {!financas.length && (
              <li className="text-sm text-muted-foreground">Ainda sem movimentos registados.</li>
            )}
          </ul>
        </NeuCard>
      </div>
    </AppShell>
  );
}
