const pesosFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const wholePesosFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPesos(priceCents: number): string {
  const formatter =
    priceCents % 100 === 0 ? wholePesosFormatter : pesosFormatter;
  return formatter.format(priceCents / 100);
}
