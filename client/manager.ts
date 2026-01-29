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
    // Get or create the popover element
    let popover = document.querySelector<HTMLElement>(".pe-layer");

    if (!popover) {
      popover = document.createElement("div");
      popover.setAttribute("popover", "manual");
      popover.className = "pe-layer";
    }

    // Clear any existing mode classes
    popover.classList.remove("pe-layer--dialog", "pe-layer--drawer");

    // Add mode-specific class
    popover.classList.add(`pe-layer--${mode}`);

    // Set content
    popover.innerHTML = html;

    // Append to body if not already in DOM
    if (!popover.parentElement) {
      document.body.appendChild(popover);
    }

    // Show the popover
    popover.showPopover();

    // Store references
    this.currentLayer = popover;
    this.mode = mode;
  }

  /**
   * Closes and cleans up the current layer.
   */
  close(): void {
    if (this.currentLayer) {
      // Hide the popover
      this.currentLayer.hidePopover();

      // Clean up: remove from DOM
      this.currentLayer.remove();

      // Clear references
      this.currentLayer = null;
      this.mode = null;
    }
  }

  /**
   * Checks if a layer is currently open.
   */
  isOpen(): boolean {
    return this.currentLayer !== null;
  }

  /**
   * Gets the current layer element.
   */
  getCurrentLayer(): HTMLElement | null {
    return this.currentLayer;
  }
}
