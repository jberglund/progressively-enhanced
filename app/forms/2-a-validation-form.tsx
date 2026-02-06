import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const path = "/a-validation-form";
const app = new Hono().basePath(path);

/*
  FormData + Valideringsbibliotek
  Vi vill "sluta loopen". Inte reset vid varje request.
*/

export const contactSchema = z.object({
  fullName: z
    .string()
    .regex(/^[a-zA-Z]+$/, { message: "Name must contain only letters" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Seriously?!"),
});

type FormData = z.infer<typeof contactSchema>;
type FormErrors = z.ZodFlattenedError<FormData>;

app.post(
  "/",
  zValidator("form", contactSchema, async (result, c) => {
    if (!result.success) {
      const errors = z.flattenError(result.error);
      c.status(422); // 422 - Unprocessable Entity
      return c.render(<ValidationForm errors={errors} values={result.data} />);
    }

    // kall mot databas hade lagts här.
    return c.redirect(`${path}/success`);
  }),
);

app.get("/", async (c) => {
  return c.render(<ValidationForm />);
});

// kan rendera med eller utan values från förra render
export function ValidationForm({
  values,
  errors,
}: {
  values?: FormData;
  errors?: FormErrors;
}) {
  return (
    <crude-enhance-form>
      <form method="post" action={path} class="premade-form">
        <fieldset>
          <label for="fullName">Full Name</label>
          <input
            value={values?.fullName}
            class="input"
            type="text"
            name="fullName"
            id="fullName"
          />
          {errors?.fieldErrors.fullName && (
            <p style="color: red;">{errors.fieldErrors.fullName.join(", ")}</p>
          )}
        </fieldset>
        <button class="button" type="submit">
          Send
        </button>
      </form>
    </crude-enhance-form>
  );
}

function Success() {
  return (
    <div id="success">
      <h1>Hurra! 🥳</h1>
      <p>Skjema ble sendt – alle er glade!</p>
    </div>
  );
}

app.get("/success", (c) => c.render(<Success />));

export default app;
