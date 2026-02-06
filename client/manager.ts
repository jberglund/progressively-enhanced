const layerTemplateElement = document.createElement("template");

layerTemplateElement.innerHTML = /*html*/ `
    <pe-popover popover="auto">
      <pe-popover-content>
        <pe-outlet></pe-outlet>
      </pe-popover-content>
    </pe-popover>
`;

layerTemplateElement.id = "layer-template";

if (!document.getElementById(layerTemplateElement.id)) {
  document.body.appendChild(layerTemplateElement);
}

type LayerMode = "dialog" | "drawer";

interface LayerOptions {
  href: string;
  mode: LayerMode;
  html: string;
}

/**
 * LayerManager
 *
 * Manages a stack of popover layers.
 * Supports 'dialog' and 'drawer' modes.
 */
class LayerManager {
  private stack: HTMLElement[] = [];

  create(options: LayerOptions): void {
    const { href, mode, html } = options;

    const existing = this.findByHref(href);
    if (existing) {
      this.focusLayer(existing);
      return;
    }

    const popover = this.createPopoverElement(href, mode, html);
    this.attachListeners(popover);

    const previouslyFocused = document.activeElement as HTMLElement | null;
    (popover as any)._previouslyFocused = previouslyFocused;

    document.body.appendChild(popover);
    popover.showPopover();

    this.setInert(true);
    this.focusLayer(popover);
    this.stack.push(popover);
  }

  close(): void {
    const popover = this.stack.pop();
    if (!popover) return;

    popover.hidePopover();

    if (this.stack.length === 0) {
      this.setInert(false);
    }

    const previouslyFocused = (popover as any)
      ._previouslyFocused as HTMLElement | null;
    if (previouslyFocused) {
      previouslyFocused.focus();
    }
  }

  closeAll(): void {
    while (this.stack.length > 0) {
      this.close();
    }
  }

  isOpen(): boolean {
    return this.stack.length > 0;
  }

  getTopLayer(): HTMLElement | null {
    return this.stack[this.stack.length - 1] ?? null;
  }

  private findByHref(href: string): HTMLElement | null {
    return document.querySelector(
      `pe-popover[data-href="${CSS.escape(href)}"]`,
    );
  }

  private createPopoverElement(
    href: string,
    mode: LayerMode,
    html: string,
  ): HTMLElement {
    const template = document.getElementById(
      layerTemplateElement.id,
    ) as HTMLTemplateElement;
    if (!template) {
      throw new Error("Layer template not found");
    }

    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const popover = fragment.querySelector<HTMLElement>("pe-popover");

    if (!popover) {
      throw new Error("Popover element not found in template");
    }

    const id = `layer-${href.replace(/[^a-zA-Z0-9]/g, "-")}`;
    popover.id = id;
    popover.setAttribute("data-href", href);
    popover.setAttribute("mode", mode);

    const outlet = popover.querySelector("pe-outlet");
    if (outlet) {
      outlet.setHTMLUnsafe(html);
    }

    return popover;
  }

  private attachListeners(popover: HTMLElement): void {
    popover.addEventListener("toggle", (e) => {
      if ((e as ToggleEvent).newState === "closed") {
        this.removeFromStack(popover);
        if (this.stack.length === 0) {
          this.setInert(false);
        }
        this.removeAfterAnimation(popover);
      }
    });

    popover.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        this.close();
      }
    });
  }

  private focusLayer(popover: HTMLElement): void {
    const focusTarget = popover.querySelector<HTMLElement>(
      '[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusTarget?.focus();
  }

  private removeFromStack(popover: HTMLElement): void {
    const index = this.stack.indexOf(popover);
    if (index > -1) {
      this.stack.splice(index, 1);
    }
  }

  private setInert(inert: boolean): void {
    for (const child of document.body.children) {
      if (child instanceof HTMLElement && child.tagName !== "PE-POPOVER") {
        child.inert = inert;
      }
    }
  }

  private removeAfterAnimation(popover: HTMLElement): void {
    const style = getComputedStyle(popover);

    const hasAnimation =
      style.animationName !== "none" && style.animationName !== "";

    const hasTransition =
      style.transitionDuration !== "0s" && style.transitionProperty !== "none";

    if (hasAnimation) {
      popover.addEventListener("animationend", () => popover.remove(), {
        once: true,
      });
    } else if (hasTransition) {
      popover.addEventListener("transitionend", () => popover.remove(), {
        once: true,
      });
    } else {
      popover.remove();
    }
  }
}

export const layerManager = new LayerManager();

window.layerManager = layerManager;
