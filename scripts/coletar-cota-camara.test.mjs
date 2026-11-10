import { deflateRawSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { agregar, lerCsv, lerZip } from "./coletar-cota-camara.mjs";

// Zip mínimo com um arquivo e tamanhos zerados no cabeçalho local, como o da Câmara.
function zip(nome, texto) {
  const dados = deflateRawSync(Buffer.from(texto));
  const n = Buffer.from(nome);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(8, 8);
  local.writeUInt16LE(n.length, 26);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(8, 10);
  central.writeUInt32LE(dados.length, 20);
  central.writeUInt16LE(n.length, 28);
  central.writeUInt32LE(0, 42);
  const inicioCentral = 30 + n.length + dados.length;
  const fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0);
  fim.writeUInt32LE(inicioCentral, 16);
  return Buffer.concat([local, n, dados, central, n, fim]);
}

const CSV = [
  '"txNomeParlamentar";"ideCadastro";"txtDescricao";"txtFornecedor";"txtCNPJCPF";"vlrLiquido";"numMes";"numAno"',
  '"LIDERANÇA";"";"MANUTENÇÃO";"CAFÉ";"085.324.290/0013-1";"1467";"2";"2025"',
  '"Ana";"10";"COMBUSTÍVEIS";"POSTO ""BOM""";"12.345.678/0001-90";"100.5";"1";"2025"',
  '"Ana";"10";"COMBUSTÍVEIS";"Posto ""Bom""";"12.345.678/0001-90";"50";"3";"2025"',
  '"Ana";"10";"PASSAGEM AÉREA";"João";"123.456.789-00";"300";"3";"2025"',
  '"Ana";"10";"PASSAGEM AÉREA";"CIA";"";"-20";"3";"2025"',
  '"Ana";"10";"PASSAGEM AÉREA";"CIA";"";"999";"12";"2024"',
].join("\r\n");

describe("cota parlamentar", () => {
  it("lê o zip e o CSV com aspas escapadas", () => {
    const linhas = lerCsv(lerZip(zip("Ano-2025.csv", CSV)));
    expect(linhas).toHaveLength(6);
    expect(linhas[1].txtFornecedor).toBe('POSTO "BOM"');
  });

  it("agrega por deputado, mês, tipo e fornecedor sem guardar CPF", () => {
    const { tipos, deps } = agregar(lerCsv(CSV), 2025);
    expect(Object.keys(deps)).toEqual(["10"]);
    const d = deps["10"];
    expect(d.t).toBe(430.5);
    expect(d.n).toBe(4);
    expect(d.m[0]).toBe(100.5);
    expect(d.m[2]).toBe(330);
    expect(d.k[tipos.indexOf("COMBUSTÍVEIS")]).toBe(150.5);
    expect(d.f[0]).toEqual(["João", "", 300]);
    expect(d.f[1]).toEqual(['POSTO "BOM"', "12345678000190", 150.5]);
  });
});
