import { expect, test } from "vitest";
import { multiplica } from "./multiplica";
test("multiplica(3, 4) devuelve 12", () => expect(multiplica(3, 4)).toBe(12));
test("multiplica(5, 0) devuelve 0", () => expect(multiplica(5, 0)).toBe(0));
