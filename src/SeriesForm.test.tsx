// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import SeriesForm from "./SeriesForm";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function completar(valores: {
  ejercicio?: string;
  series?: string;
  repeticiones?: string;
  peso?: string;
}) {
  const campos: Array<[string, string | undefined]> = [
    ["Ejercicio", valores.ejercicio],
    ["Series", valores.series],
    ["Repeticiones", valores.repeticiones],
    ["Peso (kg)", valores.peso],
  ];
  for (const [label, valor] of campos) {
    if (valor !== undefined) {
      fireEvent.change(screen.getByLabelText(label), { target: { value: valor } });
    }
  }
}

const agregar = () => fireEvent.click(screen.getByRole("button", { name: "Agregar" }));
const lista = () => screen.getByRole("list", { name: "Registros" });

test("agrega un registro válido a la lista con todos sus datos", () => {
  render(<SeriesForm />);
  completar({ ejercicio: "Sentadilla", series: "4", repeticiones: "8", peso: "82.5" });
  agregar();

  const items = within(lista()).getAllByRole("listitem");
  expect(items).toHaveLength(1);
  expect(items[0].textContent).toContain("Sentadilla");
  expect(items[0].textContent).toContain("4 series");
  expect(items[0].textContent).toContain("8 reps");
  expect(items[0].textContent).toContain("82.5 kg");
  expect(screen.queryByRole("alert")).toBeNull();
});

test("acepta 0 como valor válido", () => {
  render(<SeriesForm />);
  completar({ ejercicio: "Dominadas", series: "3", repeticiones: "10", peso: "0" });
  agregar();
  expect(within(lista()).getAllByRole("listitem")).toHaveLength(1);
});

test("muestra error y no agrega si el ejercicio está vacío", () => {
  render(<SeriesForm />);
  completar({ ejercicio: "   ", series: "3", repeticiones: "10", peso: "50" });
  agregar();
  expect(screen.getByRole("alert").textContent).toMatch(/ejercicio/i);
  expect(within(lista()).queryAllByRole("listitem")).toHaveLength(0);
});

test.each([
  ["series vacío", { series: "", repeticiones: "10", peso: "50" }],
  ["series negativo", { series: "-1", repeticiones: "10", peso: "50" }],
  ["series no entero", { series: "2.5", repeticiones: "10", peso: "50" }],
  ["repeticiones no entero", { series: "3", repeticiones: "1.5", peso: "50" }],
  ["peso negativo", { series: "3", repeticiones: "10", peso: "-5" }],
  ["peso vacío", { series: "3", repeticiones: "10", peso: "" }],
])("muestra error y no agrega con %s", (_, valores) => {
  render(<SeriesForm />);
  completar({ ejercicio: "Press banca", ...valores });
  agregar();
  expect(screen.getByRole("alert")).toBeTruthy();
  expect(within(lista()).queryAllByRole("listitem")).toHaveLength(0);
});

test("limpia el formulario después de agregar", () => {
  render(<SeriesForm />);
  completar({ ejercicio: "Peso muerto", series: "5", repeticiones: "5", peso: "100" });
  agregar();

  for (const label of ["Ejercicio", "Series", "Repeticiones", "Peso (kg)"]) {
    expect((screen.getByLabelText(label) as HTMLInputElement).value).toBe("");
  }
});

test("el error desaparece tras un alta correcta", () => {
  render(<SeriesForm />);
  agregar();
  expect(screen.getByRole("alert")).toBeTruthy();
  completar({ ejercicio: "Remo", series: "3", repeticiones: "12", peso: "40" });
  agregar();
  expect(screen.queryByRole("alert")).toBeNull();
  expect(within(lista()).getAllByRole("listitem")).toHaveLength(1);
});

const volumen = () => screen.getByLabelText("Volumen total");

test("muestra el volumen total debajo de la lista (3 × 10 × 50 kg = 1.500 kg)", () => {
  render(<SeriesForm />);
  expect(volumen().textContent).toContain("0 kg");
  completar({ ejercicio: "Sentadilla", series: "3", repeticiones: "10", peso: "50" });
  agregar();
  expect(volumen().textContent).toContain("1.500 kg");
});

test("el volumen total se actualiza al agregar una serie", () => {
  render(<SeriesForm />);
  completar({ ejercicio: "Sentadilla", series: "3", repeticiones: "10", peso: "50" });
  agregar();
  completar({ ejercicio: "Press banca", series: "2", repeticiones: "5", peso: "60" });
  agregar();
  expect(volumen().textContent).toContain("2.100 kg");
});
