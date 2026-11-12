import { expect, test } from "@playwright/test";

test("apresenta a fundação e permite percorrer as sete etapas", async ({
  page,
  isMobile,
}, testInfo) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Da ideia à evidência." }),
  ).toBeVisible();
  await expect(
    page.getByText("O acesso está em preparação. Nenhum projeto foi criado."),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("inicio-claro.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("link", { name: "Conhecer a trilha", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Dor.", exact: true }),
  ).toBeVisible();
  for (let number = 2; number <= 7; number++) {
    await page
      .getByRole("link", { name: "Próxima etapa", exact: true })
      .click();
    await expect(page).toHaveURL(`/trilha/${number}`);
  }
  await expect(
    page.getByRole("heading", { name: "Tração / PMF." }),
  ).toBeVisible();
  if (isMobile) {
    await page
      .getByRole("combobox", { name: "Etapas da análise" })
      .selectOption("3");
    await expect(
      page.getByRole("heading", { name: "Tamanho.", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  } else {
    await expect(page.getByText("O caminho é para cima.")).toBeInViewport();
    const nav = page.getByRole("navigation", {
      name: "Etapas da análise",
      exact: true,
    });
    await nav.getByRole("link").first().focus();
    await page.keyboard.press("ArrowDown");
    await expect(nav.getByRole("link").nth(1)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/trilha/2");
  }
  expect(browserErrors).toEqual([]);
});

test("tema claro é padrão e a escolha escura persiste após recarregar", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass("light");
  await page
    .getByRole("button", { name: "Alternar tema claro e escuro" })
    .click();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.reload();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.screenshot({
    path: testInfo.outputPath("inicio-escuro.png"),
    fullPage: true,
  });
});

test("acesso indisponível é explícito e caminhos inválidos têm retorno", async ({
  page,
}, testInfo) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Acesso por convite." }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "A configuração do acesso ainda não foi concluída",
  );
  await expect(page.getByLabel("E-mail do convite")).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Receber link de acesso" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Continuar com GitHub" }),
  ).toBeDisabled();
  await page.screenshot({
    path: testInfo.outputPath("login-pendente.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.goto("/trilha/99");
  await expect(
    page.getByRole("heading", { name: "Esta página ficou fora da trilha." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Voltar ao início", exact: true })
    .click();
  await expect(page).toHaveURL("/");
});

test("rotas privadas e callbacks permanecem fechados sem configuração", async ({
  page,
  request,
}) => {
  for (const path of [
    "/workspaces",
    "/w/do-fundo-do-poco",
    "/w/meus-projetos",
  ]) {
    await page.goto(path);
    await expect(page).toHaveURL("/login");
    await expect(
      page.getByRole("heading", { name: "Acesso por convite." }),
    ).toBeVisible();
  }
  for (const path of [
    "/auth/callback?code=invalido&next=https://evil.test",
    "/auth/confirm?token_hash=invalido&type=email",
  ]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(503);
    expect(response.headers()["location"]).toBeUndefined();
    expect(response.headers()["cache-control"]).toContain("no-store");
  }
});
