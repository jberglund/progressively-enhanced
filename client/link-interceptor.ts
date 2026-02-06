import { loadContent } from "./loader";
import { LayerManager } from "./manager";
import { layerAttributes, defaultTarget } from "./types";

export function initLinkInterceptor(manager: LayerManager): void {
  document.addEventListener("click", async (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const layerLink = target.closest<HTMLElement>(`[${layerAttributes.layer}]`);

    if (layerLink) {
      event.preventDefault();

      const mode = layerLink.getAttribute(layerAttributes.layer);

      if (!mode) {
        console.warn(`${layerAttributes.layer} attribute is empty`);
        return;
      }

      const peTarget =
        layerLink.getAttribute(layerAttributes.target) || defaultTarget;

      const href = layerLink.getAttribute("href");

      if (!href) {
        console.warn(`${layerAttributes.layer} link missing href attribute`);
        return;
      }

      try {
        const html = await loadContent(href, peTarget);
        manager.create({ href, mode, html });
      } catch (error) {
        console.error("Failed to load layer content:", error);
        manager.create({
          href,
          mode,
          html: `<div>Failed to load content</div>`,
        });
      }
    }

    const dismissButton = target.closest<HTMLElement>(
      `[${layerAttributes.dismiss}]`,
    );

    if (dismissButton) {
      event.preventDefault();
      manager.close();
    }
  });
}
