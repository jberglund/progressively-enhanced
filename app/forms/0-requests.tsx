import { Hono } from "hono";

const app = new Hono().basePath("/requests");

/*
  - FormData
  - Post Resubmission
  - PRG
  - Location Header
  - curl
*/

app.get("/", (c) => {
  return c.render(
    <form action="/">
      <h1>I'm a GET 🐐</h1>
    </form>,
  );
});

app.post("/", (c) => {
  return c.render(<form action="/requests">I'm a POST ✉️</form>);
});

export default app;

/*
  curl -X POST \
    -d "name=back-in-the-ssr" \
    http://localhost:1337/requests | tidy -indent -quiet
*/
