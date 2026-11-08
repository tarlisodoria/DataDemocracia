// Deputados com votos reais, a partir do arquivo gerado por scripts/coletar-votacoes-camara.mjs.

export type VotacoesArquivo = {
  coleta: string;
  deps: [number, string, string, string][];
  v: string[];
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

let cache: Promise<{ coleta: string; deputados: DeputadoResumo[] }> | null =
  null;

export function carregarDeputados() {
  cache ??= fetch(VOTACOES_URL)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<VotacoesArquivo>;
    })
    .then(dados => ({
      coleta: dados.coleta,
      deputados: resumirDeputados(dados),
    }))
    .catch(err => {
      cache = null; // permite nova tentativa na próxima busca
      throw err;
    });
  return cache;
}
