#!/usr/bin/env node
// Baixa o arquivo anual da Cota para o Exercício da Atividade Parlamentar (CEAP)
// e gera o resumo por deputado usado nas páginas de perfil.
//
// Uso: node scripts/coletar-cota-camara.mjs [ano]
// Fonte: https://www.camara.leg.br/cotas/Ano-{ano}.csv.zip (um único download, ~7 MB).

import { writeFile } from "node:fs/promises";
import { inflateRawSync } from "node:zlib";
import { pathToFileURL } from "node:url";

// Lê o primeiro arquivo de um zip. O tamanho vem do diretório central porque o
// zip da Câmara usa "data descriptor" (tamanho zerado no cabeçalho local).
export function lerZip(buf) {
  let fim = buf.length - 22;
  while (fim >= 0 && buf.readUInt32LE(fim) !== 0x06054b50) fim--;
  if (fim < 0)
    throw new Error("zip inválido: diretório central não encontrado");
  const central = buf.readUInt32LE(fim + 16);
  const metodo = buf.readUInt16LE(central + 10);
  const tamanho = buf.readUInt32LE(central + 20);
  const local = buf.readUInt32LE(central + 42);
  const inicio =
    local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
  const dados = buf.subarray(inicio, inicio + tamanho);
  return (metodo === 8 ? inflateRawSync(dados) : dados).toString("utf8");
}

// CSV da Câmara: separador ";", todos os campos entre aspas.
export function lerCsv(texto) {
  const linhas = [];
  let campo = "";
  let linha = [];
  let aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') ((campo += '"'), i++);
      else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ";") (linha.push(campo), (campo = ""));
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      linha.push(campo);
      if (linha.length > 1 || linha[0]) linhas.push(linha);
      ((linha = []), (campo = ""));
    } else campo += c;
  }
  if (campo || linha.length) linhas.push([...linha, campo]);
  const [cab, ...resto] = linhas;
  return resto.map(l => Object.fromEntries(cab.map((k, i) => [k, l[i] ?? ""])));
}

const centavos = v => Math.round(v * 100) / 100;

// Resumo por deputado: total líquido, por mês, por tipo de despesa e maiores fornecedores.
// Lançamentos de lideranças e da Mesa não têm ideCadastro e ficam de fora.
// Só guardamos o CNPJ de empresas: CPF de pessoa física não vai para o arquivo público.
export function agregar(linhas, ano) {
  const tipos = [];
  const indiceTipo = new Map();
  const porDep = new Map();
  for (const l of linhas) {
    if (!l.ideCadastro || Number(l.numAno) !== ano) continue;
    const valor = Number(l.vlrLiquido.replace(",", "."));
    if (!Number.isFinite(valor)) continue;
    const tipo = l.txtDescricao.trim();
    if (!indiceTipo.has(tipo)) indiceTipo.set(tipo, tipos.push(tipo) - 1);
    let d = porDep.get(l.ideCadastro);
    if (!d) {
      d = { t: 0, n: 0, m: Array(12).fill(0), k: {}, f: new Map() };
      porDep.set(l.ideCadastro, d);
    }
    d.t += valor;
    d.n++;
    d.m[Number(l.numMes) - 1] += valor;
    const k = indiceTipo.get(tipo);
    d.k[k] = (d.k[k] ?? 0) + valor;
    const doc = l.txtCNPJCPF.replace(/\D/g, "");
    const chave = l.txtFornecedor.trim().toUpperCase();
    const f = d.f.get(chave) ?? {
      nome: l.txtFornecedor.trim(),
      cnpj: doc.length === 14 ? doc : "",
      valor: 0,
    };
    f.valor += valor;
    d.f.set(chave, f);
  }
  const deps = {};
  for (const [id, d] of porDep) {
    deps[id] = {
      t: centavos(d.t),
      n: d.n,
      m: d.m.map(centavos),
      k: Object.fromEntries(
        Object.entries(d.k).map(([k, v]) => [k, centavos(v)])
      ),
      f: [...d.f.values()]
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 5)
        .map(f => [f.nome, f.cnpj, centavos(f.valor)]),
    };
  }
  return { tipos, deps };
}

async function main() {
  const ano = Number(process.argv[2] ?? 2025);
  const url = `https://www.camara.leg.br/cotas/Ano-${ano}.csv.zip`;
  let r;
  for (let t = 1; ; t++) {
    try {
      r = await fetch(url, { signal: AbortSignal.timeout(120_000) });
      if (r.ok) break;
      throw new Error(`HTTP ${r.status}`);
    } catch (err) {
      if (t === 5) throw new Error(`${url}: ${err.message}`);
      await new Promise(ok => setTimeout(ok, 10_000 * t));
    }
  }
  const linhas = lerCsv(lerZip(Buffer.from(await r.arrayBuffer())));
  const { tipos, deps } = agregar(linhas, ano);
  if (Object.keys(deps).length < 400)
    throw new Error(
      `só ${Object.keys(deps).length} deputados: arquivo incompleto?`
    );
  const saida = `client/public/explorar/dados/cota-${ano}.json`;
  await writeFile(
    saida,
    JSON.stringify({
      fonte:
        "Câmara dos Deputados, Cota para o Exercício da Atividade Parlamentar",
      url,
      coleta: new Date().toLocaleDateString("pt-BR"),
      tipos,
      deps,
    })
  );
  console.log(
    `${saida}: ${linhas.length} lançamentos, ${Object.keys(deps).length} deputados`
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
