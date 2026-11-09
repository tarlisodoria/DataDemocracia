import { expect, test, type Page } from "@playwright/test";

// Rotas principais: cada uma precisa carregar sem erro, com título próprio
// e sem botões que não fazem nada.
const rotas = [
  "/",
  "/buscar",
  "/promessas",
  "/comparar",
  "/monitoramento",
  "/metodologia",
  "/politico/marina-albuquerque",
  "/politico/marina-albuquerque/dossie",
  "/politico/marina-albuquerque/radar",
  "/promessa/p1",
  "/deputado/204360",
];

function coletarErros(page: Page) {
  const erros: string[] = [];
  page.on("pageerror", e => erros.push(e.message));
  return erros;
}

// Botão sem onClick do React, que não envia formulário e não está desativado.
async function botoesSemAcao(page: Page) {
  return page.$$eval("button", botoes =>
    botoes
      .filter(b => {
        if (b.disabled || (b.type === "submit" && b.closest("form")))
          return false;
        const props = Object.keys(b).find(k => k.startsWith("__reactProps"));
        const p = props
          ? (b as unknown as Record<string, Record<string, unknown>>)[props]
          : {};
        return !p.onClick && !p.onPointerDown && !p.onMouseDown;
      })
      .map(b => (b.innerText || b.getAttribute("aria-label") || "").trim())
  );
}

for (const rota of rotas) {
  test(`carrega ${rota}`, async ({ page }) => {
    const erros = coletarErros(page);
    await page.goto(rota);
    await expect(page.locator("h1").first()).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(erros).toEqual([]);
    expect(await botoesSemAcao(page)).toEqual([]);
  });
}

test("endereços inexistentes mostram 404", async ({ page }) => {
  for (const rota of ["/politico/nao-existe", "/promessa/x", "/deputado/1"]) {
    await page.goto(rota);
    await expect(page.locator("h1")).toHaveText("404");
  }
});

test("busca lista os deputados reais e abre o perfil", async ({ page }) => {
  await page.goto("/buscar");
  const linhas = page.locator(".real-deputies .result-row");
  await expect(linhas).toHaveCount(20);
  await page.getByRole("button", { name: /Mostrar mais/ }).click();
  await expect(linhas).toHaveCount(50);
  await linhas.first().click();
  await expect(page).toHaveURL(/\/deputado\/\d+$/);
  await expect(page.locator(".metric-tile")).toHaveCount(4);
});

test("painel de votações aplica o filtro vindo do link", async ({ page }) => {
  const erros = coletarErros(page);
  await page.goto("/explorar/votacoes-2025.html?uf=PA&voto=N");
  await expect(page.locator("#chips")).toContainText("UF: PA");
  await expect(page.locator("canvas")).toHaveCount(6);
  await expect(page.locator("path.st")).toHaveCount(27);
  expect(erros).toEqual([]);
});
