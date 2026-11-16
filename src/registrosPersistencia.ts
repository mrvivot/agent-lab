import type { Registro } from "./SeriesForm";

export const CLAVE_REGISTROS = "gym-tracker:registros";

function esNumeroValido(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isFinite(valor) && valor >= 0;
}

function esRegistro(valor: unknown): valor is Registro {
  if (typeof valor !== "object" || valor === null) return false;
  const r = valor as Record<string, unknown>;
  return (
    esNumeroValido(r.id) &&
    Number.isInteger(r.id) &&
    typeof r.ejercicio === "string" &&
    r.ejercicio.trim() !== "" &&
    esNumeroValido(r.series) &&
    Number.isInteger(r.series) &&
    esNumeroValido(r.repeticiones) &&
    Number.isInteger(r.repeticiones) &&
    esNumeroValido(r.peso)
  );
}

/**
 * Lee los registros guardados. Si no hay nada, o los datos están corruptos
 * o con un formato inesperado, devuelve una lista vacía.
 */
export function cargarRegistros(): Registro[] {
  try {
    const crudo = window.localStorage.getItem(CLAVE_REGISTROS);
    if (crudo === null) return [];
    const datos: unknown = JSON.parse(crudo);
    if (!Array.isArray(datos) || !datos.every(esRegistro)) return [];
    return datos;
  } catch {
    return [];
  }
}

/** Guarda la lista completa de registros. Los errores de escritura se ignoran. */
export function guardarRegistros(registros: Registro[]): void {
  try {
    window.localStorage.setItem(CLAVE_REGISTROS, JSON.stringify(registros));
  } catch {
    // localStorage no disponible o lleno: la app sigue funcionando en memoria.
  }
}
