import "./enhance-form";
import "./crude-enhance-form";
import { LayerManager } from "./manager";
import { initLinkInterceptor } from "./link-interceptor";

const lm = new LayerManager();

initLinkInterceptor(lm);
