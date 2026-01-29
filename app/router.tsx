import { Hono } from "hono";
import { fragmentRenderer, fullRenderer } from "./layout";
import { routes } from "./routes";
import { template } from "typesafe-routes";
import { exampleHandlers, exampleSuccessHandler } from "./validation-example";
import { booksHandlers } from "./books";
import { ComponentsTest } from "./components-test";
import { ColorsTest } from "./colors-test";

export const router = new Hono();

/*  If we get X-Up-Target, we only render <main> */
router.use("*", (c, next) => {
  c.header("Vary", "X-Up-Target", { append: true });
  return c.req.header("X-Up-Target")
    ? fragmentRenderer(c, next)
    : fullRenderer(c, next);
});

router.get("/", (c) => {
  return c.render(<div>Welcome to this progressive enhancement demo app</div>);
});

// Example form page
router.get(template(routes.example), exampleHandlers.get);
router.post(template(routes.example), exampleHandlers.post);
router.get(template(routes.example.success), exampleSuccessHandler);

// Books routes
router.get(template(routes.books), booksHandlers.get);
router.get(template(routes.books.book), (c) => {
  const slug = c.req.param("slug");
  return c.render(<div>Book: {slug}</div>);
});

router.get(template(routes.test), (c) => {
  return c.render(<ComponentsTest />);
});

router.get(template(routes.colors), (c) => {
  return c.render(<ColorsTest />);
});
