//
// Det som varit visat nu är så standard webb som man får det
// Request HTML -> stuff -> Response in HTML
//
//
// Klientsidan, gogo!
//
// const response = await fetch($0.action, { body: new FormData($0), method: $0.method})
// const text = await response.text()
// const parser = new DOMParser();
// const html = parser.parseFromString(text, 'text/html');
// html.querySelector('form')
// document.querySelector('form').replaceWith(html.querySelector('form'))

import { Hono } from "hono";
import { ValidationForm } from "./2-a-validation-form";

export const path = "/href-or-form";
const app = new Hono().basePath(path);

app.get("/", async (c) => {
  return c.render(
    <div>
      <p>Bägge två här gör i pricip samma sak.</p>

      <a href="/a-validation-form">Till form</a>

      <ValidationForm />
    </div>,
  );
});

export default app;
