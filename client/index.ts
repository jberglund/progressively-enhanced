import { LayerManager } from "./manager";
import { loadContent } from "./loader";

const content = await loadContent("/example", "main");
console.log(content);

const lm = new LayerManager();
lm.create("dialog", content);
