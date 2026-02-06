import type { JSX } from "hono/jsx";
import { FieldWrapper } from "./FieldWrapper";

type FormTextareaProps = JSX.IntrinsicElements["textarea"] & {
  label: string;
  name: string;
  errors?: string[];
};

export function FormTextarea({
  label,
  name,
  id,
  errors,
  children,
  ...rest
}: FormTextareaProps) {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;
  const hasErrors = errors && errors.length > 0;

  return (
    <FieldWrapper label={label} name={name} id={id} errors={errors}>
      <textarea
        class="textarea"
        id={inputId}
        name={name}
        aria-describedby={hasErrors ? errorId : undefined}
        aria-invalid={hasErrors ? "true" : undefined}
        {...rest}
      >
        {children}
      </textarea>
    </FieldWrapper>
  );
}
