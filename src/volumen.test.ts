import { expect, test } from "vitest";
import { formatearVolumen, volumenTotal } from "./volumen";

test("sin registros el volumen es 0", () => {
  expect(volumenTotal([])).toBe(0);
});

test("3 series de 50 kg × 10 suman 1500 kg", () => {
  expect(volumenTotal([{ series: 3, repeticiones: 10, peso: 50 }])).toBe(1500);
});

test("suma el volumen de varios registros", () => {
  expect(
    volumenTotal([
      { series: 3, repeticiones: 10, peso: 50 },
      { series: 4, repeticiones: 8, peso: 82.5 },
      { series: 3, repeticiones: 10, peso: 0 },
    ]),
  ).toBe(1500 + 2640);
});

test("formatea con separador de miles y decimales es-AR", () => {
  expect(formatearVolumen(1500)).toBe("1.500 kg");
  expect(formatearVolumen(0)).toBe("0 kg");
  expect(formatearVolumen(1237.5)).toBe("1.237,5 kg");
});
