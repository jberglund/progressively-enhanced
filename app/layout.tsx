import { jsxRenderer } from "hono/jsx-renderer";
import { css, Style } from "hono/css";
import type { PropsWithChildren } from "hono/jsx";

function NavItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: string;
}) {
  return (
    <a href={href} class="nav-item">
      <span class="nav-icon">{icon}</span>
      <span>{children}</span>
    </a>
  );
}

function Sidebar() {
  return (
    <flex-stack gap="l" class="h-full">
      <header class="site-header">
        <flex-stack horizontal="center" gap="s">
          <span class="text-xl">◈</span>
          <h1 class="text-m text-bold">P&E</h1>
        </flex-stack>
      </header>

      <nav>
        <flex-stack gap="2xs">
          <span class="text-xs text-medium px-s" style="opacity: 0.6;">
            Main
          </span>
          <NavItem href="/" icon="⌂">
            Dashboard
          </NavItem>
          <NavItem href="/customers" icon="♦">
            Customers
          </NavItem>
          <NavItem href="/appointments" icon="▣">
            Appointments
          </NavItem>
          <NavItem href="/calendar" icon="▦">
            Calendar
          </NavItem>
        </flex-stack>
      </nav>

      <nav>
        <flex-stack gap="2xs">
          <span class="text-xs text-medium px-s" style="opacity: 0.6;">
            Reports
          </span>
          <NavItem href="/analytics" icon="◲">
            Analytics
          </NavItem>
          <NavItem href="/invoices" icon="▤">
            Invoices
          </NavItem>
        </flex-stack>
      </nav>

      <nav class="mt-auto">
        <flex-stack gap="2xs">
          <NavItem href="/settings" icon="⚙">
            Settings
          </NavItem>
          <NavItem href="/help" icon="?">
            Help
          </NavItem>
        </flex-stack>
      </nav>
    </flex-stack>
  );
}

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

      <body>
        <LayoutComposition enabled={true}>{children}</LayoutComposition>
      </body>
    </html>
  ),
  { docType: true },
);

function LayoutComposition({
  enabled = true,
  children,
}: PropsWithChildren<{ enabled: boolean }>) {
  if (!enabled) {
    return <div class="p-xl">{children}</div>;
  }
  return (
    <div class="app-layout">
      <div class="app-sidebar">
        <Sidebar />
      </div>
      <main class="site-main">{children}</main>
      <flex-stack horizontal gap="m" class="ml-auto p-m">
        <a href="/customers/new" class="button" pe-layer="new drawer">
          Ny kunde
        </a>
        <a href="/appointments/new" class="button" pe-layer="new drawer">
          Ny avtale
        </a>
      </flex-stack>
    </div>
  );
}

export const fragmentRenderer = jsxRenderer(
  ({ children }) => <main class="site-main">{children}</main>,
  {
    docType: false,
  },
);
