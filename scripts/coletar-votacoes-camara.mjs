#!/usr/bin/env node
// Coleta as votações nominais do Plenário da Câmara em um ano e gera o arquivo
// compacto usado pelo painel em client/public/explorar/.
//
// Uso: node scripts/coletar-votacoes-camara.mjs [ano]
// Requer Node 18+ (fetch nativo). Leva alguns minutos: são ~2 mil chamadas à API.

import { writeFile } from "node:fs/promises";

const API = "https://dadosabertos.camara.leg.br/api/v2";
const ANO = Number(process.argv[2] ?? 2025);
const SAIDA = `client/public/explorar/dados/votacoes-plenario-${ANO}.json`;
const PLENARIO = 180;
const CONCORRENCIA = 6;
// Votações com poucos votos registrados são simbólicas ou têm só o voto do presidente.
const MIN_VOTOS_NOMINAL = 50;

const espera = ms => new Promise(r => setTimeout(r, ms));

async function get(caminho, tentativas = 4) {
  for (let t = 1; t <= tentativas; t++) {
    try {
      const r = await fetch(API + caminho, {
        headers: { Accept: "application/json" },
      });
      if (r.status === 429 || r.status >= 500)
        throw new Error(`HTTP ${r.status}`);
      if (!r.ok) return null; // 404 etc.: o recurso não existe para esta votação
      return (await r.json()).dados;
    } catch (err) {
      if (t === tentativas) throw new Error(`${caminho}: ${err.message}`);
      await espera(1500 * t);
    }
  }
}

async function emLotes(itens, fn) {
  const saida = new Array(itens.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: CONCORRENCIA }, async () => {
      while (i < itens.length) {
        const k = i++;
        saida[k] = await fn(itens[k], k);
      }
    })
  );
  return saida;
}

// A API limita o intervalo de datas por consulta; consultamos por trimestre.
async function listarVotacoes() {
  const trimestres = [
    ["01-01", "03-31"],
    ["04-01", "06-30"],
    ["07-01", "09-30"],
    ["10-01", "12-31"],
  ];
  const todas = [];
  for (const [ini, fim] of trimestres) {
    for (let pagina = 1; ; pagina++) {
      const lote = await get(
        `/votacoes?idOrgao=${PLENARIO}&dataInicio=${ANO}-${ini}&dataFim=${ANO}-${fim}&itens=100&pagina=${pagina}`
      );
      if (!lote?.length) break;
      todas.push(...lote);
      if (lote.length < 100) break; // a API devolve no máximo 100 por página
    }
  }
  return todas;
}

const limpa = s => (s ?? "").replace(/\s+/g, " ").trim();
const CODIGO = {
  Sim: "S",
  Não: "N",
  Abstenção: "A",
  Obstrução: "O",
  "Artigo 17": "R",
};

async function main() {
  const votacoes = await listarVotacoes();
  console.log(`${votacoes.length} votações no Plenário em ${ANO}`);

  const votos = await emLotes(votacoes, async (v, k) => {
    if (k % 100 === 0) console.log(`votos ${k}/${votacoes.length}`);
    return (await get(`/votacoes/${v.id}/votos`)) ?? [];
  });
  const nominais = votacoes
    .map((v, i) => ({ v, votos: votos[i] }))
    .filter(x => x.votos.length > MIN_VOTOS_NOMINAL);
  console.log(`${nominais.length} votações nominais`);

  const detalhes = await emLotes(nominais, x => get(`/votacoes/${x.v.id}`));
  nominais.forEach((x, i) => (x.det = detalhes[i]));
  nominais.sort((a, b) =>
    a.det.dataHoraRegistro.localeCompare(b.det.dataHoraRegistro)
  );

  const proposicoes = [
    ...new Set(
      nominais.map(x => x.det.proposicoesAfetadas?.[0]?.id).filter(Boolean)
    ),
  ];
  const temasPorProp = {};
  await emLotes(proposicoes, async id => {
    temasPorProp[id] = ((await get(`/proposicoes/${id}/temas`)) ?? []).map(
      t => t.tema
    );
  });

  // Partido e UF: o último registro do deputado no ano.
  const deputados = new Map();
  for (const x of nominais)
    for (const v of x.votos) {
      const d = v.deputado_;
      deputados.set(d.id, [
        d.id,
        d.nome,
        d.siglaPartido || "S.PART.",
        d.siglaUf,
      ]);
    }
  const deps = [...deputados.values()].sort((a, b) =>
    a[1].localeCompare(b[1], "pt")
  );
  const indiceDep = new Map(deps.map((d, i) => [d[0], i]));

  const temas = [];
  const indiceTema = new Map();
  const vot = [];
  const v = [];
  for (const x of nominais) {
    const d = x.det;
    const p = d.proposicoesAfetadas?.[0];
    const rotulo = p ? `${p.siglaTipo} ${p.numero}/${p.ano}` : "";
    const idsTema = p
      ? (temasPorProp[p.id] ?? []).map(t => {
          if (!indiceTema.has(t)) indiceTema.set(t, temas.push(t) - 1);
          return indiceTema.get(t);
        })
      : [];
    const abertura = limpa(d.descUltimaAberturaVotacao);
    const resultado = limpa(d.descricao);
    let oQue =
      abertura.length > 30
        ? `${abertura} → ${resultado}`
        : resultado + (abertura ? ` (${abertura})` : "");
    if (oQue.length > 260) oQue = oQue.slice(0, 257) + "…";
    vot.push([d.id, d.data, oQue, rotulo, p?.id ?? null, idsTema]);

    // Um caractere por deputado: S, N, A, O, R ou "." (sem registro nesta votação).
    const linha = new Array(deps.length).fill(".");
    for (const voto of x.votos) {
      const c = CODIGO[voto.tipoVoto];
      if (c) linha[indiceDep.get(voto.deputado_.id)] = c;
    }
    v.push(linha.join(""));
  }

  const dados = {
    fonte: "Câmara dos Deputados, API Dados Abertos v2",
    orgao: `Plenário (idOrgao=${PLENARIO})`,
    periodo: `${ANO}-01-01/${ANO}-12-31`,
    coleta: new Date().toLocaleDateString("pt-BR"),
    deps,
    vot,
    temas,
    v,
  };
  await writeFile(SAIDA, JSON.stringify(dados));
  console.log(
    `${SAIDA}: ${deps.length} deputados, ${vot.length} votações, ${temas.length} temas`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
