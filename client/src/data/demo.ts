export type PromiseStatus =
  | "Em andamento"
  | "Cumprida"
  | "Prazo crítico"
  | "Sem evidência suficiente"
  | "Fora da competência direta";

export type EvidenceStrength = "Forte" | "Parcial" | "Insuficiente";

export type TimelineKind =
  | "eleição"
  | "mandato"
  | "partido"
  | "reconhecimento"
  | "processo"
  | "proposta";

export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
  kind: TimelineKind;
  source: string;
};

export type PromiseItem = {
  id: string;
  title: string;
  theme: string;
  status: PromiseStatus;
  progress: number;
  deadline: string;
  competence: string;
  evidence: string;
  updated: string;
  trajectory: "favorável" | "incerta" | "atrasada" | "sem base suficiente";
};

export type PromiseAuditMeta = {
  protocol: string;
  version: string;
  extractedAt: string;
  reviewedAt: string;
  source: string;
  sourceDetail: string;
  license: string;
  strength: EvidenceStrength;
};

export type Politician = {
  id: string;
  name: string;
  shortName: string;
  role: string;
  party: string;
  state: string;
  city: string;
  period: string;
  portrait: string;
  type: "mandato" | "candidatura" | "histórico";
  summary: string;
  elections: number;
  wins: number;
  mandates: number;
  promises: number;
  tracked: boolean;
  timeline: TimelineEvent[];
  promisesList: PromiseItem[];
  stats: { label: string; value: string; note: string }[];
};

export const politicians: Politician[] = [
  {
    id: "marina-albuquerque",
    name: "Marina Albuquerque",
    shortName: "Marina Albuquerque",
    role: "Deputada Federal",
    party: "Partido Demonstrativo",
    state: "MG",
    city: "Belo Horizonte",
    period: "2023–2027",
    portrait:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=420&q=80",
    type: "mandato",
    summary:
      "Parlamentar em exercício, com atuação concentrada em saúde pública, educação técnica e transparência orçamentária.",
    elections: 3,
    wins: 2,
    mandates: 2,
    promises: 12,
    tracked: true,
    timeline: [
      {
        year: "2026",
        title: "Relatoria em comissão permanente",
        description:
          "Assumiu a relatoria de uma proposição demonstrativa sobre transparência de transferências voluntárias.",
        kind: "mandato",
        source: "Câmara dos Deputados · registro demonstrativo",
      },
      {
        year: "2024",
        title: "Reconhecimento institucional",
        description:
          "Recebeu menção honrosa demonstrativa por iniciativa de dados abertos.",
        kind: "reconhecimento",
        source: "Instituição demonstrativa · publicação de 2024",
      },
      {
        year: "2023",
        title: "Eleita para a Câmara dos Deputados",
        description: "Eleição demonstrativa pelo estado de Minas Gerais.",
        kind: "eleição",
        source: "TSE · registro demonstrativo",
      },
      {
        year: "2022",
        title: "Programa de governo publicado",
        description:
          "Documento de propostas com compromissos nas áreas de saúde, educação e orçamento.",
        kind: "proposta",
        source: "TSE · proposta demonstrativa",
      },
      {
        year: "2018",
        title: "Primeira candidatura",
        description: "Disputou eleição demonstrativa para cargo proporcional.",
        kind: "eleição",
        source: "TSE · registro demonstrativo",
      },
    ],
    promisesList: [
      {
        id: "p1",
        title:
          "Ampliar a rede de atenção básica em municípios de pequeno porte",
        theme: "Saúde",
        status: "Em andamento",
        progress: 62,
        deadline: "Até dezembro de 2026",
        competence: "Compartilhada",
        evidence: "2 evidências",
        updated: "28 out. 2026",
        trajectory: "favorável",
      },
      {
        id: "p2",
        title: "Publicar painel de execução de emendas com dados abertos",
        theme: "Transparência",
        status: "Cumprida",
        progress: 100,
        deadline: "Primeiro semestre de 2024",
        competence: "Direta",
        evidence: "4 evidências",
        updated: "20 ago. 2026",
        trajectory: "favorável",
      },
      {
        id: "p3",
        title: "Criar programa nacional de formação técnica para jovens",
        theme: "Educação",
        status: "Prazo crítico",
        progress: 34,
        deadline: "Até dezembro de 2026",
        competence: "Compartilhada",
        evidence: "1 evidência",
        updated: "12 out. 2026",
        trajectory: "atrasada",
      },
      {
        id: "p4",
        title: "Reduzir desigualdades regionais de atendimento especializado",
        theme: "Saúde",
        status: "Sem evidência suficiente",
        progress: 0,
        deadline: "Sem prazo explícito",
        competence: "Compartilhada",
        evidence: "Nenhuma evidência",
        updated: "28 out. 2026",
        trajectory: "sem base suficiente",
      },
      {
        id: "p5",
        title: "Apoiar a modernização de escolas públicas",
        theme: "Educação",
        status: "Fora da competência direta",
        progress: 18,
        deadline: "Sem prazo explícito",
        competence: "Estados e municípios",
        evidence: "1 evidência",
        updated: "05 set. 2026",
        trajectory: "incerta",
      },
    ],
    stats: [
      { label: "Presença em sessões", value: "92%", note: "Legislatura atual" },
      { label: "Proposições apresentadas", value: "38", note: "Desde 2023" },
      { label: "Relatorias", value: "7", note: "Com registro público" },
      { label: "Despesas CEAP", value: "R$ 184 mil", note: "Recorte 2026" },
    ],
  },
  {
    id: "rafael-nogueira",
    name: "Rafael Nogueira",
    shortName: "Rafael Nogueira",
    role: "Candidato a Prefeito",
    party: "Movimento Municipal",
    state: "PR",
    city: "Londrina",
    period: "Eleição 2024",
    portrait:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=420&q=80",
    type: "candidatura",
    summary:
      "Candidatura não eleita em 2024. Perfil demonstrativo para acompanhar propostas e histórico eleitoral.",
    elections: 2,
    wins: 0,
    mandates: 0,
    promises: 8,
    tracked: false,
    timeline: [
      {
        year: "2024",
        title: "Candidatura para prefeitura",
        description:
          "Disputou eleição demonstrativa para a prefeitura de Londrina.",
        kind: "eleição",
        source: "TSE · registro demonstrativo",
      },
      {
        year: "2024",
        title: "Proposta de governo registrada",
        description:
          "Documento com compromissos para mobilidade, saúde e zeladoria.",
        kind: "proposta",
        source: "TSE · proposta demonstrativa",
      },
      {
        year: "2020",
        title: "Primeira candidatura",
        description:
          "Disputou eleição demonstrativa para o legislativo municipal.",
        kind: "eleição",
        source: "TSE · registro demonstrativo",
      },
    ],
    promisesList: [
      {
        id: "p6",
        title: "Implantar corredores de transporte coletivo",
        theme: "Mobilidade",
        status: "Fora da competência direta",
        progress: 0,
        deadline: "Sem prazo explícito",
        competence: "Gestão municipal eleita",
        evidence: "1 evidência",
        updated: "24 out. 2026",
        trajectory: "sem base suficiente",
      },
      {
        id: "p7",
        title: "Criar calendário público de manutenção urbana",
        theme: "Zeladoria",
        status: "Sem evidência suficiente",
        progress: 0,
        deadline: "Primeiros 100 dias",
        competence: "Não eleito",
        evidence: "Documento original",
        updated: "24 out. 2026",
        trajectory: "sem base suficiente",
      },
    ],
    stats: [
      { label: "Votos recebidos", value: "18,4%", note: "Eleição 2024" },
      { label: "Propostas registradas", value: "8", note: "Documento TSE" },
      { label: "Eleições disputadas", value: "2", note: "Histórico" },
      { label: "Situação", value: "Não eleito", note: "Recorte 2024" },
    ],
  },
  {
    id: "helena-costa",
    name: "Helena Costa",
    shortName: "Helena Costa",
    role: "Senadora",
    party: "Partido Cívico",
    state: "PE",
    city: "Recife",
    period: "2023–2031",
    portrait:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=420&q=80",
    type: "mandato",
    summary:
      "Senadora em exercício, com registros demonstrativos de atuação em direitos sociais e orçamento público.",
    elections: 4,
    wins: 2,
    mandates: 2,
    promises: 9,
    tracked: false,
    timeline: [
      {
        year: "2025",
        title: "Votação nominal registrada",
        description:
          "Participação em votação demonstrativa sobre transparência pública.",
        kind: "mandato",
        source: "Senado Federal · registro demonstrativo",
      },
      {
        year: "2023",
        title: "Início do mandato",
        description:
          "Mandato demonstrativo iniciado pelo estado de Pernambuco.",
        kind: "mandato",
        source: "TSE · registro demonstrativo",
      },
      {
        year: "2022",
        title: "Eleita para o Senado",
        description: "Eleição demonstrativa para mandato de oito anos.",
        kind: "eleição",
        source: "TSE · registro demonstrativo",
      },
    ],
    promisesList: [
      {
        id: "p8",
        title: "Fortalecer mecanismos de transparência federativa",
        theme: "Transparência",
        status: "Em andamento",
        progress: 48,
        deadline: "Até 2028",
        competence: "Compartilhada",
        evidence: "3 evidências",
        updated: "26 out. 2026",
        trajectory: "incerta",
      },
      {
        id: "p9",
        title: "Apoiar a expansão de creches públicas",
        theme: "Educação",
        status: "Sem evidência suficiente",
        progress: 0,
        deadline: "Sem prazo explícito",
        competence: "Compartilhada",
        evidence: "1 evidência",
        updated: "22 out. 2026",
        trajectory: "sem base suficiente",
      },
    ],
    stats: [
      { label: "Presença em sessões", value: "96%", note: "Legislatura atual" },
      { label: "Votações nominais", value: "184", note: "Desde 2023" },
      { label: "Relatorias", value: "12", note: "Com registro público" },
      { label: "Despesas", value: "R$ 96 mil", note: "Recorte 2026" },
    ],
  },
];

export const sources = [
  {
    name: "Tribunal Superior Eleitoral",
    short: "TSE",
    detail: "Candidaturas, bens, contas, propostas e resultados",
    color: "blue",
  },
  {
    name: "Câmara dos Deputados",
    short: "Câmara",
    detail: "Presença, proposições, votações e despesas",
    color: "teal",
  },
  {
    name: "Senado Federal",
    short: "Senado",
    detail: "Votações, proposições e atividade parlamentar",
    color: "amber",
  },
  {
    name: "Conselho Nacional de Justiça",
    short: "CNJ",
    detail: "Metadados processuais públicos, quando aplicável",
    color: "slate",
  },
];

export const themes = [
  { name: "Transparência", count: 24, color: "teal" },
  { name: "Saúde", count: 19, color: "coral" },
  { name: "Educação", count: 17, color: "amber" },
  { name: "Mobilidade", count: 12, color: "blue" },
];

export const updates = [
  {
    date: "28 out. 2026",
    title: "Nova evidência adicionada a uma promessa de saúde",
    source: "Câmara dos Deputados",
    type: "evidência",
  },
  {
    date: "26 out. 2026",
    title: "Perfil de Helena Costa atualizado",
    source: "Senado Federal",
    type: "perfil",
  },
  {
    date: "24 out. 2026",
    title: "Documento de proposta indexado",
    source: "TSE · Eleição 2024",
    type: "documento",
  },
];

export const allPromises = politicians.flatMap(politician =>
  politician.promisesList.map(promise => ({
    ...promise,
    politician: politician.shortName,
    politicianId: politician.id,
  }))
);

export function getPolitician(id: string | undefined) {
  return politicians.find(politician => politician.id === id) ?? politicians[0];
}

export function getPromiseAuditMeta(promise: PromiseItem): PromiseAuditMeta {
  const strength: EvidenceStrength =
    promise.status === "Cumprida"
      ? "Forte"
      : promise.status === "Sem evidência suficiente" ||
          promise.status === "Fora da competência direta"
        ? "Insuficiente"
        : "Parcial";

  return {
    protocol: `DD-${promise.id.toUpperCase()}-2026`,
    version: "v0.4 demonstrativo",
    extractedAt: promise.updated,
    reviewedAt: "28 out. 2026",
    source: "TSE · proposta de governo",
    sourceDetail: "Documento eleitoral e registros públicos demonstrativos",
    license: "LAI · dados públicos",
    strength,
  };
}
