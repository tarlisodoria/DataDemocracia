import { createClient } from "@neondatabase/neon-js";
import {
  initialsAvatar,
  politicians as demoPoliticians,
  type Politician,
} from "@/data/demo";

const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL?.trim();
const authUrl = import.meta.env.VITE_NEON_AUTH_URL?.trim();

export const isNeonConfigured = Boolean(dataApiUrl && authUrl);

export const neon = isNeonConfigured
  ? createClient({
      auth: {
        url: authUrl as string,
        allowAnonymous: true,
      },
      dataApi: {
        url: dataApiUrl as string,
      },
    })
  : null;

export const dataSourceLabel = isNeonConfigured
  ? "Neon Data API · dados conectados"
  : "Registro demonstrativo · Neon ainda não configurado";

export type PoliticianRecord = {
  id: string;
  slug: string;
  name: string;
  role: string;
  party: string | null;
  state: string | null;
  city: string | null;
  period: string | null;
  portrait_url: string | null;
  source_url: string | null;
  source_name: string | null;
  source_updated_at: string | null;
};

export async function fetchPublicPoliticians(): Promise<PoliticianRecord[]> {
  if (!neon) return [];

  const { data, error } = await neon
    .from("politicians")
    .select()
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as PoliticianRecord[];
}

/**
 * Keeps the editorial fields used by the MVP while allowing the public
 * identity fields to come from Neon. New records remain intentionally modest
 * until their dossier, promises and evidence have been reviewed.
 */
export function mergePublicPoliticians(
  records: PoliticianRecord[]
): Politician[] {
  if (records.length === 0) return demoPoliticians;

  return records.map(record => {
    const fallback = demoPoliticians.find(item => item.id === record.slug);
    if (fallback) {
      return {
        ...fallback,
        name: record.name,
        shortName: record.name,
        role: record.role,
        party: record.party ?? fallback.party,
        state: record.state ?? fallback.state,
        city: record.city ?? fallback.city,
        period: record.period ?? fallback.period,
        portrait: record.portrait_url ?? fallback.portrait,
      };
    }

    const isCandidacy = record.role.toLowerCase().includes("candidat");
    return {
      id: record.slug,
      name: record.name,
      shortName: record.name,
      role: record.role,
      party: record.party ?? "Partido não informado",
      state: record.state ?? "UF não informada",
      city: record.city ?? "Município não informado",
      period: record.period ?? "Período não informado",
      portrait: record.portrait_url ?? initialsAvatar(record.name),
      type: isCandidacy ? "candidatura" : "mandato",
      summary:
        "Perfil público em fase de catalogação. Consulte as fontes e o histórico de revisão antes de tirar conclusões.",
      elections: 0,
      wins: 0,
      mandates: 0,
      promises: 0,
      tracked: false,
      timeline: [],
      promisesList: [],
      stats: [],
    };
  });
}
