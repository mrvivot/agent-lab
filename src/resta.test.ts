import { expect, test } from "vitest";
import { resta } from "./resta";
test("resta(5, 3) devuelve 2", () => expect(resta(5, 3)).toBe(2));
test("resta(0, 4) devuelve -4", () => expect(resta(0, 4)).toBe(-4));
