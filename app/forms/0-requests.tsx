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
    <div>
      <h1>I'm a GET 🐐</h1>
    </div>,
  );
});

app.post("/", (c) => {
  return c.render(<div>I'm a POST ✉️</div>);
});

export default app;

/*
  curl -X POST \
    -d "name=back-in-the-ssr" \
    http://localhost:1337/requests | tidy -indent -quiet
*/
