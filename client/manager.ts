const layerTemplateElement = document.createElement("template");

layerTemplateElement.innerHTML = /*html*/ `
    <pe-popover popover="auto" id="lol">
      <pe-popover-content>
        <pe-outlet></pe-outlet>
      </pe-popover-content>
    </pe-popover>
`;

layerTemplateElement.id = "layer-template";

if (!document.getElementById(layerTemplateElement.id)) {
  document.body.appendChild(layerTemplateElement);
}

/**
 * LayerManager
 *
 * Manages the lifecycle of a single popover layer.
 * Supports 'dialog' and 'drawer' modes.
 */
export class LayerManager {
  private currentLayer: HTMLElement | null = null;
  private mode: "dialog" | "drawer" | null = null;

  /**
   * Creates and shows a new popover layer.
   * Reuses existing popover element if present.
   */
  create(mode: "dialog" | "drawer", html: string): void {
    // Clone from template
    const template = this.template as HTMLTemplateElement;
    if (!template) {
      throw new Error("Layer template not found");
    }

    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const popover = fragment.querySelector<HTMLElement>("pe-popover");

    if (!popover) {
      throw new Error("Popover element not found in template");
    }

    popover.setAttribute("mode", mode);

    const outlet = popover.querySelector("pe-outlet");
    if (outlet) {
      outlet.setHTMLUnsafe(html);
    }

    popover.addEventListener("toggle", (e) => {
      if (e.newState === "closed") {
        this.removeAfterAnimation(popover);
      }
    });

    document.body.appendChild(popover);

    popover.showPopover();

    this.currentLayer = popover;
    this.mode = mode;
  }

  private removeAfterAnimation(popover: HTMLElement) {
    const style = getComputedStyle(popover);

    // Check for animation
    const hasAnimation =
      style.animationName !== "none" && style.animationName !== "";

    // Check for transition
    const hasTransition =
      style.transitionDuration !== "0s" && style.transitionProperty !== "none";

    if (hasAnimation) {
      popover.addEventListener(
        "animationend",
        () => {
          popover.remove();
        },
        { once: true },
      );
    } else if (hasTransition) {
      popover.addEventListener(
        "transitionend",
        () => {
          popover.remove();
        },
        { once: true },
      );
    } else {
      // No animation or transition - remove immediately
      popover.remove();
    }
  }

  get template() {
    return document.getElementById(layerTemplateElement.id);
  }

  close(): void {
    if (this.currentLayer) {
      // this will remove the popover because of removeAfterAnimation
      this.currentLayer.hidePopover();

      this.currentLayer = null;
      this.mode = null;
    }
  }

  isOpen(): boolean {
    return this.currentLayer !== null;
  }

  getCurrentLayer(): HTMLElement | null {
    return this.currentLayer;
  }
}
