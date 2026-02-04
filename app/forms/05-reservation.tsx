import { Hono } from "hono";
import { z } from "zod";
import { createFormHandlers, type FormProps } from "../lib/createFormHandler";

export const reservationSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Please enter a valid email"),
    startDate: z.coerce.date({ message: "Please enter a valid start date" }),
    endDate: z.coerce.date({ message: "Please enter a valid end date" }),
    guests: z.coerce
      .number()
      .int()
      .min(1, "At least 1 guest required")
      .max(10, "Maximum 10 guests"),
    notes: z.string().optional(),
  })
  .refine((data) => data.startDate > new Date(), {
    message: "Start date must be in the future",
    path: ["startDate"],
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const path = "/reservation";
const app = new Hono().basePath(path);

function Form({
  data,
  errors,
  formError,
}: FormProps<typeof reservationSchema>) {
  console.log(errors);
  return (
    <enhance-form target="main">
      <form method="post" action={path}>
        <flex-stack gap="m">
          {formError && <p style="color: red;">{formError}</p>}

          <fieldset>
            <label for="name">Name</label>
            <input
              value={data?.name}
              class="input"
              type="text"
              name="name"
              id="name"
              enhance-validate
            />
            {errors?.fieldErrors.name && (
              <p style="color: red;">{errors.fieldErrors.name.join(", ")}</p>
            )}
          </fieldset>

          <fieldset>
            <label for="email">Email</label>
            <input
              value={data?.email}
              class="input"
              type="email"
              name="email"
              id="email"
              enhance-validate
            />
            {errors?.fieldErrors.email && (
              <p style="color: red;">{errors.fieldErrors.email.join(", ")}</p>
            )}
          </fieldset>

          <flex-stack horizontal gap="m">
            <fieldset>
              <label for="startDate">Check-in</label>
              <input
                value={data?.startDate?.toString()}
                class="input"
                type="date"
                name="startDate"
                id="startDate"
                enhance-validate
              />
              {errors?.fieldErrors.startDate && (
                <p style="color: red;">
                  {errors.fieldErrors.startDate.join(", ")}
                </p>
              )}
            </fieldset>

            <fieldset>
              <label for="endDate">Check-out</label>
              <input
                value={data?.endDate?.toString()}
                class="input"
                type="date"
                name="endDate"
                id="endDate"
                enhance-validate
              />
              {errors?.fieldErrors.endDate && (
                <p style="color: red;">
                  {errors.fieldErrors.endDate.join(", ")}
                </p>
              )}
            </fieldset>
          </flex-stack>

          <fieldset>
            <label for="guests">Number of guests</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={data?.guests || 1}
              name="guests"
              id="guests"
              enhance-validate
            />
            {errors?.fieldErrors.guests && (
              <p style="color: red;">{errors.fieldErrors.guests.join(", ")}</p>
            )}
          </fieldset>

          <fieldset>
            <label for="notes">Special requests (optional)</label>
            <textarea class="textarea" name="notes" id="notes" rows={3}>
              {data?.notes}
            </textarea>
          </fieldset>

          <button class="button" type="submit">
            Book reservation
          </button>
        </flex-stack>
      </form>
    </enhance-form>
  );
}

const { get, post } = createFormHandlers({
  schema: reservationSchema,
  form: Form,
  onSubmit: async (data, c) => {
    return c.redirect("/reservation/success");
  },
});

function Success() {
  return (
    <div>
      <h1>Reservation confirmed!</h1>
      <p>We look forward to your stay.</p>
    </div>
  );
}

app.get("/", get);
app.post("/", post);
app.get("/success", (c) => c.render(<Success />));

export default app;
