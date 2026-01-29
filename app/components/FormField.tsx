export const FormField = ({
  label,
  name,
  type = "text",
  id,
  value,
  errors,
  validate = false,
}: {
  label: string;
  name: string;
  type?: string;
  value?: string | number;
  errors?: string[];
  validate?: boolean;
  id?: string;
}) => {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;
  const hasErrors = errors && errors.length > 0;

  return (
    <flex-stack gap="2xs" up-form-group data-palette="error">
      <label for={inputId}>{label}</label>
      <input
        class="input"
        type={type}
        id={inputId}
        name={name}
        value={value}
        autocomplete="off"
        aria-describedby={hasErrors ? errorId : undefined}
        aria-invalid={hasErrors ? "true" : undefined}
        {...(validate ? { "up-validate": true } : {})}
      />
      {hasErrors && (
        <div
          data-palette="error"
          id={errorId}
          class="text-s fg-subtle"
          role="alert"
        >
          {errors.join(", ")}
        </div>
      )}
    </flex-stack>
  );
};
