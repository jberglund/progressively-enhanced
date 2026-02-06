# Progressive Enhancement Layers Implementation

## Summary

We're building a lightweight layer system inspired by Unpoly, using the native Popover API. Links decorated with `pe-layer="new dialog"` or `pe-layer="new drawer"` will open content in an overlay. The `pe-target` attribute specifies which element to extract from the fetched page (defaults to `main`). Links with `pe-dismiss` close the layer when clicked from within, or work normally when outside a layer.

Key constraints:

- Single layer at a time (no nesting)
- No URL updates
- No history manipulation
- TypeScript implementation
- Small, testable modules

---

## Module: ContentLoader

**Purpose:** Fetch and extract HTML fragments from URLs.

**Function signature:**

```typescript
async function loadContent(
  url: string,
  target: string = "main",
): Promise<string>;
```

**Steps:**

1. Fetch HTML from the provided URL
2. Parse the response text as a DOM document (using `DOMParser`)
3. Query for the element matching the `target` selector
4. Extract and return the `innerHTML` of the matched element
5. Throw an error if the fetch fails or target element is not found

**Considerations:**

- Handle network errors gracefully
- What if the target selector matches multiple elements? (use first match)
- Should we validate that we got HTML back? (check content-type header)
- Sanitization might be needed depending on trust level of fetched content

**Testing:** Mock `fetch`, assert correct selector extraction from parsed HTML, verify error handling for missing targets.

---

## Module: LayerManager

**Purpose:** Manage the lifecycle of the single popover layer.

**Class definition:**

```typescript
class LayerManager {
  private currentLayer: HTMLElement | null = null;
  private mode: "dialog" | "drawer" | null = null;

  create(mode: "dialog" | "drawer", html: string): void;
  close(): void;
  isOpen(): boolean;
  getCurrentLayer(): HTMLElement | null;
}
```

**Steps for `create()`:**

1. If no popover element exists, create `<div popover="manual" class="pe-layer">`
2. Clear any existing mode classes from the popover
3. Add mode-specific class (`pe-layer--dialog` or `pe-layer--drawer`)
4. Set the popover's `innerHTML` to the provided HTML
5. If not in DOM, append to `document.body`
6. Call `showPopover()` on the element
7. Store reference in `currentLayer` and save `mode`

**Steps for `close()`:**

1. If `currentLayer` exists, call `hidePopover()`
2. Clear `currentLayer` and `mode` references

**Considerations:**

- Reuse the same popover element for performance
- Clean up event listeners if needed (though DOM content replacement handles this)
- Should we clear content on close or leave it? (leave it for now, gets replaced on next open)
- The popover element stays in DOM after close (hidden), which is fine

**Testing:** Assert popover creation, class application, show/hide calls, state tracking (isOpen, getCurrentLayer).

---

## Module: LinkInterceptor

**Purpose:** Intercept clicks on `[pe-layer]` links and orchestrate layer opening.

**Function signature:**

```typescript
function initLinkInterceptor(): void;
```

**Steps:**

1. Add click event listener to `document` (event delegation)
2. Check if clicked element (or ancestor) has `pe-layer` attribute
3. Prevent default link navigation
4. Parse `pe-layer` value to extract mode ("new dialog" → 'dialog', "new drawer" → 'drawer')
5. Get `pe-target` attribute value (default to 'main')
6. Get `href` attribute value
7. Call `loadContent(href, target)` to fetch HTML
8. Call `LayerManager.create(mode, html)` with the result
9. Handle errors by optionally showing error message in layer

**Considerations:**

- Validate `pe-layer` format (must be "new dialog" or "new drawer")
- What if link has no `href`? (skip, log warning)
- Should we add loading state while fetching? (not initially, but good future enhancement)
- Error UX: show error in layer vs console only (show in layer for better UX)

**Testing:** Mock click events, verify preventDefault called, assert ContentLoader and LayerManager called with correct arguments.

---

## Module: DismissHandler

**Purpose:** Handle `[pe-dismiss]` link clicks to close layers.

**Function signature:**

```typescript
function initDismissHandler(): void;
```

**Steps:**

1. Add click event listener to `document` (event delegation)
2. Check if clicked element has `pe-dismiss` attribute
3. Check if the element is inside a layer using `closest('[popover]')`
4. If inside a layer:
   - Prevent default navigation
   - Call `LayerManager.close()`
5. If not inside a layer:
   - Do nothing (let the link navigate normally)

**Considerations:**

- Must use `closest()` to check layer ancestry, not just direct parent
- Should work with any element, not just `<a>` tags (buttons with pe-dismiss, etc.)
- The `[popover]` selector might be too generic if other code uses popovers (use `.pe-layer[popover]` instead)

**Testing:** Mock click events inside/outside layers, verify close() called only when inside layer, verify preventDefault behavior.

---

## Module: Main Entry Point

**Purpose:** Initialize all interceptors.

**Function signature:**

```typescript
function init(): void {
  initLinkInterceptor();
  initDismissHandler();
}
```

**Steps:**

1. Call `initLinkInterceptor()`
2. Call `initDismissHandler()`
3. Optionally: return cleanup function for removing event listeners

**Considerations:**

- When should this be called? (DOMContentLoaded, or immediately if script is deferred)
- Should we export LayerManager instance for external control? (maybe, but not required initially)
- Multiple init calls should be safe (idempotent)

**Testing:** Integration test verifying both interceptors are active after init.

---

## Types

```typescript
type LayerMode = "dialog" | "drawer";

interface LayerConfig {
  mode: LayerMode;
  target: string;
  url: string;
}
```

---

## Example Usage

```html
<!-- Open profile edit in a centered dialog -->
<a href="/profile/edit" pe-layer="dialog" pe-target=".edit-form">
  Edit Profile
</a>

<!-- Open sidebar navigation in a drawer -->
<a href="/navigation" pe-layer="drawer"> Menu </a>

<!-- Inside a layer, this closes it instead of navigating -->
<a href="/items" pe-dismiss>Cancel</a>
<a href="/items" pe-dismiss>OK, back to items</a>

<!-- Outside a layer, this navigates normally -->
<a href="/items" pe-dismiss>Back to items</a>
```

---

## Error Handling Strategy

- **Network errors:** Catch in LinkInterceptor, show error message in layer
- **Missing target:** Throw from ContentLoader, catch in LinkInterceptor
- **Invalid pe-layer value:** Log warning, ignore the link
- **Missing href:** Log warning, ignore the link
