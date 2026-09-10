import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calculator, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
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
import {
  useColaboradores,
  useGravarPagamento,
  usePagamentos,
  usePresencas,
} from "@/lib/data";
import { kz, mesLegivel, mesRef, pct } from "@/lib/format";

export const Route = createFileRoute("/pagamentos")({
  head: () => ({
    meta: [
      { title: "Pagamentos — Bantu Mentor Academy" },
      {
        name: "description",
        content:
          "Processamento salarial mensal: bruto, descontos por faltas e líquido a pagar em Kwanza.",
      },
      { property: "og:title", content: "Pagamentos — Bantu Mentor Academy" },
      { property: "og:description", content: "Folha salarial mensal do programa." },
    ],
  }),
  component: Pagamentos,
});

function Pagamentos() {
  const { data: colaboradores = [] } = useColaboradores();
  const { data: presencas = [] } = usePresencas();
  const { data: pagamentos = [] } = usePagamentos();
  const gravar = useGravarPagamento();
  const [mes, setMes] = useState(mesRef());
  const [diasMes, setDiasMes] = useState(20);

  const linhas = useMemo(() => {
    return colaboradores
      .filter((c) => c.activo)
      .map((c) => {
        const doMes = presencas.filter(
          (p) => p.colaborador_id === c.id && p.data.startsWith(mes),
        );
        const faltas = doMes.filter((p) => p.estado === "falta").length;
        const presentes = doMes.filter((p) => p.estado === "presente").length;
        const bruto = Number(c.salario_bruto);
        const valorDia = diasMes > 0 ? bruto / diasMes : 0;
        const descontos = Math.round(valorDia * faltas);
        const liquido = Math.max(bruto - descontos, 0);
        const registo = pagamentos.find(
          (p) => p.colaborador_id === c.id && p.mes_referencia === mes,
        );
        return { c, faltas, presentes, bruto, descontos, liquido, registo };
      });
  }, [colaboradores, presencas, pagamentos, mes, diasMes]);

  const totalLiquido = linhas.reduce((s, l) => s + l.liquido, 0);
  const totalDescontos = linhas.reduce((s, l) => s + l.descontos, 0);
  const pagos = linhas.filter((l) => l.registo?.pago).length;

  const gravarLinha = (l: (typeof linhas)[number], pago: boolean) =>
    gravar.mutate(
      {
        colaborador_id: l.c.id,
        mes_referencia: mes,
        bruto: l.bruto,
        descontos: l.descontos,
        liquido: l.liquido,
        pago,
        data_pagamento: pago ? new Date().toISOString().slice(0, 10) : null,
      },
      {
        onSuccess: () => toast.success(pago ? "Pagamento confirmado" : "Cálculo guardado"),
        onError: (e: Error) => toast.error(e.message),
      },
    );

  return (
    <AppShell>
      <PageHeader
        titulo="Pagamentos"
        descricao="Cálculo automático do salário líquido a partir das faltas registadas."
        accao={
          <NeuButton variant="primary" onClick={() => linhas.forEach((l) => gravarLinha(l, false))}>
            <Calculator className="size-4" /> Guardar cálculos
          </NeuButton>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat titulo="Mês" valor={mesLegivel(mes)} />
        <Stat titulo="Total líquido" valor={kz(totalLiquido)} tom="gold" />
        <Stat titulo="Descontos" valor={kz(totalDescontos)} />
        <Stat
          titulo="Pagos"
          valor={`${pagos}/${linhas.length}`}
          nota={pct(linhas.length ? (pagos / linhas.length) * 100 : 0)}
          tom="neutro"
        />
      </div>

      <NeuCard className="mb-4 flex flex-wrap items-end gap-4">
        <Campo label="Mês de referência">
          <NeuInput type="month" value={mes} onChange={(e) => setMes(e.target.value)} />
        </Campo>
        <Campo label="Dias úteis do mês">
          <NeuSelect
            value={String(diasMes)}
            onChange={(e) => setDiasMes(Number(e.target.value))}
          >
            {[14, 16, 18, 20, 22, 24].map((d) => (
              <option key={d} value={d}>
                {d} dias
              </option>
            ))}
          </NeuSelect>
        </Campo>
        <Etiqueta>Desconto = bruto ÷ dias úteis × faltas</Etiqueta>
      </NeuCard>

      <Tabela
        cabecalho={["Colaborador", "Presenças", "Faltas", "Bruto", "Descontos", "Líquido", "Estado", ""]}
      >
        {linhas.map((l) => (
          <Linha key={l.c.id}>
            <td className="px-3 py-3 font-semibold">{l.c.nome}</td>
            <td className="px-3 py-3">{l.presentes}</td>
            <td className="px-3 py-3">{l.faltas}</td>
            <td className="px-3 py-3">{kz(l.bruto)}</td>
            <td className="px-3 py-3 text-destructive">{kz(l.descontos)}</td>
            <td className="px-3 py-3 font-semibold">{kz(l.liquido)}</td>
            <td className="px-3 py-3">
              <Etiqueta tom={l.registo?.pago ? "ok" : "aviso"}>
                {l.registo?.pago ? "Pago" : "Pendente"}
              </Etiqueta>
            </td>
            <td className="px-3 py-3">
              <div className="flex justify-end">
                <NeuButton
                  variant={l.registo?.pago ? "plain" : "gold"}
                  className="px-3 py-1.5"
                  onClick={() => gravarLinha(l, !l.registo?.pago)}
                >
                  <CheckCircle2 className="size-3.5" />
                  {l.registo?.pago ? "Anular" : "Marcar pago"}
                </NeuButton>
              </div>
            </td>
          </Linha>
        ))}
        {!linhas.length && (
          <Linha>
            <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
              Sem colaboradores activos.
            </td>
          </Linha>
        )}
      </Tabela>
    </AppShell>
  );
}
