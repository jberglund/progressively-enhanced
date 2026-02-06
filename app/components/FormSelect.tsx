import type { Child } from "hono/jsx";
import type { JSX } from "hono/jsx/jsx-runtime";
import { FieldWrapper } from "./FieldWrapper";

type FormSelectProps = {
  label: string;
  errors?: string[];
  children: Child;
} & JSX.IntrinsicElements["select"];

export function FormSelect({
  label,
  errors,
  children,
  id,
  name,
  ...rest
}: FormSelectProps) {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;
  const hasErrors = errors && errors.length > 0;

  return (
    <FieldWrapper label={label} name={name ?? ""} id={inputId} errors={errors}>
      <select
        class="select"
        id={inputId}
        name={name}
        aria-describedby={hasErrors ? errorId : undefined}
        aria-invalid={hasErrors ? "true" : undefined}
        {...rest}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}
