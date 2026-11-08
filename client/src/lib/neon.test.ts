import { describe, expect, it } from "vitest";
import { politicians } from "@/data/demo";
import { mergePublicPoliticians, type PoliticianRecord } from "./neon";

const record = (over: Partial<PoliticianRecord> = {}): PoliticianRecord => ({
  id: "1",
  slug: "nova-pessoa",
  name: "Nova Pessoa",
  role: "Deputada federal",
  party: null,
  state: null,
  city: null,
  period: null,
  portrait_url: null,
  source_url: null,
  source_name: null,
  source_updated_at: null,
  ...over,
});

describe("mergePublicPoliticians", () => {
  it("mantém o catálogo demonstrativo quando o banco não retorna registros", () => {
    expect(mergePublicPoliticians([])).toBe(politicians);
  });

  it("não inventa números para registros ainda não catalogados", () => {
    const [p] = mergePublicPoliticians([record()]);
    expect(p.party).toBe("Partido não informado");
    expect(p.promises).toBe(0);
    expect(p.stats).toEqual([]);
  });

  it("identifica candidaturas pelo cargo", () => {
    const [p] = mergePublicPoliticians([
      record({ role: "Candidata a governadora" }),
    ]);
    expect(p.type).toBe("candidatura");
  });

  it("usa a identidade do banco sobre o registro demonstrativo de mesmo slug", () => {
    const demo = politicians[0];
    const [p] = mergePublicPoliticians([
      record({ slug: demo.id, name: "Nome do banco", role: demo.role }),
    ]);
    expect(p.name).toBe("Nome do banco");
    expect(p.timeline).toBe(demo.timeline);
  });
});
