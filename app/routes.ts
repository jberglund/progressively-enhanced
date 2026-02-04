import { createRoutes, int, str } from "typesafe-routes";

export const routes = createRoutes({
  example: {
    path: ["example"],
    children: {
      success: { path: ["success"] },
    },
  },
  form: {
    path: ["form"],
    children: {
      simplest: {
        path: ["simplest"],
      },
    },
  },
});
