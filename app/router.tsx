import { Hono } from "hono";
import { fragmentRenderer, fullRenderer } from "./layout";
import { routes } from "./routes";
import { template } from "typesafe-routes";
import { exampleHandlers, exampleSuccessHandler } from "./validation-example";
import simpleForm from "./forms/1-a-simple-form";
import validationForm from "./forms/2-a-validation-form";
import enhancingForm from "./forms/3-href-eller-action";
import seriousForm from "./forms/4-a-serious-form";
import reservationForm from "./forms/05-reservation";

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

router.route("/", simpleForm);
router.route("/", validationForm);
router.route("/", enhancingForm);
router.route("/", seriousForm);
router.route("/", reservationForm);
