// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import SeriesForm, { type Registro } from "./SeriesForm";
import App from "./App";
import { CLAVE_REGISTROS } from "./registrosPersistencia";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

const lista = () => screen.getByRole("list", { name: "Registros" });

function agregarRegistro(ejercicio: string, series: string, repeticiones: string, peso: string) {
  fireEvent.change(screen.getByLabelText("Ejercicio"), { target: { value: ejercicio } });
  fireEvent.change(screen.getByLabelText("Series"), { target: { value: series } });
  fireEvent.change(screen.getByLabelText("Repeticiones"), { target: { value: repeticiones } });
  fireEvent.change(screen.getByLabelText("Peso (kg)"), { target: { value: peso } });
  fireEvent.click(screen.getByRole("button", { name: "Agregar" }));
}

const guardados = (): Registro[] => JSON.parse(localStorage.getItem(CLAVE_REGISTROS) ?? "null");

test("guarda la lista completa en localStorage cada vez que se agrega un registro", () => {
  render(<SeriesForm />);

  agregarRegistro("Sentadilla", "4", "8", "82.5");
  expect(guardados()).toEqual([
    { id: 1, ejercicio: "Sentadilla", series: 4, repeticiones: 8, peso: 82.5 },
  ]);

  agregarRegistro("Remo", "3", "12", "40");
  expect(guardados()).toEqual([
    { id: 1, ejercicio: "Sentadilla", series: 4, repeticiones: 8, peso: 82.5 },
    { id: 2, ejercicio: "Remo", series: 3, repeticiones: 12, peso: 40 },
  ]);
});

test("no guarda nada si el registro es inválido", () => {
  render(<SeriesForm />);
  agregarRegistro("", "3", "10", "50");
  expect(localStorage.getItem(CLAVE_REGISTROS)).toBeNull();
});

test("al montar carga y muestra los registros guardados en localStorage", () => {
  const previos: Registro[] = [
    { id: 1, ejercicio: "Press banca", series: 3, repeticiones: 10, peso: 60 },
    { id: 2, ejercicio: "Dominadas", series: 4, repeticiones: 6, peso: 0 },
  ];
  localStorage.setItem(CLAVE_REGISTROS, JSON.stringify(previos));

  render(<App />);

  const items = within(lista()).getAllByRole("listitem");
  expect(items).toHaveLength(2);
  expect(items[0].textContent).toContain("Press banca");
  expect(items[0].textContent).toContain("60 kg");
  expect(items[1].textContent).toContain("Dominadas");
});

test("los registros sobreviven a desmontar y volver a montar (recarga)", () => {
  const { unmount } = render(<App />);
  agregarRegistro("Peso muerto", "5", "5", "100");
  unmount();

  render(<App />);
  const items = within(lista()).getAllByRole("listitem");
  expect(items).toHaveLength(1);
  expect(items[0].textContent).toContain("Peso muerto");
});

test("tras cargar registros, los nuevos no repiten id y se agregan al final", () => {
  localStorage.setItem(
    CLAVE_REGISTROS,
    JSON.stringify([{ id: 7, ejercicio: "Curl", series: 3, repeticiones: 12, peso: 15 }]),
  );
  render(<SeriesForm />);
  agregarRegistro("Fondos", "3", "10", "0");

  expect(guardados().map((r) => r.id)).toEqual([7, 8]);
  expect(within(lista()).getAllByRole("listitem")).toHaveLength(2);
});

test("con localStorage vacío arranca con la lista vacía", () => {
  render(<App />);
  expect(within(lista()).queryAllByRole("listitem")).toHaveLength(0);
});

test.each([
  ["JSON inválido", "{esto no es json"],
  ["un objeto en vez de lista", JSON.stringify({ id: 1 })],
  ["null", "null"],
  ["elementos con formato incorrecto", JSON.stringify([{ id: 1, ejercicio: 42 }])],
  [
    "valores numéricos inválidos",
    JSON.stringify([{ id: 1, ejercicio: "Sentadilla", series: -3, repeticiones: 8, peso: 50 }]),
  ],
])("con datos corruptos (%s) arranca con la lista vacía sin romperse", (_, crudo) => {
  localStorage.setItem(CLAVE_REGISTROS, crudo);
  render(<App />);

  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Gym Tracker");
  expect(within(lista()).queryAllByRole("listitem")).toHaveLength(0);

  agregarRegistro("Sentadilla", "4", "8", "80");
  expect(within(lista()).getAllByRole("listitem")).toHaveLength(1);
  expect(guardados()).toHaveLength(1);
});
