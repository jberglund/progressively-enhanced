import type { Child } from "hono/jsx";

type PageHeaderProps = {
  title: string;
  backHref?: string;
  backLabel?: string;
  children?: Child;
};

export function PageHeader({
  title,
  backHref,
  backLabel = "Tilbake",
  children,
}: PageHeaderProps) {
  return (
    <header class="pb-xl">
      <flex-stack gap="m">
        {backHref && (
          <a href={backHref} pe-dismiss>
            ← {backLabel}
          </a>
        )}
        <flex-stack horizontal gap="l">
          <h1 class="text-xl">{title}</h1>
          {children && <div class="ml-auto">{children}</div>}
        </flex-stack>
      </flex-stack>
    </header>
  );
}
