import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Minus, X } from "lucide-react";
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
import { useColaboradores, useMarcarPresenca, usePresencas } from "@/lib/data";
import { hoje, pct } from "@/lib/format";

export const Route = createFileRoute("/presencas")({
  head: () => ({
    meta: [
      { title: "Presenças — Bantu Mentor Academy" },
      {
        name: "description",
        content:
          "Marcação diária de presenças, faltas e faltas justificadas dos colaboradores do programa.",
      },
      { property: "og:title", content: "Presenças — Bantu Mentor Academy" },
      { property: "og:description", content: "Controlo da assiduidade da equipa." },
    ],
  }),
  component: Presencas,
});

const ESTADOS = [
  { valor: "presente", nome: "Presente", icone: Check, tom: "ok" as const },
  { valor: "justificada", nome: "Justificada", icone: Minus, tom: "aviso" as const },
  { valor: "falta", nome: "Falta", icone: X, tom: "erro" as const },
];

function Presencas() {
  const { data: colaboradores = [] } = useColaboradores();
  const { data: presencas = [] } = usePresencas();
  const marcar = useMarcarPresenca();
  const [dia, setDia] = useState(hoje());
  const [polo, setPolo] = useState("todos");

  const doDia = useMemo(() => {
    const mapa = new Map<string, string>();
    presencas.filter((p) => p.data === dia).forEach((p) => mapa.set(p.colaborador_id, p.estado));
    return mapa;
  }, [presencas, dia]);

  const lista = colaboradores.filter((c) => c.activo && (polo === "todos" || c.polo === polo));

  const totais = {
    presente: [...doDia.values()].filter((e) => e === "presente").length,
    falta: [...doDia.values()].filter((e) => e === "falta").length,
    justificada: [...doDia.values()].filter((e) => e === "justificada").length,
  };

  const globalPresentes = presencas.filter((p) => p.estado === "presente").length;
  const assiduidadeGeral = presencas.length ? (globalPresentes / presencas.length) * 100 : 0;

  const registar = (colaborador_id: string, estado: string) =>
    marcar.mutate(
      { colaborador_id, data: dia, estado },
      { onError: (e: Error) => toast.error(e.message) },
    );

  const marcarTodos = () =>
    lista.forEach((c) => registar(c.id, "presente"));

  return (
    <AppShell>
      <PageHeader
        titulo="Presenças"
        descricao="Marque a assiduidade diária dos professores e agentes de campo."
        accao={
          <NeuButton variant="gold" onClick={marcarTodos}>
            <Check className="size-4" /> Todos presentes
          </NeuButton>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat titulo="Presentes hoje" valor={String(totais.presente)} />
        <Stat titulo="Faltas" valor={String(totais.falta)} tom="gold" />
        <Stat titulo="Justificadas" valor={String(totais.justificada)} tom="neutro" />
        <Stat titulo="Assiduidade global" valor={pct(assiduidadeGeral)} />
      </div>

      <NeuCard className="mb-4 flex flex-wrap items-end gap-4">
        <Campo label="Data">
          <NeuInput type="date" value={dia} onChange={(e) => setDia(e.target.value)} />
        </Campo>
        <Campo label="Polo">
          <NeuSelect value={polo} onChange={(e) => setPolo(e.target.value)}>
            <option value="todos">Todos</option>
            <option>Caála</option>
            <option>Huambo</option>
            <option>Outro</option>
          </NeuSelect>
        </Campo>
        <Etiqueta>{lista.length} colaborador(es)</Etiqueta>
      </NeuCard>

      <Tabela cabecalho={["Colaborador", "Categoria", "Polo", "Estado do dia", "Marcar"]}>
        {lista.map((c) => {
          const estado = doDia.get(c.id);
          return (
            <Linha key={c.id}>
              <td className="px-3 py-3 font-semibold">{c.nome}</td>
              <td className="px-3 py-3 capitalize">{c.categoria}</td>
              <td className="px-3 py-3">{c.polo}</td>
              <td className="px-3 py-3">
                {estado ? (
                  <Etiqueta tom={ESTADOS.find((e) => e.valor === estado)?.tom ?? "neutro"}>
                    {ESTADOS.find((e) => e.valor === estado)?.nome ?? estado}
                  </Etiqueta>
                ) : (
                  <Etiqueta>Por marcar</Etiqueta>
                )}
              </td>
              <td className="px-3 py-3">
                <div className="flex justify-end gap-2">
                  {ESTADOS.map(({ valor, nome, icone: Icone }) => (
                    <NeuButton
                      key={valor}
                      title={nome}
                      variant={estado === valor ? "primary" : "plain"}
                      className="px-2.5 py-1.5"
                      onClick={() => registar(c.id, valor)}
                    >
                      <Icone className="size-3.5" />
                    </NeuButton>
                  ))}
                </div>
              </td>
            </Linha>
          );
        })}
        {!lista.length && (
          <Linha>
            <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
              Sem colaboradores activos para este filtro.
            </td>
          </Linha>
        )}
      </Tabela>
    </AppShell>
  );
}
