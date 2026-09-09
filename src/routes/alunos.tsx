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
import { useAlunos, useApagar, useGuardar, type Aluno } from "@/lib/data";
import { POLOS, dataCurta, hoje, kz } from "@/lib/format";

export const Route = createFileRoute("/alunos")({
  head: () => ({
    meta: [
      { title: "Alunos — Bantu Mentor Academy" },
      {
        name: "description",
        content: "Registo de alunos por polo, turma, propina paga e estado da inscrição.",
      },
      { property: "og:title", content: "Alunos — Bantu Mentor Academy" },
      { property: "og:description", content: "Registo e controlo dos alunos do programa." },
    ],
  }),
  component: Alunos,
});

type FormAluno = Partial<Aluno>;

const vazio: FormAluno = {
  nome: "",
  telefone: "",
  polo: "Caála",
  turma: "",
  data_inscricao: hoje(),
  propina: 0,
  valor_pago: 0,
  estado: "activo",
};

function Alunos() {
  const { data: alunos = [], isLoading } = useAlunos();
  const guardar = useGuardar("alunos", ["alunos"]);
  const apagar = useApagar("alunos", ["alunos"]);
  const [form, setForm] = useState<FormAluno>(vazio);
  const [aberto, setAberto] = useState(false);
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState("");

  const lista = alunos.filter(
    (a) =>
      (filtro === "todos" || a.polo === filtro) &&
      a.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const editar = (a: Aluno) => {
    setForm({ ...a });
    setAberto(true);
  };

  const submeter = (e: React.FormEvent) => {
    e.preventDefault();
    guardar.mutate(
      {
        ...form,
        propina: Number(form.propina) || 0,
        valor_pago: Number(form.valor_pago) || 0,
      },
      {
        onSuccess: () => {
          toast.success("Aluno guardado");
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
        titulo="Alunos"
        descricao="Registo dos alunos inscritos, por polo e turma, com controlo das propinas."
        accao={
          <NeuButton
            variant="primary"
            onClick={() => {
              setForm(vazio);
              setAberto((v) => !v);
            }}
          >
            {aberto ? <X className="size-4" /> : <Plus className="size-4" />}
            {aberto ? "Fechar" : "Novo aluno"}
          </NeuButton>
        }
      />

      {aberto && (
        <NeuCard gloss className="mb-6">
          <form onSubmit={submeter} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Campo label="Nome completo" className="sm:col-span-2">
              <NeuInput
                required
                value={String(form.nome ?? "")}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </Campo>
            <Campo label="Telefone">
              <NeuInput
                value={String(form.telefone ?? "")}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              />
            </Campo>
            <Campo label="Polo">
              <NeuSelect
                value={String(form.polo ?? "Caála")}
                onChange={(e) => setForm({ ...form, polo: e.target.value })}
              >
                {POLOS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </NeuSelect>
            </Campo>
            <Campo label="Turma">
              <NeuInput
                value={String(form.turma ?? "")}
                onChange={(e) => setForm({ ...form, turma: e.target.value })}
              />
            </Campo>
            <Campo label="Data de inscrição">
              <NeuInput
                type="date"
                value={String(form.data_inscricao ?? hoje())}
                onChange={(e) => setForm({ ...form, data_inscricao: e.target.value })}
              />
            </Campo>
            <Campo label="Propina (Kz)">
              <NeuInput
                type="number"
                value={String(form.propina ?? 0)}
                onChange={(e) => setForm({ ...form, propina: Number(e.target.value) })}
              />
            </Campo>
            <Campo label="Valor pago (Kz)">
              <NeuInput
                type="number"
                value={String(form.valor_pago ?? 0)}
                onChange={(e) => setForm({ ...form, valor_pago: Number(e.target.value) })}
              />
            </Campo>
            <Campo label="Estado">
              <NeuSelect
                value={String(form.estado ?? "activo")}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              >
                <option value="activo">Activo</option>
                <option value="desistente">Desistente</option>
                <option value="concluido">Concluído</option>
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
        <Campo label="Pesquisar" className="min-w-52 flex-1">
          <NeuInput
            placeholder="Nome do aluno"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </Campo>
        <Campo label="Polo">
          <NeuSelect value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todos">Todos</option>
            {POLOS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </NeuSelect>
        </Campo>
        <Etiqueta>{lista.length} aluno(s)</Etiqueta>
      </NeuCard>

      <Tabela
        cabecalho={["Nome", "Polo", "Turma", "Inscrição", "Propina", "Pago", "Estado", ""]}
      >
        {lista.map((a) => {
          const divida = Number(a.propina) - Number(a.valor_pago);
          return (
            <Linha key={a.id}>
              <td className="px-3 py-3 font-semibold">{a.nome}</td>
              <td className="px-3 py-3">{a.polo}</td>
              <td className="px-3 py-3">{a.turma || "—"}</td>
              <td className="px-3 py-3">{dataCurta(a.data_inscricao)}</td>
              <td className="px-3 py-3">{kz(a.propina)}</td>
              <td className="px-3 py-3">
                {kz(a.valor_pago)}{" "}
                {divida > 0 ? <Etiqueta tom="erro">falta {kz(divida)}</Etiqueta> : null}
              </td>
              <td className="px-3 py-3">
                <Etiqueta tom={a.estado === "activo" ? "ok" : "aviso"}>{a.estado}</Etiqueta>
              </td>
              <td className="px-3 py-3">
                <div className="flex justify-end gap-2">
                  <NeuButton className="px-2 py-1.5" onClick={() => editar(a)}>
                    <Pencil className="size-3.5" />
                  </NeuButton>
                  <NeuButton
                    className="px-2 py-1.5"
                    onClick={() => {
                      if (confirm(`Apagar ${a.nome}?`)) apagar.mutate(a.id);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </NeuButton>
                </div>
              </td>
            </Linha>
          );
        })}
        {!lista.length && !isLoading && (
          <Linha>
            <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
              Sem alunos registados.
            </td>
          </Linha>
        )}
      </Tabela>
    </AppShell>
  );
}
