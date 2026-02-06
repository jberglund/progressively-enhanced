import { Hono } from "hono";
import { z } from "zod";
import * as appointments from "../../db/appointments";
import * as customers from "../../db/customers";
import { PageHeader } from "../components/PageHeader";
import { FormField } from "../components/FormField";
import { FormSelect } from "../components/FormSelect";
import { FormTextarea } from "../components/FormTextarea";
import { createFormHandlers, type FormProps } from "../lib/createFormHandler";

type Appointment = ReturnType<typeof appointments.getAll>[number];
type Customer = ReturnType<typeof customers.getAll>[number];

function AppointmentsTable({
  appointments: items,
  customerMap,
}: {
  appointments: Appointment[];
  customerMap: Map<string, Customer>;
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Dato</th>
          <th>Tid</th>
          <th>Kunde</th>
          <th>Tjeneste</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((apt) => {
          const customer = customerMap.get(apt.customerId);
          const start = new Date(apt.startTime);
          const timeFormat: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
          };

          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);

          const isToday = start.toDateString() === today.toDateString();
          const isTomorrow = start.toDateString() === tomorrow.toDateString();

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
                <a href={`${path}/${apt.id}`}>{dateLabel}</a>
              </td>
              <td>
                {start.toLocaleTimeString("no", timeFormat)} (
                {apt.durationMinutes} min)
              </td>
              <td>
                {customer ? (
                  <a href={`/customers/${customer.id}`}>{customer.name}</a>
                ) : (
                  "Ukjent"
                )}
              </td>
              <td>{apt.service}</td>
              <td>
                <form method="post" action={`${path}/${apt.id}/delete`}>
                  <button
                    type="submit"
                    class="button"
                    data-variant="tertiary"
                    data-size="s"
                  >
                    Slett
                  </button>
                </form>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export const path = "/appointments";
const app = new Hono().basePath(path);

const appointmentSchema = z.object({
  customerId: z.string().min(1, "Velg en kunde"),
  startTime: z.string().min(1, "Dato og tid er påkrevd"),
  durationMinutes: z.coerce.number().min(15, "Varighet må være minst 15 min"),
  service: z.string().min(1, "Tjeneste er påkrevd"),
  notes: z.string().optional(),
});

function NewAppointmentForm({
  data,
  errors,
  formError,
  preselectedCustomerId,
}: FormProps<typeof appointmentSchema> & { preselectedCustomerId?: string }) {
  const allCustomers = customers.getAll();
  const selectedCustomerId = data?.customerId || preselectedCustomerId || "";

  const now = new Date();
  now.setMinutes(Math.ceil(now.getMinutes() / 10) * 10, 0, 0);
  const defaultStartTime = now.toISOString().slice(0, 16);

  return (
    <flex-stack gap="l">
      <PageHeader title="Ny avtale" backHref={path} backLabel="Tilbake" />
      <enhance-form target="main">
        <form method="post" action={`${path}/new`}>
          <flex-stack gap="m">
            {formError && <p style="color: red;">{formError}</p>}

            <FormSelect
              label="Kunde"
              name="customerId"
              required
              errors={errors?.fieldErrors.customerId}
            >
              <option value="">Velg kunde</option>
              {allCustomers.map((cu) => (
                <option
                  key={cu.id}
                  value={cu.id}
                  selected={cu.id === selectedCustomerId}
                >
                  {cu.name}
                </option>
              ))}
            </FormSelect>

            <FormField
              label="Dato og tid"
              name="startTime"
              type="datetime-local"
              value={data?.startTime || defaultStartTime}
              validate
              errors={errors?.fieldErrors.startTime}
              step={600}
            />

            <FormSelect
              label="Varighet"
              name="durationMinutes"
              errors={errors?.fieldErrors.durationMinutes}
            >
              <option value="30" selected={data?.durationMinutes === 30}>
                30 min
              </option>
              <option value="60" selected={data?.durationMinutes === 60}>
                60 min
              </option>
              <option value="90" selected={data?.durationMinutes === 90}>
                90 min
              </option>
            </FormSelect>

            <FormField
              label="Tjeneste"
              name="service"
              type="text"
              value={data?.service}
              validate
              errors={errors?.fieldErrors.service}
            />

            <FormTextarea
              label="Notater"
              name="notes"
              rows={3}
              errors={errors?.fieldErrors.notes}
            >
              {data?.notes}
            </FormTextarea>

            <button type="submit" class="button">
              Opprett avtale
            </button>
          </flex-stack>
        </form>
      </enhance-form>
    </flex-stack>
  );
}

const { post } = createFormHandlers({
  schema: appointmentSchema,
  form: NewAppointmentForm,
  onSubmit: async (data) => {
    const startTime = new Date(data.startTime).toISOString();
    const result = appointments.create({
      customerId: data.customerId,
      startTime,
      durationMinutes: data.durationMinutes,
      service: data.service,
      notes: data.notes || "",
    });
    if ("error" in result) {
      return { formError: result.error };
    }
    return { redirect: path };
  },
});

app.get("/", (c) => {
  const allAppointments = appointments.getAll();
  const allCustomers = customers.getAll();
  const customerMap = new Map(allCustomers.map((cu) => [cu.id, cu]));

  const now = new Date();
  const upcoming = allAppointments.filter(
    (apt) => new Date(apt.startTime) >= now,
  );
  const previous = allAppointments.filter(
    (apt) => new Date(apt.startTime) < now,
  );

  return c.render(
    <flex-stack gap="l">
      <PageHeader title="Avtaler">
        <a href={`${path}/new`} class="button" pe-layer="new drawer">
          Ny avtale
        </a>
      </PageHeader>
      <section>
        <h2 class="text-l text-bold mb-s">Kommende</h2>
        {upcoming.length === 0 ? (
          <p>Ingen kommende avtaler</p>
        ) : (
          <AppointmentsTable
            appointments={upcoming}
            customerMap={customerMap}
          />
        )}
      </section>

      <section>
        <h2 class="text-l text-bold mb-s">Tidligere</h2>
        {previous.length === 0 ? (
          <p>Ingen tidligere avtaler</p>
        ) : (
          <AppointmentsTable
            appointments={previous}
            customerMap={customerMap}
          />
        )}
      </section>
    </flex-stack>,
  );
});

app.get("/new", (c) => {
  const preselectedCustomerId = c.req.query("customerId") || "";
  return c.render(
    <NewAppointmentForm preselectedCustomerId={preselectedCustomerId} />,
  );
});

app.post("/new", post);

app.get("/:id", (c) => {
  const id = c.req.param("id");
  const apt = appointments.getById(id);

  if (!apt) {
    return c.render(<p>Avtale ikke funnet</p>, 404);
  }

  const customer = customers.getById(apt.customerId);

  const startDate = new Date(apt.startTime);

  return c.render(
    <flex-stack gap="l">
      <PageHeader
        title={`Avtale ${startDate.toLocaleDateString("no")}`}
        backHref={path}
        backLabel="Tilbake"
      />

      <dl>
        <dt>Kunde</dt>
        <dd>
          {customer ? (
            <a href={`/customers/${customer.id}`}>{customer.name}</a>
          ) : (
            "Ukjent"
          )}
        </dd>
        <dt>Dato</dt>
        <dd>
          {startDate.toLocaleDateString("no", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </dd>
        <dt>Tid</dt>
        <dd>
          {startDate.toLocaleTimeString("no", {
            hour: "numeric",
            minute: "numeric",
          })}
        </dd>
        <dt>Varighet</dt>
        <dd>{apt.durationMinutes} min</dd>
        <dt>Tjeneste</dt>
        <dd>{apt.service}</dd>
        <dt>Notater</dt>
        <dd>{apt.notes || "—"}</dd>
      </dl>

      <form method="post" action={`${path}/${apt.id}/delete`}>
        <button type="submit" class="button" data-variant="secondary">
          Slett avtale
        </button>
      </form>
    </flex-stack>,
  );
});

app.post("/:id/delete", (c) => {
  const id = c.req.param("id");
  appointments.remove(id);
  return c.redirect(path);
});

export default app;
