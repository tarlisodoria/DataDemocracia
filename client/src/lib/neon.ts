import { createClient } from "@neondatabase/neon-js";

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
