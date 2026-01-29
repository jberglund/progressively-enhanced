export const CheckboxGroup = ({
  legend,
  name,
  options,
  errors,
  hint,
  selectedValues = [],
}: {
  legend: string;
  name: string;
  hint?: string;
  errors?: string[];
  options: { value: string; label: string }[];
  selectedValues?: string[];
}) => {
  const hasErrors = errors && errors.length > 0;
  const errorId = `${name}-error`;

  return (
    <fieldset>
      <legend class="mb-xs">{legend}</legend>
      {hint && <p>{hint}</p>}
      <flex-stack gap="xs">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          return (
            <flex-stack horizontal="center" gap="2xs">
              <input
                class="checkbox"
                id={id}
                type="checkbox"
                name={name}
                value={option.value}
                checked={selectedValues.includes(option.value)}
              />
              <label for={id}>{option.label}</label>
            </flex-stack>
          );
        })}
      </flex-stack>
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
    </fieldset>
  );
};
