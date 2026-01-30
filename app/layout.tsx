import { jsxRenderer } from "hono/jsx-renderer";
import { routes } from "./routes";
import { renderPath } from "typesafe-routes";
import { css, Style } from "hono/css";

export const fullRenderer = jsxRenderer(
  ({ children }) => (
    <html lang="en" data-palette="neutral">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles.css" />
        <Style>{css`
          @view-transition {
            navigation: auto;
          }
        `}</Style>
        <script src="/static/main.js" async />
        <script src="/client/index.ts" type="module" />
      </head>

      <body class="p-xl">
        <header class="site-header">
          <flex-stack horizontal gap="xl">
            <h1 style="font-size: 1rem;">Progressive Enhancement</h1>
            <nav>
              <flex-stack horizontal gap="s">
                <a
                  class="nav-item link"
                  href={renderPath(routes.example, {})}
                  pe-layer="new drawer"
                >
                  Validation
                </a>
                <a
                  class="nav-item link"
                  href={renderPath(routes.books, { name: "10" })}
                >
                  Books
                </a>
                <a class="nav-item link" href={renderPath(routes.test, {})}>
                  "Components"
                </a>
                <a class="nav-item link" href={renderPath(routes.colors, {})}>
                  Colors
                </a>
              </flex-stack>
            </nav>
          </flex-stack>
        </header>
        <main class="site-main">{children}</main>
      </body>
    </html>
  ),
  { docType: true },
);

export const fragmentRenderer = jsxRenderer(
  ({ children }) => <main class="site-main">{children}</main>,
  {
    docType: false,
  },
);
