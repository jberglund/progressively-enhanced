import type { LayerOptions } from "./types";

const focusMap = new WeakMap<HTMLElement, HTMLElement | null>();

const layerTemplate = document.createElement("template");
layerTemplate.innerHTML = `
  <pe-popover-dismiss></pe-popover-dismiss>
  <pe-popover popover="auto">
    <pe-popover-content>
      <pe-outlet></pe-outlet>
    </pe-popover-content>
  </pe-popover>
`;

export class LayerManager {
  create(options: LayerOptions): void {
    const { href, mode, html } = options;

    const existing = this.findByHref(href);
    if (existing) {
      this.focusLayer(existing);
      return;
    }

    const { popover, dismiss } = this.createPopoverElement(href, mode, html);
    this.attachListeners(popover, dismiss);

    const previouslyFocused = document.activeElement as HTMLElement | null;
    focusMap.set(popover, previouslyFocused);

    // Nested inside top layer so light-dismiss (popover="auto") only closes the current layer
    const parent = this.getTopLayer() ?? document.body;

    parent.appendChild(dismiss);
    parent.appendChild(popover);
    popover.showPopover();
    this.focusLayer(popover);
  }

  close(): void {
    const popover = this.getTopLayer();
    if (!popover) return;

    popover.hidePopover();
  }

  getTopLayer(): HTMLElement | null {
    const all = document.querySelectorAll<HTMLElement>("pe-popover[popover]");
    return all[all.length - 1] ?? null;
  }

  private findByHref(href: string): HTMLElement | null {
    return document.querySelector(
      `pe-popover[data-href="${CSS.escape(href)}"]`,
    );
  }

  private createPopoverElement(
    href: string,
    mode: string,
    html: string,
  ): { popover: HTMLElement; dismiss: HTMLElement } {
    const fragment = layerTemplate.content.cloneNode(true) as DocumentFragment;
    const dismiss = fragment.querySelector<HTMLElement>("pe-popover-dismiss");
    const popover = fragment.querySelector<HTMLElement>("pe-popover");

    if (!popover || !dismiss) {
      throw new Error("Popover or dismiss element not found in template");
    }

    popover.setAttribute("data-href", href);
    popover.setAttribute("mode", mode);

    const outlet = popover.querySelector("pe-outlet");
    if (outlet) {
      outlet.setHTMLUnsafe(html);
    }

    return { popover, dismiss };
  }

  private attachListeners(popover: HTMLElement, dismiss: HTMLElement): void {
    popover.addEventListener("toggle", (e) => {
      if ((e as ToggleEvent).newState === "closed") {
        this.handlePopoverClosed(popover, dismiss);
      }
    });

    dismiss.addEventListener("click", () => {
      popover.hidePopover();
    });
  }

  private handlePopoverClosed(
    popover: HTMLElement,
    dismiss: HTMLElement,
  ): void {
    const previouslyFocused = focusMap.get(popover);
    focusMap.delete(popover);

    dismiss.remove();
    this.removeAfterAnimation(popover);

    if (previouslyFocused) {
      previouslyFocused.focus();
    }
  }

  private focusLayer(popover: HTMLElement): void {
    const focusTarget = popover.querySelector<HTMLElement>(
      '[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusTarget?.focus();
  }

  private removeAfterAnimation(popover: HTMLElement): void {
    const animations = popover.getAnimations();

    if (animations.length > 0) {
      Promise.all(animations.map((a) => a.finished)).then(() =>
        popover.remove(),
      );
    } else {
      popover.remove();
    }
  }
}
