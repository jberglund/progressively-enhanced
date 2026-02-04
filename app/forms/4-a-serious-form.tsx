import { Hono } from "hono";
import { z } from "zod";
import { createFormHandlers, type FormProps } from "../lib/createFormHandler";

const dietaryNeeds = [
  ["None", "none"],
  ["Vegetarian", "vegetarian"],
  ["Vegan", "vegan"],
  ["Gluten-free", "gluten-free"],
  ["Dairy-free", "dairy-free"],
  ["Nut allergy", "nut-allergy"],
] as const;

export const rsvpSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  eventDate: z.coerce
    .date("You must enter a valid date!")
    .refine((date) => date > new Date(), "Event date must be in the future"),
  dietaryNeeds: z
    .preprocess(
      (val) => [val].flat().filter(Boolean),
      z
        .array(z.enum(dietaryNeeds.map(([_, value]) => value)))
        .min(1, "Select at least one option")
        .refine(
          (arr) => !arr.includes("none") || arr.length === 1,
          "Cannot combine 'none' with other options",
        ),
    )
    .prefault([]),
});

export const path = "/a-serious-form";
const app = new Hono().basePath(path);

function Form({ data, errors }: FormProps<typeof rsvpSchema>) {
  return (
    <enhance-form target="main">
      <form method="post" action={path}>
        <fieldset>
          <label for="fullName">Full Name</label>
          <input
            value={data?.fullName}
            class="input"
            type="text"
            name="fullName"
            id="fullName"
            enhance-validate
          />
          {errors?.fieldErrors.fullName && (
            <p style="color: red;">{errors.fieldErrors.fullName.join(", ")}</p>
          )}
        </fieldset>

        <fieldset>
          <label for="eventDate">Event date</label>
          <input
            value={data?.eventDate.toString()}
            class="input"
            type="datetime-local"
            name="eventDate"
            id="eventDate"
            enhance-validate
          />
          {errors?.fieldErrors.eventDate && (
            <p style="color: red;">{errors.fieldErrors.eventDate.join(", ")}</p>
          )}
        </fieldset>

        <fieldset>
          <legend>Dietary needs</legend>

          {dietaryNeeds.map(([label, value]) => (
            <flex-stack horizontal gap="s">
              <input
                type="checkbox"
                class="checkbox"
                name={`dietaryNeeds`}
                id={`diet-${value}`}
                checked={data?.dietaryNeeds?.includes(value)}
                value={value}
              />
              <label for={`diet-${value}`}>{label}</label>
            </flex-stack>
          ))}
          {errors?.fieldErrors.dietaryNeeds && (
            <p style="color: red;">
              {errors.fieldErrors.dietaryNeeds.join(", ")}
            </p>
          )}
        </fieldset>

        <button class="button" type="submit">
          Send
        </button>
      </form>
    </enhance-form>
  );
}

const { get, post } = createFormHandlers({
  schema: rsvpSchema,
  form: Form,
  onSubmit: async (data, c) => {
    return c.redirect("/a-serious-form/success");
  },
});

function Success() {
  return (
    <div>
      <h1>Hurra!</h1>
      <p>Det var ju veldig så meget, ja!</p>
    </div>
  );
}

app.get("/", get);
app.post("/", post);
app.get("/success", (c) => c.render(<Success />));

export default app;
