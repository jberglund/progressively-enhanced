import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import { router } from "./router";
const app = new Hono();

// Handle TypeScript files with Bun's transpiler
app.get("/client/*.ts", async (c) => {
  const filepath = `.${c.req.path}`;
  const file = Bun.file(filepath);

  if (!(await file.exists())) {
    return c.notFound();
  }

  const transpiled = await Bun.build({
    entrypoints: [filepath],
    target: "browser",
    minify: false,
    sourcemap: "inline",
  });

  return c.body(await transpiled.outputs[0].text(), 200, {
    "Content-Type": "application/javascript; charset=utf-8",
  });
});

app.use("/static/*", serveStatic({ root: "./" }));
app.route("/", router);

export default {
  port: 1337,
  fetch: app.fetch,
};
