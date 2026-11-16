import { FormEvent, useState } from "react";

export type Registro = {
  id: number;
  ejercicio: string;
  series: number;
  repeticiones: number;
  peso: number;
};

const camposVacios = { ejercicio: "", series: "", repeticiones: "", peso: "" };

function parseNumero(valor: string, entero: boolean): number | null {
  if (valor.trim() === "") return null;
  const n = Number(valor);
  if (!Number.isFinite(n) || n < 0) return null;
  if (entero && !Number.isInteger(n)) return null;
  return n;
}

export default function SeriesForm() {
  const [campos, setCampos] = useState(camposVacios);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [siguienteId, setSiguienteId] = useState(1);

  const actualizar = (campo: keyof typeof camposVacios) => (valor: string) =>
    setCampos((prev) => ({ ...prev, [campo]: valor }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ejercicio = campos.ejercicio.trim();
    const series = parseNumero(campos.series, true);
    const repeticiones = parseNumero(campos.repeticiones, true);
    const peso = parseNumero(campos.peso, false);

    if (ejercicio === "") {
      setError("El ejercicio no puede estar vacío.");
      return;
    }
    if (series === null || repeticiones === null || peso === null) {
      setError(
        "Series y repeticiones deben ser enteros ≥ 0 y el peso un número ≥ 0.",
      );
      return;
    }

    setRegistros((prev) => [
      ...prev,
      { id: siguienteId, ejercicio, series, repeticiones, peso },
    ]);
    setSiguienteId((id) => id + 1);
    setCampos(camposVacios);
    setError(null);
  };

  const inputClass =
    "rounded bg-slate-800 border border-slate-600 px-2 py-1 text-slate-100";

  return (
    <section className="mt-8 w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Registrar serie"
        className="flex flex-col gap-3"
      >
        <label className="flex flex-col gap-1">
          Ejercicio
          <input
            type="text"
            value={campos.ejercicio}
            onChange={(e) => actualizar("ejercicio")(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          Series
          <input
            type="number"
            min={0}
            step={1}
            value={campos.series}
            onChange={(e) => actualizar("series")(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          Repeticiones
          <input
            type="number"
            min={0}
            step={1}
            value={campos.repeticiones}
            onChange={(e) => actualizar("repeticiones")(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          Peso (kg)
          <input
            type="number"
            min={0}
            step="any"
            value={campos.peso}
            onChange={(e) => actualizar("peso")(e.target.value)}
            className={inputClass}
          />
        </label>
        {error && (
          <p role="alert" className="text-red-400">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="rounded bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500"
        >
          Agregar
        </button>
      </form>

      <ul aria-label="Registros" className="mt-6 flex flex-col gap-2">
        {registros.map((r) => (
          <li key={r.id} className="rounded bg-slate-800 px-3 py-2">
            {r.ejercicio} — {r.series} series × {r.repeticiones} reps — {r.peso} kg
          </li>
        ))}
      </ul>
    </section>
  );
}
