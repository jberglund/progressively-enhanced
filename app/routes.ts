import { createRoutes, int, str } from "typesafe-routes";

export const routes = createRoutes({
  books: {
    path: ["books"],
    children: {
      book: {
        path: [str("slug")], // /books/:slug
      },
    },
  },
  example: {
    path: ["example"],
    children: {
      success: { path: ["success"] },
    },
  },
  test: {
    path: ["test"],
  },
  colors: {
    path: ["colors"],
  },
  popover: {
    path: ["popover"],
  },
});
