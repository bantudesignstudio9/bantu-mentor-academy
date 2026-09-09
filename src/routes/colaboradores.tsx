import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Pencil, X } from "lucide-react";
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
  Tabela,
} from "@/components/neu";
import { useApagar, useColaboradores, useGuardar, type Colaborador } from "@/lib/data";
import { POLOS, dataCurta, kz } from "@/lib/format";

export const Route = createFileRoute("/colaboradores")({
  head: () => ({
    meta: [
      { title: "Colaboradores — Bantu Mentor Academy" },
      {
        name: "description",
        content:
          "Professores, agentes de campo e coordenação: disciplina, polo, salário bruto e período de contrato.",
      },
      { property: "og:title", content: "Colaboradores — Bantu Mentor Academy" },
      { property: "og:description", content: "Equipa do programa de formação." },
    ],
  }),
  component: Colaboradores,
});

type FormColab = Partial<Colaborador>;

const vazio: FormColab = {
  nome: "",
  categoria: "professor",
  disciplina: "",
  polo: "Caála",
  telefone: "",
  salario_bruto: 0,
  activo: true,
};

const CATEGORIAS = [
  { valor: "professor", nome: "Professor" },
  { valor: "agente", nome: "Agente de campo" },
  { valor: "coordenacao", nome: "Coordenação" },
];

function Colaboradores() {
  const { data: colaboradores = [] } = useColaboradores();
  const guardar = useGuardar("colaboradores", ["colaboradores"]);
  const apagar = useApagar("colaboradores", ["colaboradores"]);
  const [form, setForm] = useState<FormColab>(vazio);
  const [aberto, setAberto] = useState(false);
  const [categoria, setCategoria] = useState("todas");

  const lista = colaboradores.filter(
    (c) => categoria === "todas" || c.categoria === categoria,
  );
  const folha = lista.reduce((s, c) => s + Number(c.salario_bruto), 0);

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    guardar.mutate(
      { ...form, salario_bruto: Number(form.salario_bruto) || 0 },
      {
        onSuccess: () => {
          toast.success("Colaborador guardado");
          setForm(vazio);
          setAberto(false);
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  return (
    <AppShell>
      <PageHeader
        titulo="Colaboradores"
        descricao="Professores, agentes de campo e coordenação do programa."
        accao={
          <NeuButton
            variant="primary"
            onClick={() => {
              setForm(vazio);
              setAberto((v) => !v);
            }}
          >
            {aberto ? <X className="size-4" /> : <Plus className="size-4" />}
            {aberto ? "Fechar" : "Novo colaborador"}
          </NeuButton>
        }
      />

      {aberto && (
        <NeuCard gloss className="mb-6">
          <form onSubmit={submeter} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Campo label="Nome completo" className="sm:col-span-2">
              <NeuInput
                required
                value={form.nome ?? ""}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </Campo>
            <Campo label="Categoria">
              <NeuSelect
                value={form.categoria ?? "professor"}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.valor} value={c.valor}>
                    {c.nome}
                  </option>
                ))}
              </NeuSelect>
            </Campo>
            <Campo label="Disciplina">
              <NeuInput
                value={form.disciplina ?? ""}
                onChange={(e) => setForm({ ...form, disciplina: e.target.value })}
              />
            </Campo>
            <Campo label="Polo">
              <NeuSelect
                value={form.polo ?? "Caála"}
                onChange={(e) => setForm({ ...form, polo: e.target.value })}
              >
                {POLOS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </NeuSelect>
            </Campo>
            <Campo label="Telefone">
              <NeuInput
                value={form.telefone ?? ""}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              />
            </Campo>
            <Campo label="Salário bruto (Kz)">
              <NeuInput
                type="number"
                value={String(form.salario_bruto ?? 0)}
                onChange={(e) => setForm({ ...form, salario_bruto: Number(e.target.value) })}
              />
            </Campo>
            <Campo label="Data de início">
              <NeuInput
                type="date"
                value={form.data_inicio ?? ""}
                onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
              />
            </Campo>
            <Campo label="Data de termo">
              <NeuInput
                type="date"
                value={form.data_termino ?? ""}
                onChange={(e) => setForm({ ...form, data_termino: e.target.value })}
              />
            </Campo>
            <Campo label="Situação">
              <NeuSelect
                value={form.activo ? "sim" : "nao"}
                onChange={(e) => setForm({ ...form, activo: e.target.value === "sim" })}
              >
                <option value="sim">Activo</option>
                <option value="nao">Inactivo</option>
              </NeuSelect>
            </Campo>
            <div className="flex items-end">
              <NeuButton variant="gold" type="submit" disabled={guardar.isPending}>
                Guardar
              </NeuButton>
            </div>
          </form>
        </NeuCard>
      )}

      <NeuCard className="mb-4 flex flex-wrap items-end gap-4">
        <Campo label="Categoria">
          <NeuSelect value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="todas">Todas</option>
            {CATEGORIAS.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.nome}
              </option>
            ))}
          </NeuSelect>
        </Campo>
        <Etiqueta>{lista.length} colaborador(es)</Etiqueta>
        <Etiqueta tom="aviso">Folha salarial: {kz(folha)}</Etiqueta>
      </NeuCard>

      <Tabela
        cabecalho={["Nome", "Categoria", "Disciplina", "Polo", "Início", "Bruto", "Situação", ""]}
      >
        {lista.map((c) => (
          <Linha key={c.id}>
            <td className="px-3 py-3 font-semibold">{c.nome}</td>
            <td className="px-3 py-3 capitalize">{c.categoria}</td>
            <td className="px-3 py-3">{c.disciplina || "—"}</td>
            <td className="px-3 py-3">{c.polo}</td>
            <td className="px-3 py-3">{dataCurta(c.data_inicio)}</td>
            <td className="px-3 py-3">{kz(c.salario_bruto)}</td>
            <td className="px-3 py-3">
              <Etiqueta tom={c.activo ? "ok" : "aviso"}>{c.activo ? "Activo" : "Inactivo"}</Etiqueta>
            </td>
            <td className="px-3 py-3">
              <div className="flex justify-end gap-2">
                <NeuButton
                  className="px-2 py-1.5"
                  onClick={() => {
                    setForm({ ...c });
                    setAberto(true);
                  }}
                >
                  <Pencil className="size-3.5" />
                </NeuButton>
                <NeuButton
                  className="px-2 py-1.5"
                  onClick={() => {
                    if (confirm(`Apagar ${c.nome}?`)) apagar.mutate(c.id);
                  }}
                >
                  <Trash2 className="size-3.5" />
                </NeuButton>
              </div>
            </td>
          </Linha>
        ))}
        {!lista.length && (
          <Linha>
            <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
              Sem colaboradores registados.
            </td>
          </Linha>
        )}
      </Tabela>
    </AppShell>
  );
}
