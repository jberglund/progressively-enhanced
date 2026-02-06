import "./enhance-form";
import "./crude-enhance-form";
import { LayerManager } from "./manager";
import { initLinkInterceptor } from "./link-interceptor";

const layerManager = new LayerManager();
initLinkInterceptor(layerManager);

document.addEventListener("change", (event) => {
  if ((event.target as HTMLElement)?.matches?.("[auto-submit]")) {
    event.preventDefault();
    const form = (event.target as HTMLElement).closest("form");
    if (form) {
      form.submit();
    }
  }
});
