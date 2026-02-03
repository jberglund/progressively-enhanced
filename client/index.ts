import { LayerManager } from "./manager";
import "./enhance-form";
import { initLinkInterceptor } from "./link-interceptor";

const lm = new LayerManager();
//lm.create("dialog", content);

initLinkInterceptor(lm);
