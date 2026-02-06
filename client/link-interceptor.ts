import { loadContent } from "./loader";
import { layerManager } from "./manager";

/**
 * LinkInterceptor
 *
 * Intercepts clicks on [pe-layer] links and orchestrates layer opening.
 */
export function initLinkInterceptor(): void {
  document.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;

    // Check for pe-layer attribute (on clicked element or ancestor)
    const layerLink = target.closest<HTMLElement>("[pe-layer]");

    if (layerLink) {
      // Prevent default link navigation
      event.preventDefault();

      // Parse pe-layer value to extract mode
      const peLayerValue = layerLink.getAttribute("pe-layer") || "";
      const mode = parseLayerMode(peLayerValue);

      if (!mode) {
        console.warn(`Invalid pe-layer value: "${peLayerValue}"`);
        return;
      }

      // Get pe-target attribute (default to 'main')
      const peTarget = layerLink.getAttribute("pe-target") || "main";

      // Get href attribute
      const href = layerLink.getAttribute("href");

      if (!href) {
        console.warn("pe-layer link missing href attribute");
        return;
      }

      // Load content and create layer
      try {
        const html = await loadContent(href, peTarget);
        layerManager.create({ href: href, mode, html });
      } catch (error) {
        console.error("Failed to load layer content:", error);
        // Optionally show error in layer
        layerManager.create({
          href: href,
          mode: mode,
          html: `<div class="pe-layer__error">Failed to load content</div>`,
        });
      }
    }

    // Check for pe-dismiss attribute
    const dismissButton = target.closest<HTMLElement>("[pe-dismiss]");

    if (dismissButton && layerManager.getTopLayer()) {
      event.preventDefault();
      layerManager.close();
    }
  });
}

/**
 * Parse pe-layer attribute value to extract mode
 * Examples: "new dialog" → "dialog", "new drawer" → "drawer"
 */
function parseLayerMode(value: string): "dialog" | "drawer" | null {
  const normalized = value.toLowerCase().trim();

  if (normalized.includes("dialog")) {
    return "dialog";
  }

  if (normalized.includes("drawer")) {
    return "drawer";
  }

  return null;
}
