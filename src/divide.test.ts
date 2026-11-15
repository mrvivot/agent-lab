import { expect, test } from "vitest";
import { divide } from "./divide";
test("divide(10, 2) devuelve 5", () => expect(divide(10, 2)).toBe(5));
test("divide(1, 0) lanza un Error", () => expect(() => divide(1, 0)).toThrow(Error));
