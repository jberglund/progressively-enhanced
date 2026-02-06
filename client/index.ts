import "./enhance-form";
import "./crude-enhance-form";
import { layerManager } from "./manager";
import { initLinkInterceptor } from "./link-interceptor";

initLinkInterceptor(layerManager);

document.addEventListener("change", (event) => {
  if (event.target?.matches("[auto-submit]")) {
    event.preventDefault();
    const form = event.target.closest("form");
    if (form) {
      form.submit();
    }
  }
});
