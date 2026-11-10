import { describe, expect, it } from "vitest";
import { politicians } from "@/data/demo";
import {
  fotoOficial,
  mergePublicPoliticians,
  type PoliticianRecord,
} from "./neon";

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

describe("fotoOficial", () => {
  it("aceita só fotos da Câmara e do Senado", () => {
    expect(
      fotoOficial("https://www.camara.leg.br/internet/deputado/bandep/1.jpg")
    ).not.toBeNull();
    expect(
      fotoOficial("https://www.senado.leg.br/senadores/img/fotos/1.jpg")
    ).not.toBeNull();
    expect(fotoOficial("https://images.unsplash.com/photo-1")).toBeNull();
    expect(fotoOficial("https://camara.leg.br.exemplo.com/x.jpg")).toBeNull();
    expect(fotoOficial(null)).toBeNull();
  });

  it("descarta foto de banco de imagens vinda do catálogo", () => {
    const [p] = mergePublicPoliticians([
      record({ portrait_url: "https://images.unsplash.com/photo-1" }),
    ]);
    expect(p.portrait.startsWith("data:image/svg+xml")).toBe(true);
  });
});
