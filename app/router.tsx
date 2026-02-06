import { Hono } from "hono";
import { fragmentRenderer, fullRenderer } from "./layout";
import { routes } from "./routes";
import { template } from "typesafe-routes";
import { exampleHandlers, exampleSuccessHandler } from "./validation-example";
import requests from "./forms/0-requests";
import simpleForm from "./forms/1-a-simple-form";
import validationForm from "./forms/2-a-validation-form";
import seriousForm from "./forms/3-a-serious-form";
import reservationForm from "./forms/9-reservation";
import customersApp from "./customers";
import appointmentsApp from "./appointments";
import popoverDemo from "./forms/4-forms-everywhere";

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

router.route("/", requests);
router.route("/", simpleForm);
router.route("/", validationForm);
router.route("/", seriousForm);
router.route("/", reservationForm);
router.route("/", customersApp);
router.route("/", appointmentsApp);
router.route("/", popoverDemo);
