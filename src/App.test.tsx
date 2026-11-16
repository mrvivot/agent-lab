// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

test("muestra el título Gym Tracker", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Gym Tracker");
});

test("muestra el subtítulo debajo del título", () => {
  render(<App />);
  const heading = screen.getByRole("heading", { level: 1 });
  const subtitle = screen.getByText("Registrá tus entrenamientos");
  expect(heading.nextElementSibling).toBe(subtitle);
});
