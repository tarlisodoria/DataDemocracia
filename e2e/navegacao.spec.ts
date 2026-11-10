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
  "/gastos",
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
  const linhas = page.locator(".results-list .result-row");
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

test("compara dois deputados reais e guarda a escolha no endereço", async ({
  page,
}) => {
  await page.goto("/comparar?a=204379&b=204360");
  await expect(page.locator(".cmp-col")).toHaveCount(2);
  await expect(page.locator(".cmp-head strong").first()).toHaveText(
    "Acácio Favacho"
  );
  await expect(page.locator(".cmp-together")).toContainText("votaram igual");
});

test("acompanhar um deputado o leva para o monitoramento", async ({ page }) => {
  await page.goto("/deputado/204379");
  await page.getByRole("button", { name: "Acompanhar" }).click();
  await expect(
    page.getByRole("button", { name: "Acompanhando" })
  ).toBeVisible();
  await page.goto("/monitoramento");
  await expect(page.locator(".mon-card")).toHaveCount(1);
  await expect(page.locator(".mon-card strong").first()).toHaveText(
    "Acácio Favacho"
  );
});

test("home destaca deputados e votações reais", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".politician-card")).toHaveCount(3);
  await expect(page.locator(".politician-card").first()).toHaveAttribute(
    "href",
    /\/deputado\/\d+$/
  );
  await expect(page.locator(".update-row")).toHaveCount(4);
});

test("perfil mostra a cota parlamentar quando o arquivo existe", async ({
  page,
}) => {
  // O arquivo real é gerado pela coleta; aqui usamos um recorte com os deputados do AP.
  await page.route("**/explorar/dados/cota-2025.json", route =>
    route.fulfill({ path: "e2e/fixtures/cota-2025.json" })
  );
  await page.goto("/deputado/204379");
  const secao = page
    .locator("section", { hasText: "Cota parlamentar" })
    .first();
  await expect(secao.locator("h2")).toContainText("R$ 486.603");
  await expect(secao).toContainText("mediana dos deputados de AP");
  await expect(secao.locator(".cota-months > div")).toHaveCount(12);
  await expect(secao.locator("tbody tr")).toHaveCount(5);
});

test("perfil sem o arquivo da cota não quebra", async ({ page }) => {
  await page.route("**/explorar/dados/cota-2025.json", route =>
    route.fulfill({ status: 404 })
  );
  await page.goto("/deputado/204379");
  await expect(page.locator("h1")).toHaveText("Acácio Favacho");
  await expect(page.locator(".cota-grid")).toHaveCount(0);
});

test("perfil mostra presença, comissões e projetos quando o arquivo existe", async ({
  page,
}) => {
  await page.route("**/explorar/dados/atuacao-2025.json", route =>
    route.fulfill({ path: "e2e/fixtures/atuacao-2025.json" })
  );
  await page.goto("/deputado/204379");
  const secao = page.locator("section", { has: page.locator(".atu-tiles") });
  await expect(secao.locator(".atu-tiles > div").first()).toContainText(
    "105 de 120"
  );
  await expect(secao.locator(".atu-orgaos li")).toHaveCount(5);
  await expect(secao.locator(".atu-props li")).toHaveCount(3);
});

test("página da cota mostra o panorama e filtra por partido", async ({
  page,
}) => {
  await page.route("**/explorar/dados/cota-2025.json", route =>
    route.fulfill({ path: "e2e/fixtures/cota-2025.json" })
  );
  await page.goto("/gastos");
  await expect(page.locator(".gastos-resumo strong").nth(1)).toHaveText("14");
  await expect(page.locator(".dep-table tbody tr")).toHaveCount(14);
  await page.getByLabel("Ordenar por").selectOption("nome");
  await expect(page.locator(".dep-table tbody tr").first()).toContainText(
    "Acácio Favacho"
  );
  await page.getByLabel("Partido").selectOption("MDB");
  const linhas = page.locator(".dep-table tbody tr");
  await expect(linhas.first()).toContainText("MDB-AP");
  expect(await linhas.count()).toBeLessThan(14);
});

test("página da cota sem o arquivo explica a ausência", async ({ page }) => {
  await page.route("**/explorar/dados/cota-2025.json", route =>
    route.fulfill({ status: 404 })
  );
  await page.goto("/gastos");
  await expect(page.getByText("ainda não foram coletados")).toBeVisible();
});
