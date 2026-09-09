import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function NeuCard({
  children,
  className,
  gloss,
}: {
  children: ReactNode;
  className?: string;
  gloss?: boolean;
}) {
  return (
    <div className={cn("neu rounded-2xl p-5", gloss && "gloss", className)}>{children}</div>
  );
}

export function NeuButton({
  variant = "plain",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "plain" | "primary" | "gold" }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50",
        variant === "plain" && "neu-btn text-foreground",
        variant === "primary" && "neu-btn-primary",
        variant === "gold" && "neu-btn-gold",
        className,
      )}
    />
  );
}

export function Campo({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

export function NeuInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "neu-inset w-full rounded-xl px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40",
        className,
      )}
    />
  );
}

export function NeuSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "neu-inset w-full rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40",
        className,
      )}
    />
  );
}

export function Stat({
  titulo,
  valor,
  nota,
  icone,
  tom = "teal",
}: {
  titulo: string;
  valor: string;
  nota?: string;
  icone?: ReactNode;
  tom?: "teal" | "gold" | "neutro";
}) {
  return (
    <NeuCard gloss className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {titulo}
        </p>
        <p className="etched mt-2 font-display text-2xl font-bold text-foreground">{valor}</p>
        {nota ? <p className="mt-1 text-xs text-muted-foreground">{nota}</p> : null}
      </div>
      {icone ? (
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            tom === "teal" && "neu-btn-primary",
            tom === "gold" && "neu-btn-gold",
            tom === "neutro" && "neu-btn",
          )}
        >
          {icone}
        </span>
      ) : null}
    </NeuCard>
  );
}

export function PageHeader({
  titulo,
  descricao,
  accao,
}: {
  titulo: string;
  descricao: string;
  accao?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="etched font-display text-2xl font-bold text-foreground sm:text-3xl">
          {titulo}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{descricao}</p>
      </div>
      {accao}
    </div>
  );
}

export function Etiqueta({
  children,
  tom = "neutro",
}: {
  children: ReactNode;
  tom?: "neutro" | "ok" | "aviso" | "erro";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tom === "neutro" && "neu-sm text-muted-foreground",
        tom === "ok" && "bg-success/15 text-success",
        tom === "aviso" && "bg-warning/20 text-warning",
        tom === "erro" && "bg-destructive/15 text-destructive",
      )}
    >
      {children}
    </span>
  );
}

export function Tabela({ cabecalho, children }: { cabecalho: string[]; children: ReactNode }) {
  return (
    <div className="neu-inset overflow-x-auto rounded-2xl p-1.5">
      <table className="w-full min-w-[640px] border-separate border-spacing-y-1.5 text-sm">
        <thead>
          <tr>
            {cabecalho.map((c) => (
              <th
                key={c}
                className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Linha({ children }: { children: ReactNode }) {
  return <tr className="neu-sm [&>td]:bg-card/60 [&>td:first-child]:rounded-l-xl [&>td:last-child]:rounded-r-xl">{children}</tr>;
}
