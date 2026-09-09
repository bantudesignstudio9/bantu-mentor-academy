export const kz = (value: number | null | undefined) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

export const num = (value: number | null | undefined) =>
  new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 0 }).format(Number(value ?? 0));

export const pct = (value: number) => `${Math.round(value)}%`;

export const dataCurta = (value: string | null | undefined) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const mesRef = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const mesLegivel = (ref: string) => {
  const [ano, mes] = ref.split("-");
  return `${MESES[Number(mes) - 1] ?? mes} ${ano}`;
};

export const hoje = () => new Date().toISOString().slice(0, 10);

export const POLOS = ["Caála", "Huambo", "Outro"];
