import { z } from "zod";
import type { Context } from "hono";
import { renderPath, template } from "typesafe-routes";
import { FormField } from "./components/FormField";
import { CheckboxGroup } from "./components/CheckboxGroup";
import { createFormHandlers } from "./lib/createFormHandler";
import { routes } from "./routes";

const schema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(10, { message: "Name must be at most 10 characters" })
    .regex(/^[a-zA-Z]+$/, { message: "Name must contain only letters" }),
  age: z.coerce
    .number({ error: "Must be a number" })
    .min(18, { message: "Age must be at least 18" }),
  favoriteFoods: z
    .array(z.string(), "You must pick at least one")
    .min(1, "Pick at least one"),
});

type FormData = z.infer<typeof schema>;
type FormErrors = z.ZodFlattenedError<FormData>;

const foodOptions = [
  { value: "pizza", label: "Pizza" },
  { value: "burger", label: "Burger" },
  { value: "sushi", label: "Sushi" },
];

const ExampleForm = ({
  errors,
  data,
  formError,
}: {
  data?: Partial<FormData>;
  errors?: FormErrors;
  formError?: string;
}) => {
  return (
    <form
      method="post"
      action={template(routes.example)}
      style="max-width: 600px"
      class="mx-auto my-3xl"
    >
      <flex-stack gap="m">
        <FormField
          label="Name"
          name="name"
          value={data?.name}
          errors={errors?.fieldErrors.name}
          validate
        />

        <FormField
          label="Age"
          name="age"
          value={data?.age}
          errors={errors?.fieldErrors.age}
          validate
        />

        <CheckboxGroup
          legend="Favorite foods"
          name="favoriteFoods"
          options={foodOptions}
          selectedValues={data?.favoriteFoods}
          errors={errors?.fieldErrors.favoriteFoods}
        />

        {formError && (
          <div role="alert" class="form-error">
            {formError}
          </div>
        )}

        <button class="button" type="submit">
          Submit
        </button>
      </flex-stack>
    </form>
  );
};

const SuccessPage = ({
  name,
  age,
  favoriteFoods,
}: {
  name: string;
  age: string;
  favoriteFoods: string[];
}) => {
  return (
    <flex-stack gap="l">
      <flex-stack gap="s">
        <h1 class="text-2xl text-bold">Submitted!</h1>
        <p class="text-l">Thanks for your submission, {name}.</p>
      </flex-stack>

      <flex-stack gap="m" class="p-l br-m">
        <h2 class="text-m text-bold">Your details</h2>

        <dl>
          <flex-stack gap="s">
            <flex-stack gap="3xs">
              <dt class="text-s">Name</dt>
              <dd class="text-bold">{name}</dd>
            </flex-stack>

            <flex-stack gap="3xs">
              <dt class="text-s">Age</dt>
              <dd class="text-bold">{age}</dd>
            </flex-stack>

            {favoriteFoods.length > 0 && (
              <flex-stack gap="3xs">
                <dt class="text-s">Favorite foods</dt>
                <dd class="text-bold">{favoriteFoods.join(", ")}</dd>
              </flex-stack>
            )}
          </flex-stack>
        </dl>
      </flex-stack>

      <a
        class="button"
        data-variant="secondary"
        href={renderPath(routes.example, {})}
      >
        Submit another
      </a>
    </flex-stack>
  );
};

export const exampleHandlers = createFormHandlers({
  schema,
  form: ExampleForm,
  onSubmit: async (data, c) => {
    try {
      console.log("Form submitted:", data);

      const params = new URLSearchParams({
        name: data.name,
        age: String(data.age),
      });

      if (data.favoriteFoods?.length) {
        data.favoriteFoods.forEach((food) => params.append("food", food));
      }

      return {
        redirect: `${renderPath(routes.example.success, {})}?${params}`,
      };
    } catch (err) {
      return { error: "Failed to submit form. Please try again." };
    }
  },
});

export const exampleSuccessHandler = (c: Context) => {
  const name = c.req.query("name") || "friend";
  const age = c.req.query("age") || "?";
  const favoriteFoods = c.req.queries("food") || [];

  return c.render(
    <SuccessPage name={name} age={age} favoriteFoods={favoriteFoods} />,
  );
};
