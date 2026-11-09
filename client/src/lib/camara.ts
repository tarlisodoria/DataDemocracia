// Deputados com votos reais, a partir do arquivo gerado por scripts/coletar-votacoes-camara.mjs.

export type VotacoesArquivo = {
  coleta: string;
  deps: [number, string, string, string][];
  // [id, data, o que foi votado, proposição, idProposição, temas]
  vot?: [string, string, string, string, number | null, number[]][];
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
  fetch(url).then(r => {
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
