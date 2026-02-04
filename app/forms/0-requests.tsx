import { Hono } from "hono";

const app = new Hono();

/*
  I sin enklaste form på en server.

*/

app.get("/requests", (c) => {
  return c.render(<div>I'm a GET 🐐</div>);
});

app.post("/requests", (c) => {
  return c.render(<div>I'm a POST ✉️</div>);
});

app.on(["GET", "POST"], "/post", (c) => c.text("i am bof"));

export default app;
