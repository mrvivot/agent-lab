type SerieConVolumen = { series: number; repeticiones: number; peso: number };

/** Volumen total en kg: suma de series × repeticiones × peso de cada registro. */
export function volumenTotal(registros: readonly SerieConVolumen[]): number {
  return registros.reduce(
    (total, r) => total + r.series * r.repeticiones * r.peso,
    0,
  );
}

const formato = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

/** Formatea un volumen en kg con separadores es-AR, p. ej. 1500 → "1.500 kg". */
export function formatearVolumen(kg: number): string {
  return `${formato.format(kg)} kg`;
}
