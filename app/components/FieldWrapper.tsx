import type { Child } from "hono/jsx";

type FieldWrapperProps = {
  label: string;
  name: string;
  id?: string;
  errors?: string[];
  children: Child;
};

export function FieldWrapper({
  label,
  name,
  id,
  errors,
  children,
}: FieldWrapperProps) {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;
  const hasErrors = errors && errors.length > 0;

  return (
    <fieldset enhance-form-group>
      <flex-stack gap="2xs" data-palette={hasErrors ? "error" : undefined}>
        <label for={inputId}>{label}</label>
        {children}
        {hasErrors && (
          <div id={errorId} class="text-s fg-subtle" role="alert">
            {errors.join(", ")}
          </div>
        )}
      </flex-stack>
    </fieldset>
  );
}