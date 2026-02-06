import { Hono } from "hono";
import { z } from "zod";
import * as customers from "../../db/customers";
import * as appointments from "../../db/appointments";
import { PageHeader } from "../components/PageHeader";
import { FormField } from "../components/FormField";
import { createFormHandlers, type FormProps } from "../lib/createFormHandler";

export const path = "/customers";
const app = new Hono().basePath(path);

const customerSchema = z.object({
  name: z
    .string()
    .regex(/^[a-zA-Z]+$/, { message: "Name must contain only letters" })
    .min(2, "Navn er påkrevd"),
  email: z.email("Vennligst oppgi en gyldig e-postadresse"),
  phone: z.string().min(8, "Vennligst oppgi et gyldig telefonnummer"),
});

function CustomerForm({
  data,
  errors,
  formError,
}: FormProps<typeof customerSchema>) {
  return (
    <flex-stack gap="l">
      <PageHeader title="Ny kunde" backHref={path} backLabel="Tilbake" />
      <enhance-form target="main">
        <form method="post" action={`${path}/new`}>
          <flex-stack gap="m">
            {formError && <p style="color: red;">{formError}</p>}

            <FormField
              label="Navn"
              name="name"
              type="text"
              value={data?.name}
              errors={errors?.fieldErrors.name}
              required
              validate
              autofocus
            />

            <FormField
              label="E-post"
              name="email"
              type="email"
              value={data?.email}
              errors={errors?.fieldErrors.email}
              required
              validate
            />

            <FormField
              label="Telefon"
              name="phone"
              type="tel"
              value={data?.phone}
              errors={errors?.fieldErrors.phone}
              required
              validate
            />

            <button type="submit" class="button">
              Opprett kunde
            </button>
          </flex-stack>
        </form>
      </enhance-form>
    </flex-stack>
  );
}

const { get: getNewForm, post: postNewForm } = createFormHandlers({
  schema: customerSchema,
  form: CustomerForm,
  onSubmit: async (data, c) => {
    const customer = customers.create(data);
    return c.redirect(`${path}/${customer.id}`);
  },
});

app.get("/", (c) => {
  const allCustomers = customers.getAll();

  return c.render(
    <flex-stack gap="l">
      <PageHeader title="Kunder">
        <a href={`${path}/new`} class="button" pe-layer="dialog">
          Ny kunde
        </a>
      </PageHeader>
      <table>
        <thead>
          <tr>
            <th>Navn</th>
            <th>E-post</th>
            <th>Telefon</th>
          </tr>
        </thead>
        <tbody>
          {allCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <a pe-layer="drawer" href={`${path}/${customer.id}`}>
                  {customer.name}
                </a>
              </td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </flex-stack>,
  );
});

app.get("/new", getNewForm);
app.post("/new", postNewForm);

app.get("/:id", (c) => {
  const id = c.req.param("id");
  const customer = customers.getById(id);

  if (!customer) {
    return c.render(<p>Kunde ikke funnet</p>, 404);
  }

  const customerAppointments = appointments.getByCustomerId(id);

  return c.render(
    <flex-stack gap="l">
      <PageHeader title={customer.name} backHref={path} backLabel="Tilbake" />

      <section>
        <h2 class="text-l text-bold mb-s">Kontaktinfo</h2>
        <flex-stack gap="xs">
          <flex-stack horizontal="start" gap="s">
            <span class="text-bold">E-post:</span>
            <a href={`mailto:${customer.email}`}>{customer.email}</a>
          </flex-stack>
          <flex-stack horizontal="start" gap="s">
            <span class="text-bold">Telefon:</span>
            <a href={`tel:${customer.phone}`}>{customer.phone}</a>
          </flex-stack>
        </flex-stack>
      </section>

      <section>
        <flex-stack horizontal gap="l" class="mb-s">
          <h2 class="text-l text-bold">Avtaler</h2>
          <a
            pe-layer="drawer"
            href={`/appointments/new?customerId=${customer.id}`}
            class="button ml-auto"
            data-size="s"
          >
            Ny avtale
          </a>
        </flex-stack>
        {customerAppointments.length === 0 ? (
          <p>Ingen avtaler</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Dato</th>
                <th>Tid</th>
                <th>Tjeneste</th>
                <th>Notater</th>
              </tr>
            </thead>
            <tbody>
              {customerAppointments.map((apt) => {
                const start = new Date(apt.startTime);
                const timeFormat: Intl.DateTimeFormatOptions = {
                  hour: "2-digit",
                  minute: "2-digit",
                };

                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);

                const isToday = start.toDateString() === today.toDateString();
                const isTomorrow =
                  start.toDateString() === tomorrow.toDateString();

                const dateLabel = isToday
                  ? "I dag"
                  : isTomorrow
                    ? "I morgen"
                    : start.toLocaleDateString("no", {
                        day: "numeric",
                        month: "short",
                      });

                return (
                  <tr key={apt.id}>
                    <td>
                      <a href={`/appointments/${apt.id}`}>{dateLabel}</a>
                    </td>
                    <td>
                      {start.toLocaleTimeString("no", timeFormat)} (
                      {apt.durationMinutes} min)
                    </td>
                    <td>{apt.service}</td>
                    <td>{apt.notes || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </flex-stack>,
  );
});

export default app;
