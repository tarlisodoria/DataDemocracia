// Deputados com votos reais, a partir do arquivo gerado por scripts/coletar-votacoes-camara.mjs.

export type VotacoesArquivo = {
  coleta: string;
  deps: [number, string, string, string][];
  // [id, data, o que foi votado, proposição, idProposição, temas]
  vot?: [string, string, string, string, number | null, number[]][];
  temas?: string[];
  v: string[];
};

export type PerfilCadastro = {
  nomeCivil: string | null;
  foto: string | null;
  email: string | null;
  redes: string[];
};

export type DeputadoResumo = {
  id: number;
  nome: string;
  partido: string;
  uf: string;
  registrados: number;
  semRegistro: number;
  sim: number;
};

export const VOTACOES_URL = "/explorar/dados/votacoes-plenario-2025.json";
export const PERFIS_URL = "/explorar/dados/deputados-2025.json";
export const paginaDeputado = (id: number) => `/deputado/${id}`;
export const painelDeputado = (id: number) =>
  `/explorar/votacoes-2025.html?deputado=${id}`;

export function resumirDeputados(dados: VotacoesArquivo): DeputadoResumo[] {
  const resumo = dados.deps.map(([id, nome, partido, uf]) => ({
    id,
    nome,
    partido,
    uf,
    registrados: 0,
    semRegistro: 0,
    sim: 0,
  }));
  for (const linha of dados.v) {
    for (let j = 0; j < linha.length; j++) {
      const c = linha[j];
      if (c === ".") resumo[j].semRegistro++;
      else {
        resumo[j].registrados++;
        if (c === "S") resumo[j].sim++;
      }
    }
  }
  return resumo;
}

const semAcento = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function buscarDeputados(lista: DeputadoResumo[], termo: string) {
  const t = semAcento(termo.trim());
  if (!t) return [];
  return lista.filter(d =>
    semAcento(`${d.nome} ${d.partido} ${d.uf}`).includes(t)
  );
}

const json = <T>(url: string) =>
  // no-cache: revalida com o servidor, para não mostrar a coleta anterior.
  fetch(url, { cache: "no-cache" }).then(r => {
    if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
    return r.json() as Promise<T>;
  });

let votacoes: Promise<VotacoesArquivo> | null = null;
export function carregarVotacoes() {
  votacoes ??= json<VotacoesArquivo>(VOTACOES_URL).catch(err => {
    votacoes = null; // permite nova tentativa
    throw err;
  });
  return votacoes;
}

export function carregarDeputados() {
  return carregarVotacoes().then(dados => ({
    coleta: dados.coleta,
    deputados: resumirDeputados(dados),
  }));
}

// O cadastro (fotos e redes) é opcional: sem ele a página usa só os votos.
export function carregarCadastros(): Promise<Record<string, PerfilCadastro>> {
  return json<{ perfis: Record<string, PerfilCadastro> }>(PERFIS_URL)
    .then(d => d.perfis)
    .catch(() => ({}));
}

export type PerfilVotos = {
  resumo: DeputadoResumo;
  tipos: { sim: number; nao: number; abstencao: number; obstrucao: number };
  mediaParticipacao: number;
  alinhamento: { comMaioria: number; base: number };
  ultimos: {
    id: string;
    data: string;
    proposicao: string;
    oQue: string;
    voto: string;
  }[];
};

const NOME_VOTO: Record<string, string> = {
  S: "Sim",
  N: "Não",
  A: "Abstenção",
  O: "Obstrução",
  R: "Art. 17",
};

export function perfilDeputado(
  dados: VotacoesArquivo,
  id: number
): PerfilVotos | null {
  const j = dados.deps.findIndex(d => d[0] === id);
  if (j < 0) return null;
  const resumos = resumirDeputados(dados);
  const partido = dados.deps[j][2];
  const colegas = dados.deps
    .map((d, k) => (d[2] === partido && k !== j ? k : -1))
    .filter(k => k >= 0);
  const tipos = { sim: 0, nao: 0, abstencao: 0, obstrucao: 0 };
  const alinhamento = { comMaioria: 0, base: 0 };
  const ultimos: PerfilVotos["ultimos"] = [];

  dados.v.forEach((linha, i) => {
    const c = linha[j];
    if (c === "S") tipos.sim++;
    else if (c === "N") tipos.nao++;
    else if (c === "A") tipos.abstencao++;
    else if (c === "O" || c === "R") tipos.obstrucao++;

    // Maioria do partido entre Sim e Não, sem contar o próprio deputado; empate não entra.
    if ((c === "S" || c === "N") && colegas.length) {
      let s = 0;
      let n = 0;
      for (const k of colegas) {
        if (linha[k] === "S") s++;
        else if (linha[k] === "N") n++;
      }
      if (s !== n) {
        alinhamento.base++;
        if ((s > n ? "S" : "N") === c) alinhamento.comMaioria++;
      }
    }
    const v = dados.vot?.[i];
    if (c !== "." && v)
      ultimos.push({
        id: v[0],
        data: v[1],
        proposicao: v[3],
        oQue: v[2],
        voto: NOME_VOTO[c],
      });
  });

  const participacao = resumos.map(r =>
    r.registrados + r.semRegistro
      ? r.registrados / (r.registrados + r.semRegistro)
      : 0
  );
  return {
    resumo: resumos[j],
    tipos,
    mediaParticipacao:
      participacao.reduce((a, b) => a + b, 0) / participacao.length,
    alinhamento,
    ultimos: ultimos.reverse().slice(0, 10),
  };
}

// Índices dos colegas de sigla, sem o próprio deputado.
const colegasDe = (dados: VotacoesArquivo, j: number) =>
  dados.deps.flatMap((d, k) =>
    d[2] === dados.deps[j][2] && k !== j ? [k] : []
  );

// Voto da maioria dos colegas entre Sim e Não; null em empate ou sem votos.
function maioria(linha: string, colegas: number[]) {
  let s = 0;
  let n = 0;
  for (const k of colegas) {
    if (linha[k] === "S") s++;
    else if (linha[k] === "N") n++;
  }
  return { voto: s === n ? null : s > n ? "S" : "N", s, n };
}

export type Divergencia = {
  id: string;
  data: string;
  proposicao: string;
  oQue: string;
  voto: string;
  partidoSim: number;
  partidoNao: number;
};

// Votações em que o Sim/Não do deputado foi o oposto do da maioria da sigla.
export function divergencias(dados: VotacoesArquivo, j: number): Divergencia[] {
  const colegas = colegasDe(dados, j);
  const saida: Divergencia[] = [];
  dados.v.forEach((linha, i) => {
    const c = linha[j];
    if (c !== "S" && c !== "N") return;
    const m = maioria(linha, colegas);
    const v = dados.vot?.[i];
    if (m.voto && m.voto !== c && v)
      saida.push({
        id: v[0],
        data: v[1],
        proposicao: v[3],
        oQue: v[2],
        voto: NOME_VOTO[c],
        partidoSim: m.s,
        partidoNao: m.n,
      });
  });
  return saida.reverse();
}

export type TemaVoto = {
  tema: string;
  votos: number;
  simDeputado: number;
  simPartido: number | null;
  simCamara: number;
};

// % de Sim por tema: deputado, colegas de sigla e Câmara inteira, sobre votos registrados.
export function votosPorTema(
  dados: VotacoesArquivo,
  j: number,
  minimo = 5
): TemaVoto[] {
  if (!dados.vot || !dados.temas) return [];
  const colegas = colegasDe(dados, j);
  const acc = dados.temas.map(() => ({ d: [0, 0], p: [0, 0], c: [0, 0] }));
  const conta = (alvo: number[], c: string) => {
    if (c === ".") return;
    alvo[1]++;
    if (c === "S") alvo[0]++;
  };
  dados.v.forEach((linha, i) => {
    for (const t of dados.vot![i][5]) {
      const a = acc[t];
      conta(a.d, linha[j]);
      for (const k of colegas) conta(a.p, linha[k]);
      for (let k = 0; k < linha.length; k++) conta(a.c, linha[k]);
    }
  });
  return acc
    .map((a, t) => ({
      tema: dados.temas![t],
      votos: a.d[1],
      simDeputado: a.d[1] ? a.d[0] / a.d[1] : 0,
      simPartido: a.p[1] ? a.p[0] / a.p[1] : null,
      simCamara: a.c[1] ? a.c[0] / a.c[1] : 0,
    }))
    .filter(x => x.votos >= minimo)
    .sort((x, y) => y.votos - x.votos);
}

export type Semelhante = {
  id: number;
  nome: string;
  partido: string;
  uf: string;
  concordancia: number;
  emComum: number;
};

// Deputados que mais votaram igual (Sim/Não) nas votações em que ambos votaram.
export function maisParecidos(
  dados: VotacoesArquivo,
  j: number,
  quantos = 5,
  minimoEmComum = 100
): Semelhante[] {
  const saida: Semelhante[] = [];
  dados.deps.forEach(([id, nome, partido, uf], k) => {
    if (k === j) return;
    let comum = 0;
    let iguais = 0;
    for (const linha of dados.v) {
      const a = linha[j];
      const b = linha[k];
      if ((a === "S" || a === "N") && (b === "S" || b === "N")) {
        comum++;
        if (a === b) iguais++;
      }
    }
    if (comum >= minimoEmComum)
      saida.push({
        id,
        nome,
        partido,
        uf,
        concordancia: iguais / comum,
        emComum: comum,
      });
  });
  return saida
    .sort((x, y) => y.concordancia - x.concordancia || y.emComum - x.emComum)
    .slice(0, quantos);
}

export type Rede = { nome: string; url: string };

// Nome da rede a partir do endereço; o resto aparece como "Site".
export function identificarRede(url: string): Rede {
  const host = url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .toLowerCase();
  const nomes: [string, string][] = [
    ["instagram.com", "Instagram"],
    ["facebook.com", "Facebook"],
    ["fb.com", "Facebook"],
    ["twitter.com", "X"],
    ["x.com", "X"],
    ["youtube.com", "YouTube"],
    ["youtu.be", "YouTube"],
    ["tiktok.com", "TikTok"],
    ["linkedin.com", "LinkedIn"],
    ["threads.net", "Threads"],
    ["flickr.com", "Flickr"],
  ];
  const achado = nomes.find(([h]) => host === h || host.endsWith("." + h));
  return { nome: achado ? achado[1] : "Site", url };
}

export type VotacaoResumo = {
  id: string;
  data: string;
  proposicao: string;
  oQue: string;
  sim: number;
  nao: number;
  outros: number;
};

// Votações mais recentes com o placar de cada uma.
export function ultimasVotacoes(
  dados: VotacoesArquivo,
  quantas = 4
): VotacaoResumo[] {
  if (!dados.vot) return [];
  return dados.vot
    .map((v, i) => {
      let sim = 0;
      let nao = 0;
      let outros = 0;
      for (const c of dados.v[i]) {
        if (c === "S") sim++;
        else if (c === "N") nao++;
        else if (c !== ".") outros++;
      }
      return {
        id: v[0],
        data: v[1],
        proposicao: v[3],
        oQue: v[2],
        sim,
        nao,
        outros,
        i,
      };
    })
    .sort((a, b) => b.data.localeCompare(a.data) || b.i - a.i)
    .slice(0, quantas)
    .map(({ i: _i, ...v }) => v);
}

// Temas com mais votações no ano.
export function temasMaisVotados(dados: VotacoesArquivo, quantos = 4) {
  if (!dados.vot || !dados.temas) return [];
  const contagem = dados.temas.map(() => 0);
  for (const v of dados.vot) for (const t of v[5]) contagem[t]++;
  return contagem
    .map((n, t) => ({ tema: dados.temas![t], votacoes: n }))
    .sort((a, b) => b.votacoes - a.votacoes)
    .slice(0, quantos);
}

// Seleção que muda uma vez por dia, para a home não destacar sempre os mesmos.
export function destaquesDoDia(
  total: number,
  quantos: number,
  dia = Math.floor(Date.now() / 864e5)
) {
  const passo = Math.max(1, Math.floor(total / quantos));
  return Array.from(
    { length: Math.min(quantos, total) },
    (_, k) => (dia * 37 + k * passo) % total
  );
}

// Cota parlamentar (CEAP): resumo por deputado gerado por scripts/coletar-cota-camara.mjs.
export type CotaDeputado = {
  t: number; // total líquido no ano
  n: number; // lançamentos
  m: number[]; // total por mês
  k: Record<string, number>; // total por índice de tipo
  f: [nome: string, cnpj: string, valor: number][]; // maiores fornecedores
};
export type CotaArquivo = {
  coleta: string;
  url: string;
  tipos: string[];
  deps: Record<string, CotaDeputado>;
};
export const COTA_URL = "/explorar/dados/cota-2025.json";

// Opcional como o cadastro: sem o arquivo, o perfil só não mostra a seção de gastos.
export function carregarCota(): Promise<CotaArquivo | null> {
  return json<CotaArquivo>(COTA_URL).catch(() => null);
}

const SIGLAS = new Set(["sigepa", "rpa"]);
export const rotuloTipo = (tipo: string) =>
  tipo
    .replace(/\s*,\s*/g, ", ")
    .replace(/\.$/, "")
    .toLowerCase()
    .replace(/\b[\p{L}]+/gu, p => (SIGLAS.has(p) ? p.toUpperCase() : p))
    .replace(/^./, c => c.toUpperCase())
    .replace("distrito federal", "Distrito Federal");

// Meses com algum gasto: suplentes e quem assumiu no meio do ano têm menos meses,
// então a comparação usa a média por mês com gasto, não o total do ano.
const mediaMensal = (d: CotaDeputado) => {
  const meses = d.m.filter(v => v > 0).length;
  return meses ? d.t / meses : 0;
};

const mediana = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const meio = s.length >> 1;
  return s.length % 2 ? s[meio] : (s[meio - 1] + s[meio]) / 2;
};

export type ResumoCota = {
  total: number;
  lancamentos: number;
  meses: number;
  mediaMensal: number;
  porMes: number[];
  tipos: { tipo: string; valor: number; parte: number }[];
  fornecedores: { nome: string; cnpj: string; valor: number }[];
  uf: { sigla: string; mediana: number; deputados: number; posicao: number };
};

export function resumoCota(
  cota: CotaArquivo,
  dados: VotacoesArquivo,
  id: number
): ResumoCota | null {
  const d = cota.deps[id];
  const dep = dados.deps.find(x => x[0] === id);
  if (!d || !dep) return null;
  const sigla = dep[3];
  const medias = dados.deps
    .filter(x => x[3] === sigla && cota.deps[x[0]])
    .map(x => mediaMensal(cota.deps[x[0]]))
    .filter(v => v > 0);
  const minha = mediaMensal(d);
  return {
    total: d.t,
    lancamentos: d.n,
    meses: d.m.filter(v => v > 0).length,
    mediaMensal: minha,
    porMes: d.m,
    tipos: Object.entries(d.k)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => ({
        tipo: rotuloTipo(cota.tipos[Number(k)]),
        valor: v,
        parte: d.t > 0 ? v / d.t : 0,
      }))
      .sort((a, b) => b.valor - a.valor),
    fornecedores: d.f.map(([nome, cnpj, valor]) => ({ nome, cnpj, valor })),
    uf: {
      sigla,
      mediana: medias.length ? mediana(medias) : 0,
      deputados: medias.length,
      // 1 = maior média mensal do estado.
      posicao: medias.filter(v => v > minha).length + 1,
    },
  };
}

// Atuação no ano: presença, comissões e proposições (scripts/coletar-atuacao-camara.mjs).
export type AtuacaoDeputado = {
  p: number; // sessões deliberativas do Plenário com presença
  c: number; // reuniões de comissão e outros eventos com presença
  o: [sigla: string, cargo: string][];
  a: Record<string, number>; // proposições apresentadas no ano, por tipo
  l1: number; // projetos (PL, PLP, PEC, PDL) como primeiro autor
  ex: [
    id: number,
    rotulo: string,
    ementa: string,
    situacao: string,
    data: string,
    principal: 0 | 1,
  ][];
};
export type AtuacaoArquivo = {
  coleta: string;
  sessoes: number;
  orgaos: Record<string, string>;
  deps: Record<string, AtuacaoDeputado>;
};
export const ATUACAO_URL = "/explorar/dados/atuacao-2025.json";

export function carregarAtuacao(): Promise<AtuacaoArquivo | null> {
  return json<AtuacaoArquivo>(ATUACAO_URL).catch(() => null);
}

export type ResumoAtuacao = {
  sessoes: { presente: number; total: number; mediana: number };
  reunioes: { presente: number; mediana: number };
  orgaos: { sigla: string; nome: string; cargo: string }[];
  projetos: { total: number; principal: number; medianaPrincipal: number };
  requerimentos: number;
  exemplos: {
    id: number;
    rotulo: string;
    ementa: string;
    situacao: string;
    data: string;
    principal: boolean;
  }[];
};

const somar = (a: Record<string, number>, tipos: string[]) =>
  tipos.reduce((s, t) => s + (a[t] ?? 0), 0);

export function resumoAtuacao(
  atuacao: AtuacaoArquivo,
  dados: VotacoesArquivo,
  id: number
): ResumoAtuacao | null {
  const d = atuacao.deps[id];
  if (!d) return null;
  // Medianas entre os deputados com voto registrado em 2025 (os mesmos das outras páginas).
  const colegas = dados.deps
    .map(x => atuacao.deps[x[0]])
    .filter((x): x is AtuacaoDeputado => !!x);
  const med = (f: (x: AtuacaoDeputado) => number) =>
    colegas.length ? mediana(colegas.map(f)) : 0;
  return {
    sessoes: { presente: d.p, total: atuacao.sessoes, mediana: med(x => x.p) },
    reunioes: { presente: d.c, mediana: med(x => x.c) },
    orgaos: d.o.map(([sigla, cargo]) => ({
      sigla,
      nome: atuacao.orgaos[sigla] || sigla,
      cargo,
    })),
    projetos: {
      total: somar(d.a, ["PL", "PLP", "PEC", "PDL"]),
      principal: d.l1,
      medianaPrincipal: med(x => x.l1),
    },
    requerimentos: somar(d.a, ["REQ", "RIC", "INC"]),
    exemplos: d.ex.map(([id, rotulo, ementa, situacao, data, principal]) => ({
      id,
      rotulo,
      ementa,
      situacao,
      data,
      principal: principal === 1,
    })),
  };
}
