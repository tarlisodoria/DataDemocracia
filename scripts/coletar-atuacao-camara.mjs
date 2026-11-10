#!/usr/bin/env node
// Resume a atuação de cada deputado no ano a partir dos arquivos em massa da Câmara:
// presença em sessões e reuniões, comissões e cargos, e proposições apresentadas.
//
// Uso: node scripts/coletar-atuacao-camara.mjs [ano]
// São cinco downloads (o maior, de proposições, tem ~160 MB); nenhuma chamada por deputado.
// Precisa de memória: no workflow roda com --max-old-space-size=6144.

import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const ARQUIVOS = "https://dadosabertos.camara.leg.br/arquivos";

// Sessões do Plenário; os demais tipos de evento são reuniões de comissões e afins.
const PLENARIO = new Set([
  "Sessão Deliberativa",
  "Sessão Não Deliberativa Solene",
  "Sessão Preparatória - Eleição",
  "Comissão Geral",
  "Teste do Painel Eletrônico",
]);
// Projetos de lei e de emenda: os exemplos do perfil e a contagem de autoria principal.
const LEIS = new Set(["PL", "PLP", "PEC", "PDL"]);
// Tipos contados no perfil. Pareceres, emendas e requerimentos de rotina (PRL, EMC, RPD...)
// ficam de fora: dependem do cargo (relator, Mesa, liderança) e inflariam a comparação.
const CONTADOS = new Set([...LEIS, "REQ", "RIC", "INC"]);
const ORDEM_CARGO = c =>
  /^Presidente|^Coordenador|^Relator/.test(c)
    ? 0
    : /Vice|Secret|Procurador|Corregedor|Ouvidor/.test(c)
      ? 1
      : c === "Titular"
        ? 2
        : 3;

export function resumirAtuacao(
  { eventos, presencas, orgaos, autores, proposicoes },
  ano
) {
  const deps = {};
  const nomesOrgaos = {};
  const dep = id => (deps[id] ??= { p: 0, c: 0, o: [], a: {}, l1: 0, ex: [] });

  // Presença: só sessões deliberativas encerradas contam para o Plenário.
  const tipoEvento = new Map(eventos.map(e => [e.id, e]));
  const sessoes = new Set();
  const vistas = new Set();
  for (const pr of presencas) {
    const e = tipoEvento.get(pr.idEvento);
    if (!e || e.situacao?.startsWith("Cancelada")) continue;
    const chave = `${pr.idDeputado}:${pr.idEvento}`;
    if (vistas.has(chave)) continue;
    vistas.add(chave);
    if (e.descricaoTipo === "Sessão Deliberativa") {
      sessoes.add(e.id);
      dep(pr.idDeputado).p++;
    } else if (!PLENARIO.has(e.descricaoTipo)) dep(pr.idDeputado).c++;
  }

  // Órgãos com participação em algum momento do ano; um por sigla, com o cargo mais alto.
  const inicioAno = `${ano}-01-01`;
  const fimAno = `${ano}-12-31`;
  const porDepOrgao = new Map();
  for (const o of orgaos) {
    if (o.dataInicio > fimAno || (o.dataFim && o.dataFim < inicioAno)) continue;
    const id = Number(o.uriDeputado.split("/").pop());
    const chave = `${id}:${o.siglaOrgao}`;
    const atual = porDepOrgao.get(chave);
    if (!atual || ORDEM_CARGO(o.cargo) < ORDEM_CARGO(atual[1]))
      porDepOrgao.set(chave, [o.siglaOrgao, o.cargo]);
    nomesOrgaos[o.siglaOrgao] = o.nomePublicacaoOrgao;
  }
  for (const [chave, o] of porDepOrgao) dep(chave.split(":")[0]).o.push(o);
  for (const d of Object.values(deps))
    d.o.sort((a, b) => ORDEM_CARGO(a[1]) - ORDEM_CARGO(b[1]));

  // Proposições apresentadas no ano em que o deputado é proponente (autor ou coautor).
  // O arquivo do ano inclui proposições antigas que tramitaram nele: filtra pela data.
  const props = new Map(
    proposicoes
      .filter(p => p.dataApresentacao?.startsWith(String(ano)))
      .map(p => [p.id, p])
  );
  for (const a of autores) {
    if (a.codTipoAutor !== 10000 || a.proponente !== "1") continue;
    const p = props.get(a.idProposicao);
    if (!p) continue;
    if (!CONTADOS.has(p.siglaTipo)) continue;
    const d = dep(a.idDeputadoAutor);
    d.a[p.siglaTipo] = (d.a[p.siglaTipo] ?? 0) + 1;
    if (!LEIS.has(p.siglaTipo)) continue;
    const principal = a.ordemAssinatura === "1" ? 1 : 0;
    d.l1 += principal;
    d.ex.push([
      p.id,
      `${p.siglaTipo} ${p.numero}/${p.ano}`,
      p.ementa.length > 130 ? p.ementa.slice(0, 127) + "…" : p.ementa,
      p.ultimoStatus?.descricaoSituacao ?? "",
      p.dataApresentacao.slice(0, 10),
      principal,
    ]);
  }
  for (const d of Object.values(deps)) {
    // Primeiro as de autoria principal, depois as mais recentes.
    d.ex.sort((x, y) => y[5] - x[5] || y[4].localeCompare(x[4]));
    d.ex = d.ex.slice(0, 3);
  }

  return { sessoes: sessoes.size, orgaos: nomesOrgaos, deps };
}

// Um arquivo por vez e só com os campos usados: o de proposições passa de 160 MB.
async function baixar(caminho, campos) {
  for (let t = 1; ; t++) {
    try {
      const r = await fetch(`${ARQUIVOS}/${caminho}`, {
        signal: AbortSignal.timeout(300_000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const { dados } = await r.json();
      return campos
        ? dados.map(x => Object.fromEntries(campos.map(k => [k, x[k]])))
        : dados;
    } catch (err) {
      if (t === 5) throw new Error(`${caminho}: ${err.message}`);
      await new Promise(ok => setTimeout(ok, 15_000 * t));
    }
  }
}

async function main() {
  const ano = Number(process.argv[2] ?? 2025);
  // Legislatura 57: 2023 a 2027.
  const legislatura = 57 + Math.floor((ano - 2023) / 4);
  const eventos = await baixar(`eventos/json/eventos-${ano}.json`, [
    "id",
    "descricaoTipo",
    "situacao",
  ]);
  const presencas = await baixar(
    `eventosPresencaDeputados/json/eventosPresencaDeputados-${ano}.json`,
    ["idEvento", "idDeputado"]
  );
  const orgaos = await baixar(
    `orgaosDeputados/json/orgaosDeputados-L${legislatura}.json`
  );
  const autores = await baixar(
    `proposicoesAutores/json/proposicoesAutores-${ano}.json`,
    [
      "idProposicao",
      "codTipoAutor",
      "idDeputadoAutor",
      "proponente",
      "ordemAssinatura",
    ]
  );
  const proposicoes = await baixar(`proposicoes/json/proposicoes-${ano}.json`, [
    "id",
    "siglaTipo",
    "numero",
    "ano",
    "ementa",
    "dataApresentacao",
    "ultimoStatus",
  ]);
  const resumo = resumirAtuacao(
    { eventos, presencas, orgaos, autores, proposicoes },
    ano
  );
  const n = Object.keys(resumo.deps).length;
  if (n < 400 || resumo.sessoes < 20)
    throw new Error(
      `resumo suspeito: ${n} deputados, ${resumo.sessoes} sessões`
    );
  const saida = `client/public/explorar/dados/atuacao-${ano}.json`;
  await writeFile(
    saida,
    JSON.stringify({
      fonte: "Câmara dos Deputados, arquivos de dados abertos",
      coleta: new Date().toLocaleDateString("pt-BR"),
      ...resumo,
    })
  );
  console.log(
    `${saida}: ${n} deputados, ${resumo.sessoes} sessões deliberativas`
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
