import { describe, expect, it } from "vitest";
import { buscarDeputados, resumirDeputados } from "./camara";

const dados = {
  coleta: "03/11/2026",
  deps: [
    [1, "Ana Lúcia", "PT", "PA"],
    [2, "Bruno Melo", "PL", "SP"],
  ] as [number, string, string, string][],
  v: ["SN", "S.", "AO"],
};

describe("resumirDeputados", () => {
  it("conta votos registrados, sem registro e Sim por deputado", () => {
    const [ana, bruno] = resumirDeputados(dados);
    expect(ana).toMatchObject({ registrados: 3, semRegistro: 0, sim: 2 });
    expect(bruno).toMatchObject({ registrados: 2, semRegistro: 1, sim: 0 });
  });
});

describe("buscarDeputados", () => {
  const lista = resumirDeputados(dados);
  it("ignora acento e maiúsculas e busca por partido ou UF", () => {
    expect(buscarDeputados(lista, "lucia").map(d => d.id)).toEqual([1]);
    expect(buscarDeputados(lista, "sp").map(d => d.id)).toEqual([2]);
  });
  it("não devolve nada com termo vazio", () => {
    expect(buscarDeputados(lista, "  ")).toEqual([]);
  });
});
