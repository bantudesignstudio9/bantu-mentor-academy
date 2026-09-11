import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Pencil, X, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  Campo,
  Etiqueta,
  NeuButton,
  NeuCard,
  NeuInput,
  NeuSelect,
  PageHeader,
} from "@/components/neu";
import {
  useApagar,
  useCursos,
  useGuardar,
  useProgramas,
  type Curso,
  type Programa,
} from "@/lib/data";
import { kz } from "@/lib/format";

export const Route = createFileRoute("/programas")({
  head: () => ({
    meta: [
      { title: "Programas e cursos — Bantu Mentor Academy" },
      {
        name: "description",
        content:
          "Crie e edite os programas de formação da BMA e os cursos ou disciplinas de cada nível.",
      },
      { property: "og:title", content: "Programas e cursos — Bantu Mentor Academy" },
      {
        property: "og:description",
        content: "Gestão dos programas Your Voice Matters e Reforço Escolar.",
      },
    ],
  }),
  component: Programas,
});

const programaVazio: Partial<Programa> = { nome: "", descricao: "", cor: "teal", activo: true };
const cursoVazio: Partial<Curso> = { nome: "", nivel: "", propina_padrao: 0, activo: true };

function Programas() {
  const { data: programas = [] } = useProgramas();
  const { data: cursos = [] } = useCursos();
  const guardarPrograma = useGuardar("programas", ["programas"]);
  const apagarPrograma = useApagar("programas", ["programas", "cursos"]);
  const guardarCurso = useGuardar("cursos", ["cursos"]);
  const apagarCurso = useApagar("cursos", ["cursos"]);

  const [formPrograma, setFormPrograma] = useState<Partial<Programa>>(programaVazio);
  const [abertoPrograma, setAbertoPrograma] = useState(false);
  const [formCurso, setFormCurso] = useState<Partial<Curso>>(cursoVazio);
  const [cursoPara, setCursoPara] = useState<string | null>(null);

  const submeterPrograma = (e: React.FormEvent) => {
    e.preventDefault();
    guardarPrograma.mutate(
      { ...formPrograma, ordem: Number(formPrograma.ordem) || programas.length + 1 },
      {
        onSuccess: () => {
          toast.success("Programa guardado");
          setFormPrograma(programaVazio);
          setAbertoPrograma(false);
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  const submeterCurso = (e: React.FormEvent) => {
    e.preventDefault();
    guardarCurso.mutate(
      {
        ...formCurso,
        programa_id: cursoPara,
        nivel: formCurso.nivel || null,
        propina_padrao: Number(formCurso.propina_padrao) || 0,
      },
      {
        onSuccess: () => {
          toast.success("Curso guardado");
          setFormCurso(cursoVazio);
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  return (
    <AppShell>
      <PageHeader
        titulo="Programas e cursos"
        descricao="Defina os programas da BMA e os cursos ou disciplinas de cada nível. Tudo o que criar aqui fica disponível na inscrição de alunos."
        accao={
          <NeuButton
            variant="primary"
            onClick={() => {
              setFormPrograma(programaVazio);
              setAbertoPrograma((v) => !v);
            }}
          >
            {abertoPrograma ? <X className="size-4" /> : <Plus className="size-4" />}
            {abertoPrograma ? "Fechar" : "Novo programa"}
          </NeuButton>
        }
      />

      {abertoPrograma && (
        <NeuCard gloss className="mb-6">
          <form onSubmit={submeterPrograma} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Campo label="Nome do programa">
              <NeuInput
                required
                value={String(formPrograma.nome ?? "")}
                onChange={(e) => setFormPrograma({ ...formPrograma, nome: e.target.value })}
              />
            </Campo>
            <Campo label="Descrição" className="sm:col-span-2">
              <NeuInput
                value={String(formPrograma.descricao ?? "")}
                onChange={(e) => setFormPrograma({ ...formPrograma, descricao: e.target.value })}
              />
            </Campo>
            <Campo label="Destaque">
              <NeuSelect
                value={String(formPrograma.cor ?? "teal")}
                onChange={(e) => setFormPrograma({ ...formPrograma, cor: e.target.value })}
              >
                <option value="teal">Teal</option>
                <option value="gold">Ouro</option>
              </NeuSelect>
            </Campo>
            <div className="flex items-end gap-3">
              <NeuButton variant="gold" type="submit" disabled={guardarPrograma.isPending}>
                Guardar
              </NeuButton>
            </div>
          </form>
        </NeuCard>
      )}

      <div className="grid gap-5">
        {programas.map((p) => {
          const lista = cursos.filter((c) => c.programa_id === p.id);
          const niveis = [...new Set(lista.map((c) => c.nivel || "Geral"))];
          return (
            <NeuCard key={p.id} gloss>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="etched font-display text-xl font-bold">{p.nome}</h2>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    {p.descricao || "Sem descrição."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Etiqueta tom={p.activo ? "ok" : "aviso"}>
                    {p.activo ? "activo" : "inactivo"}
                  </Etiqueta>
                  <Etiqueta>{lista.length} curso(s)</Etiqueta>
                  <NeuButton
                    className="px-2 py-1.5"
                    onClick={() => {
                      setFormPrograma({ ...p });
                      setAbertoPrograma(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </NeuButton>
                  <NeuButton
                    className="px-2 py-1.5"
                    onClick={() => {
                      if (confirm(`Apagar o programa ${p.nome} e os seus cursos?`))
                        apagarPrograma.mutate(p.id);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </NeuButton>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {niveis.map((nivel) => (
                  <div key={nivel} className="neu-inset rounded-2xl p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {nivel}
                    </p>
                    <ul className="grid gap-2">
                      {lista
                        .filter((c) => (c.nivel || "Geral") === nivel)
                        .map((c) => (
                          <li
                            key={c.id}
                            className="neu-sm flex items-center justify-between gap-2 rounded-xl bg-card/60 px-3 py-2 text-sm"
                          >
                            <span className="flex items-center gap-2 font-semibold">
                              <BookOpen className="size-3.5 text-primary" />
                              {c.nome}
                            </span>
                            <span className="flex items-center gap-2">
                              {c.propina_padrao > 0 ? (
                                <Etiqueta>{kz(c.propina_padrao)}</Etiqueta>
                              ) : null}
                              <button
                                type="button"
                                aria-label={`Editar ${c.nome}`}
                                onClick={() => {
                                  setCursoPara(p.id);
                                  setFormCurso({ ...c });
                                }}
                              >
                                <Pencil className="size-3.5 text-muted-foreground" />
                              </button>
                              <button
                                type="button"
                                aria-label={`Apagar ${c.nome}`}
                                onClick={() => {
                                  if (confirm(`Apagar ${c.nome}?`)) apagarCurso.mutate(c.id);
                                }}
                              >
                                <Trash2 className="size-3.5 text-muted-foreground" />
                              </button>
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>

              {cursoPara === p.id ? (
                <form
                  onSubmit={submeterCurso}
                  className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                  <Campo label="Curso / disciplina">
                    <NeuInput
                      required
                      value={String(formCurso.nome ?? "")}
                      onChange={(e) => setFormCurso({ ...formCurso, nome: e.target.value })}
                    />
                  </Campo>
                  <Campo label="Nível (opcional)">
                    <NeuInput
                      placeholder="Primário, Iº ciclo…"
                      value={String(formCurso.nivel ?? "")}
                      onChange={(e) => setFormCurso({ ...formCurso, nivel: e.target.value })}
                    />
                  </Campo>
                  <Campo label="Propina sugerida (Kz)">
                    <NeuInput
                      type="number"
                      value={String(formCurso.propina_padrao ?? 0)}
                      onChange={(e) =>
                        setFormCurso({ ...formCurso, propina_padrao: Number(e.target.value) })
                      }
                    />
                  </Campo>
                  <div className="flex items-end gap-2">
                    <NeuButton variant="gold" type="submit" disabled={guardarCurso.isPending}>
                      Guardar
                    </NeuButton>
                    <NeuButton
                      type="button"
                      onClick={() => {
                        setCursoPara(null);
                        setFormCurso(cursoVazio);
                      }}
                    >
                      Fechar
                    </NeuButton>
                  </div>
                </form>
              ) : (
                <NeuButton
                  className="mt-4"
                  onClick={() => {
                    setCursoPara(p.id);
                    setFormCurso(cursoVazio);
                  }}
                >
                  <Plus className="size-4" /> Adicionar curso
                </NeuButton>
              )}
            </NeuCard>
          );
        })}
        {!programas.length && (
          <NeuCard className="text-center text-sm text-muted-foreground">
            Ainda não há programas. Comece por criar um.
          </NeuCard>
        )}
      </div>
    </AppShell>
  );
}
