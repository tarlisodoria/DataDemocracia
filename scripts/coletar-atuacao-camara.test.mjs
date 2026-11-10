import { describe, expect, it } from "vitest";
import { resumirAtuacao } from "./coletar-atuacao-camara.mjs";

const fontes = {
  eventos: [
    { id: 1, descricaoTipo: "Sessão Deliberativa", situacao: "Encerrada" },
    { id: 2, descricaoTipo: "Sessão Deliberativa", situacao: "Encerrada" },
    { id: 3, descricaoTipo: "Sessão Deliberativa", situacao: "Cancelada" },
    { id: 4, descricaoTipo: "Reunião Deliberativa", situacao: "Encerrada" },
    {
      id: 5,
      descricaoTipo: "Sessão Não Deliberativa Solene",
      situacao: "Encerrada",
    },
  ],
  presencas: [
    { idEvento: 1, idDeputado: 10 },
    { idEvento: 1, idDeputado: 10 }, // duplicada no arquivo
    { idEvento: 2, idDeputado: 20 },
    { idEvento: 3, idDeputado: 10 },
    { idEvento: 4, idDeputado: 10 },
    { idEvento: 5, idDeputado: 10 },
  ],
  orgaos: [
    {
      uriDeputado: ".../deputados/10",
      siglaOrgao: "CCJC",
      nomePublicacaoOrgao: "Constituição e Justiça",
      cargo: "Suplente",
      dataInicio: "2025-02-01",
      dataFim: "",
    },
    {
      uriDeputado: ".../deputados/10",
      siglaOrgao: "CCJC",
      nomePublicacaoOrgao: "Constituição e Justiça",
      cargo: "Presidente",
      dataInicio: "2025-03-01",
      dataFim: "",
    },
    {
      uriDeputado: ".../deputados/10",
      siglaOrgao: "CE",
      nomePublicacaoOrgao: "Educação",
      cargo: "Titular",
      dataInicio: "2023-02-01",
      dataFim: "2024-12-31",
    },
  ],
  proposicoes: [
    {
      id: 100,
      siglaTipo: "PL",
      numero: 1,
      ano: 2025,
      ementa: "Cria o programa.",
      dataApresentacao: "2025-03-01T10:00",
      ultimoStatus: { descricaoSituacao: "Aguardando Parecer" },
    },
    {
      id: 101,
      siglaTipo: "PRL",
      numero: 2,
      ano: 2025,
      ementa: "Parecer.",
      dataApresentacao: "2025-04-01T10:00",
    },
    {
      id: 102,
      siglaTipo: "PL",
      numero: 3,
      ano: 2025,
      ementa: "Antiga.",
      dataApresentacao: "2003-01-01T10:00",
    },
    {
      id: 103,
      siglaTipo: "REQ",
      numero: 4,
      ano: 2025,
      ementa: "Requer.",
      dataApresentacao: "2025-05-01T10:00",
    },
  ],
  autores: [
    {
      idProposicao: 100,
      codTipoAutor: 10000,
      idDeputadoAutor: 10,
      proponente: "1",
      ordemAssinatura: "1",
    },
    {
      idProposicao: 100,
      codTipoAutor: 10000,
      idDeputadoAutor: 20,
      proponente: "1",
      ordemAssinatura: "2",
    },
    {
      idProposicao: 101,
      codTipoAutor: 10000,
      idDeputadoAutor: 10,
      proponente: "1",
      ordemAssinatura: "1",
    },
    {
      idProposicao: 102,
      codTipoAutor: 10000,
      idDeputadoAutor: 10,
      proponente: "1",
      ordemAssinatura: "1",
    },
    {
      idProposicao: 103,
      codTipoAutor: 10000,
      idDeputadoAutor: 10,
      proponente: "0",
      ordemAssinatura: "5",
    },
  ],
};

describe("resumirAtuacao", () => {
  const r = resumirAtuacao(fontes, 2025);

  it("conta presença em sessões deliberativas e reuniões, sem canceladas nem duplicadas", () => {
    expect(r.sessoes).toBe(2);
    expect(r.deps[10].p).toBe(1);
    expect(r.deps[10].c).toBe(1);
    expect(r.deps[20].p).toBe(1);
  });

  it("guarda um cargo por órgão do ano, o mais alto", () => {
    expect(r.deps[10].o).toEqual([["CCJC", "Presidente"]]);
    expect(r.orgaos.CCJC).toBe("Constituição e Justiça");
  });

  it("conta só proposições do ano e dos tipos escolhidos, separando autoria principal", () => {
    expect(r.deps[10].a).toEqual({ PL: 1 });
    expect(r.deps[10].l1).toBe(1);
    expect(r.deps[20].l1).toBe(0);
    expect(r.deps[10].ex[0].slice(1, 4)).toEqual([
      "PL 1/2025",
      "Cria o programa.",
      "Aguardando Parecer",
    ]);
  });
});
