import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { normalizeMerchantNumber } from "../../src/config/whatsapp";
import { parseSiteUrl } from "../../src/config/site-url";

test("merchant and site configuration controls ordering and SEO", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("main").getByText("Order Online", { exact: true });
  const configured = normalizeMerchantNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  if (configured) {
    await expect(hero).toHaveAttribute("href", `https://wa.me/${configured}`);
  } else {
    await expect(hero).toHaveAttribute("aria-disabled", "true");
    await expect(hero).not.toHaveAttribute("href", /wa\.me/);
  }
  const origin = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  if (origin) {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", origin);
    expect(await sitemap.text()).toContain(origin);
  } else {
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  }
  expect(await (await page.request.get("/robots.txt")).text()).toContain("Disallow: /checkout");
});

test("menu navigation, category selection, food prices, and restricted rum", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Explore Menu" })).toHaveAttribute("href", "/#menu");
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Menu", exact: true }).click();
  } else {
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Menu", exact: true }).click();
  }
  await expect(page).toHaveURL(/#menu$/);
  await expect(page.getByRole("tab", { name: "Sugarcane Juice", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Main Course", exact: true }).click();
  for (const name of ["Nasi Bakar", "Nasi Sop Ayam"]) {
    const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name, exact: true }) });
    await expect(card).toContainText(/19[.,]000/);
    await card.getByRole("button", { name: "Add to Cart", exact: true }).click();
  }
  await page.getByRole("tab", { name: "Snacks", exact: true }).click();
  for (const name of ["Risol Mayo", "Risol Sayur / Rouguette"]) {
    const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name, exact: true }) });
    await expect(card).toContainText(/6[.,]000/);
    await card.getByRole("button", { name: "Add to Cart", exact: true }).click();
  }
  await expect(page.getByRole("button", { name: /View cart, 4 items/ })).toContainText(/50[.,]000/);
  await page.getByRole("tab", { name: "Alcoholic Beverage", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(/50[.,]000/);
  await expect(page.getByRole("tabpanel")).toContainText(/Licensing, age verification/);
  await expect(page.getByRole("button", { name: "Currently unavailable" })).toBeDisabled();
  await page.getByRole("button", { name: /View cart/ }).click();
  await expect(page.getByRole("dialog", { name: "Your Fresh Order" })).not.toContainText("Rum");
  await page.getByRole("button", { name: "Clear cart" }).click();
  await expect(page.getByRole("button", { name: "Continue to Checkout" })).toBeDisabled();
  await expect(page.getByRole("dialog")).toContainText("Nothing here yet");
  expect(errors).toEqual([]);
});

test("configuration survives cart, refresh, quantity changes and checkout review", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const original = page.getByRole("article").filter({ has: page.getByRole("heading", { name: "Original", exact: true }) });
  await original.getByRole("button", { name: "250 ml", exact: true }).click();
  await original.getByRole("button", { name: "Configure Original", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Original", exact: true });
  await expect(dialog.getByRole("radio", { name: /Personal Bottle.*250 ml/ })).toBeChecked();
  await expect(dialog).toContainText("Bottle: 250 ml");
  await dialog.getByRole("checkbox", { name: /Lemon/ }).check();
  await dialog.getByRole("checkbox", { name: /Lime/ }).check();
  await dialog.getByRole("button", { name: "Increase quantity", exact: true }).click();
  await expect(dialog).toContainText(/36[.,]000/);
  await dialog.getByRole("button", { name: "Add To Cart", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: /View cart, 2 items/ })).toBeVisible();
  await page.getByRole("button", { name: /View cart/ }).click();
  const cart = page.getByRole("dialog", { name: "Your Fresh Order" });
  await expect(cart).toContainText("250 ml");
  await expect(cart).toContainText("Lemon");
  await expect(cart).toContainText("Lime");
  await cart.getByRole("button", { name: /Increase quantity/i }).click();
  await expect(cart).toContainText(/54[.,]000/);
  await cart.getByRole("button", { name: "Continue to Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByRole("button", { name: /(?:Save order & prepare|Prepare) WhatsApp message/ }).click();
  await expect(page.getByLabel("Customer name", { exact: false })).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Customer name", { exact: false }).fill("Test Customer");
  await page.getByLabel("Phone number", { exact: false }).fill("081234567890");
  await page.getByRole("radio", { name: "Delivery", exact: true }).check();
  await page.getByRole("button", { name: /(?:Save order & prepare|Prepare) WhatsApp message/ }).click();
  await expect(page.getByLabel("Delivery address", { exact: false })).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Delivery address", { exact: false }).fill("Test address, Jakarta");
  await page.getByLabel("Order notes (optional)").fill("Less ice & no straw");
  await page.screenshot({ path: testInfo.outputPath("checkout.png"), fullPage: true });
  const checkoutAccessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(checkoutAccessibility.violations).toEqual([]);
  await expect(page.getByRole("complementary", { name: "Your order" })).toContainText("Pending delivery quote");
  await page.getByRole("button", { name: /(?:Save order & prepare|Prepare) WhatsApp message/ }).click();
  await expect(page.getByRole("status")).toContainText("Your message is prepared");
  await page.getByText("Preview prepared message", { exact: true }).click();
  const preview = page.locator("pre");
  await expect(preview).toContainText("Test Customer");
  await expect(preview).toContainText("250 ml");
  await expect(preview).toContainText("Lemon");
  await expect(preview).toContainText("Lime");
  await expect(preview).toContainText("Less ice & no straw");
  await expect(preview).toContainText(/54[.,]000/);
  const open = page.getByRole("link", { name: "Open WhatsApp", exact: true });
  if (await open.count()) {
    const url = new URL((await open.getAttribute("href"))!);
    expect(url.origin).toBe("https://wa.me");
    expect(url.searchParams.get("text")).toContain("Less ice & no straw");
  } else {
    await expect(page.getByRole("button", { name: "Open WhatsApp — unavailable" })).toBeDisabled();
  }
  await page.getByLabel("Order notes (optional)").fill("Changed after review");
  await expect(page.locator("pre")).not.toBeVisible();
  await page.reload();
  await expect(page.getByRole("complementary", { name: "Your order" })).toContainText(/54[.,]000/);
  expect(errors).toEqual([]);
});

test("empty and corrupt carts recover safely", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("tebunai-cart-v1", "{broken-json"));
  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse the menu" })).toHaveAttribute("href", "/#menu");
});

test("keyboard configuration and automated accessibility checks", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Tebu Nai.*Fresh Sugarcane Juice/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /sugarcane juice/i);
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(width.scroll).toBeLessThanOrEqual(width.viewport);
  const home = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(home.violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("home.png") });
  await page.getByRole("button", { name: "Configure Original", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Original", exact: true });
  await expect(dialog).toBeVisible();
  const modal = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(modal.violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("configurator.png") });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Configure Original", exact: true })).toBeFocused();
});
