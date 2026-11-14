import { expect, test } from "vitest";
import { suma } from "./suma";
test("suma", () => expect(suma(2, 3)).toBe(5));
