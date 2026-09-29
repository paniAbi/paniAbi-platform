const pesosFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export function formatPesos(priceCents: number): string {
  return pesosFormatter.format(priceCents / 100);
}
