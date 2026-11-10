// Lista de deputados acompanhados, guardada só neste navegador até existirem contas.
const CHAVE = "datademocracia:acompanhando";

export function lerAcompanhados(): number[] {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
    return Array.isArray(v) ? v.filter(n => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}

export function alternarAcompanhado(id: number): number[] {
  const atual = lerAcompanhados();
  const novo = atual.includes(id)
    ? atual.filter(x => x !== id)
    : [...atual, id];
  try {
    localStorage.setItem(CHAVE, JSON.stringify(novo));
  } catch {
    // Navegador sem armazenamento (modo privado): a escolha vale só nesta visita.
  }
  return novo;
}
