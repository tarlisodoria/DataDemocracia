import { describe, expect, it } from "vitest";
import {
  buscarDeputados,
  destaquesDoDia,
  temasMaisVotados,
  ultimasVotacoes,
  divergencias,
  maisParecidos,
  votosPorTema,
  identificarRede,
  perfilDeputado,
  resumirDeputados,
  resumoAtuacao,
  resumoCota,
  rotuloTipo,
} from "./camara";

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

describe("perfilDeputado", () => {
  const arquivo = {
    coleta: "09/11/2026",
    deps: [
      [1, "Ana", "PT", "PA"],
      [2, "Bia", "PT", "SP"],
      [3, "Caio", "PT", "RJ"],
      [4, "Davi", "PL", "SP"],
    ] as [number, string, string, string][],
    vot: [
      ["v1", "2025-02-01", "Votação 1", "PL 1/2025", 1, []],
      ["v2", "2025-03-01", "Votação 2", "PL 2/2025", 2, []],
      ["v3", "2025-04-01", "Votação 3", "", null, []],
    ] as [string, string, string, string, number | null, number[]][],
    v: ["SSSN", "NSSN", "A.SS"],
  };

  it("conta tipos de voto e alinhamento com a maioria do partido", () => {
    const p = perfilDeputado(arquivo, 1)!;
    expect(p.tipos).toEqual({ sim: 1, nao: 1, abstencao: 1, obstrucao: 0 });
    // v1: colegas S,S -> maioria S, Ana S (alinha); v2: colegas S,S -> maioria S, Ana N (não alinha); v3: abstenção não entra
    expect(p.alinhamento).toEqual({ comMaioria: 1, base: 2 });
    expect(p.ultimos.map(u => u.id)).toEqual(["v3", "v2", "v1"]);
    expect(p.ultimos[0].voto).toBe("Abstenção");
  });

  it("ignora votações sem registro e devolve null para id desconhecido", () => {
    expect(perfilDeputado(arquivo, 2)!.ultimos.map(u => u.id)).toEqual([
      "v2",
      "v1",
    ]);
    expect(perfilDeputado(arquivo, 99)).toBeNull();
  });
});

describe("identificarRede", () => {
  it("reconhece redes pelo domínio e usa Site para o resto", () => {
    expect(identificarRede("https://www.instagram.com/fulano").nome).toBe(
      "Instagram"
    );
    expect(identificarRede("https://x.com/fulano").nome).toBe("X");
    expect(identificarRede("https://m.facebook.com/fulano").nome).toBe(
      "Facebook"
    );
    expect(identificarRede("https://fulano.com.br").nome).toBe("Site");
  });
});

describe("comparações do perfil", () => {
  const arq = {
    coleta: "x",
    deps: [
      [1, "Ana", "PT", "PA"],
      [2, "Bia", "PT", "SP"],
      [3, "Caio", "PT", "RJ"],
      [4, "Davi", "PL", "SP"],
    ] as [number, string, string, string][],
    vot: [
      ["v1", "2025-02-01", "Votação 1", "PL 1/2025", 1, [0]],
      ["v2", "2025-03-01", "Votação 2", "PL 2/2025", 2, [0, 1]],
      ["v3", "2025-04-01", "Votação 3", "PL 3/2025", 3, [1]],
    ] as [string, string, string, string, number | null, number[]][],
    temas: ["Saúde", "Educação"],
    v: ["SSSN", "NSSN", "SNNS"],
  };

  it("lista as votações em que o deputado contrariou a maioria da sigla", () => {
    const d = divergencias(arq, 0);
    // v2: colegas S,S e Ana N; v3: colegas N,N e Ana S. Mais recente primeiro.
    expect(d.map(x => x.id)).toEqual(["v3", "v2"]);
    expect(d[1]).toMatchObject({ voto: "Não", partidoSim: 2, partidoNao: 0 });
  });

  it("calcula % de Sim por tema para deputado, partido e Câmara", () => {
    const [saude] = votosPorTema(arq, 0, 1);
    expect(saude.tema).toBe("Saúde");
    expect(saude.votos).toBe(2);
    expect(saude.simDeputado).toBe(0.5);
    expect(saude.simPartido).toBe(1);
    expect(saude.simCamara).toBe(5 / 8);
  });

  it("ordena quem mais vota igual, exigindo votações em comum", () => {
    const p = maisParecidos(arq, 0, 3, 1);
    expect(p[0]).toMatchObject({
      nome: "Davi",
      concordancia: 2 / 3,
      emComum: 3,
    });
    expect(maisParecidos(arq, 0, 3, 10)).toEqual([]);
  });
});

describe("dados da home", () => {
  const arq = {
    coleta: "x",
    deps: [
      [1, "Ana", "PT", "PA"],
      [2, "Bia", "PL", "SP"],
    ] as [number, string, string, string][],
    vot: [
      ["v1", "2025-02-01", "Votação 1", "PL 1/2025", 1, [0]],
      ["v2", "2025-03-01", "Votação 2", "PL 2/2025", 2, [0, 1]],
    ] as [string, string, string, string, number | null, number[]][],
    temas: ["Saúde", "Educação"],
    v: ["SN", "SA"],
  };

  it("lista as votações mais recentes com placar", () => {
    const [v] = ultimasVotacoes(arq, 1);
    expect(v).toMatchObject({ id: "v2", sim: 1, nao: 0, outros: 1 });
  });

  it("ordena temas por número de votações", () => {
    expect(temasMaisVotados(arq)).toEqual([
      { tema: "Saúde", votacoes: 2 },
      { tema: "Educação", votacoes: 1 },
    ]);
  });

  it("escolhe índices distintos e estáveis no mesmo dia", () => {
    const a = destaquesDoDia(551, 3, 100);
    expect(new Set(a).size).toBe(3);
    expect(destaquesDoDia(551, 3, 100)).toEqual(a);
    expect(a.every(i => i >= 0 && i < 551)).toBe(true);
  });
});

describe("cota parlamentar", () => {
  const votos = {
    coleta: "",
    deps: [
      [1, "Ana", "PT", "PA"],
      [2, "Bia", "PL", "PA"],
      [3, "Caio", "PL", "PA"],
      [4, "Davi", "PL", "SP"],
    ] as [number, string, string, string][],
    v: [],
  };
  const mes = (valor: number, meses: number) =>
    Array.from({ length: 12 }, (_, i) => (i < meses ? valor : 0));
  const cota = {
    coleta: "",
    url: "",
    tipos: ["DIVULGAÇÃO DA ATIVIDADE PARLAMENTAR.", "PASSAGEM AÉREA - SIGEPA"],
    deps: {
      1: {
        t: 1200,
        n: 3,
        m: mes(100, 12),
        k: { 0: 900, 1: 300 },
        f: [["X", "1", 900]],
      },
      // Suplente com 3 meses: total menor, mas média mensal maior.
      2: { t: 900, n: 2, m: mes(300, 3), k: { 0: 900 }, f: [] },
      3: { t: 2400, n: 5, m: mes(200, 12), k: { 1: 2400 }, f: [] },
      4: { t: 99999, n: 1, m: mes(99999, 1), k: { 0: 99999 }, f: [] },
    },
  } as never;

  it("compara a média por mês com gasto à mediana do estado", () => {
    const r = resumoCota(cota, votos, 1)!;
    expect(r.meses).toBe(12);
    expect(r.mediaMensal).toBe(100);
    expect(r.uf).toEqual({
      sigla: "PA",
      mediana: 200,
      deputados: 3,
      posicao: 3,
    });
    expect(r.tipos[0]).toEqual({
      tipo: "Divulgação da atividade parlamentar",
      valor: 900,
      parte: 0.75,
    });
    expect(resumoCota(cota, votos, 2)!.uf.posicao).toBe(1);
    expect(resumoCota(cota, votos, 99)).toBeNull();
  });

  it("deixa os tipos legíveis", () => {
    expect(rotuloTipo("PASSAGEM AÉREA - SIGEPA")).toBe(
      "Passagem aérea - SIGEPA"
    );
    expect(
      rotuloTipo("HOSPEDAGEM ,EXCETO DO PARLAMENTAR NO DISTRITO FEDERAL.")
    ).toBe("Hospedagem, exceto do parlamentar no Distrito Federal");
  });
});

describe("resumoAtuacao", () => {
  const votos = {
    coleta: "",
    deps: [
      [1, "Ana", "PT", "PA"],
      [2, "Bia", "PL", "PA"],
      [3, "Caio", "PL", "SP"],
    ] as [number, string, string, string][],
    v: [],
  };
  const vazio = { o: [], a: {}, ex: [] };
  const atuacao = {
    coleta: "",
    sessoes: 100,
    orgaos: { CCJC: "Constituição e Justiça", X: "" },
    deps: {
      1: {
        p: 90,
        c: 10,
        o: [
          ["CCJC", "Presidente"],
          ["X", "Titular"],
        ],
        a: { PL: 3, PEC: 1, REQ: 5, RIC: 2, PRL: 99 },
        l1: 2,
        ex: [[7, "PL 1/2025", "Cria.", "Aguardando Parecer", "2025-03-01", 1]],
      },
      2: { ...vazio, p: 50, c: 30, l1: 0 },
      3: { ...vazio, p: 70, c: 20, l1: 6 },
      // Fora do arquivo de votações: não entra nas medianas.
      9: { ...vazio, p: 0, c: 0, l1: 100 },
    },
  } as never;

  it("resume presença, órgãos e proposições com a mediana da Câmara", () => {
    const r = resumoAtuacao(atuacao, votos, 1)!;
    expect(r.sessoes).toEqual({ presente: 90, total: 100, mediana: 70 });
    expect(r.reunioes).toEqual({ presente: 10, mediana: 20 });
    expect(r.orgaos[1]).toEqual({ sigla: "X", nome: "X", cargo: "Titular" });
    expect(r.projetos).toEqual({ total: 4, principal: 2, medianaPrincipal: 2 });
    expect(r.requerimentos).toBe(7);
    expect(r.exemplos[0].principal).toBe(true);
    expect(resumoAtuacao(atuacao, votos, 99)).toBeNull();
  });
});
