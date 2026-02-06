import type { FC } from "hono/jsx";
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
                  <a pe-layer="drawer" href={`/customers/${customer.id}`}>
                    {customer.name}
                  </a>
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

type FilterParams = {
  period: "upcoming" | "previous" | "all";
  sort: "asc" | "desc";
  date?: string;
};

const FilterForm: FC<{ params: FilterParams }> = ({ params }) => {
  return (
    <form method="get" action={path}>
      <flex-stack horizontal="end" gap="l">
        <flex-stack gap="2xs">
          <label for="sort">Sorter etter</label>
          <select
            id="sort"
            name="sort"
            class="select"
            style="width: 16ch;"
            auto-submit
          >
            <option value="asc" selected={params.sort === "asc"}>
              Eldste først
            </option>
            <option value="desc" selected={params.sort === "desc"}>
              Nyeste først
            </option>
          </select>
        </flex-stack>

        <fieldset>
          <legend class="mb-2xs">Periode</legend>
          <flex-stack
            horizontal="start"
            gap="m"
            style="height: var(--input-height-medium);
          display: flex;
          align-items: center;"
          >
            <flex-stack horizontal="center" gap="2xs">
              <input
                type="radio"
                id="period-upcoming"
                name="period"
                value="upcoming"
                class="radio"
                auto-submit
                checked={params.period === "upcoming"}
              />
              <label for="period-upcoming">Kommende</label>
            </flex-stack>
            <flex-stack horizontal="center" gap="2xs">
              <input
                type="radio"
                id="period-previous"
                name="period"
                value="previous"
                class="radio"
                auto-submit
                checked={params.period === "previous"}
              />
              <label for="period-previous">Tidligere</label>
            </flex-stack>
            <flex-stack horizontal="center" gap="2xs">
              <input
                type="radio"
                id="period-all"
                name="period"
                value="all"
                class="radio"
                auto-submit
                checked={params.period === "all"}
              />
              <label for="period-all">Alle</label>
            </flex-stack>
          </flex-stack>
        </fieldset>

        <flex-stack gap="2xs">
          <label for="date">Dato</label>
          <input
            type="date"
            id="date"
            name="date"
            class="input"
            value={params.date || ""}
          />
        </flex-stack>
        <noscript>
          <button type="submit" class="button" data-variant="secondary">
            Filtrer
          </button>
        </noscript>
      </flex-stack>
    </form>
  );
};

app.get("/", (c) => {
  const period = (c.req.query("period") ||
    "upcoming") as FilterParams["period"];
  const sort = (c.req.query("sort") || "asc") as FilterParams["sort"];
  const date = c.req.query("date");

  const allAppointments = appointments.getAll();
  const allCustomers = customers.getAll();
  const customerMap = new Map(allCustomers.map((cu) => [cu.id, cu]));

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let filtered = allAppointments;

  if (date) {
    const selectedDate = new Date(date);
    filtered = filtered.filter((apt) => {
      const aptDate = new Date(apt.startTime);
      return aptDate.toDateString() === selectedDate.toDateString();
    });
  } else if (period === "upcoming") {
    filtered = filtered.filter((apt) => new Date(apt.startTime) >= now);
  } else if (period === "previous") {
    filtered = filtered.filter((apt) => new Date(apt.startTime) < now);
  }

  filtered.sort((a, b) => {
    const diff =
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    return sort === "desc" ? -diff : diff;
  });

  return c.render(
    <flex-stack gap="l">
      <PageHeader title="Avtaler">
        <a href={`${path}/new`} class="button" pe-layer="drawer">
          Ny avtale
        </a>
      </PageHeader>

      <FilterForm params={{ period, sort, date }} />

      <section>
        {filtered.length === 0 ? (
          <p>Ingen avtaler funnet</p>
        ) : (
          <AppointmentsTable
            appointments={filtered}
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

  const endDate = new Date(
    startDate.getTime() + apt.durationMinutes * 60 * 1000,
  );

  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  return c.render(
    <flex-stack gap="l">
      <PageHeader title={apt.service} backHref={path} backLabel="Tilbake" />

      <dl>
        <flex-stack gap="m">
          <flex-stack gap="3xs">
            <dt class="text-s">Kunde</dt>
            <dd class="text-l text-bold">
              {customer ? (
                <a href={`/customers/${customer.id}`}>{customer.name}</a>
              ) : (
                "Ukjent"
              )}
            </dd>
          </flex-stack>

          <flex-stack horizontal gap="xl">
            <flex-stack gap="3xs">
              <dt class="text-s">Dato</dt>
              <dd class="text-bold">
                {startDate.toLocaleDateString("no", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </flex-stack>

            <flex-stack gap="3xs">
              <dt class="text-s">Tid</dt>
              <dd class="text-bold">
                {startDate.toLocaleTimeString("no", timeFormat)}–
                {endDate.toLocaleTimeString("no", timeFormat)}
              </dd>
            </flex-stack>

            <flex-stack gap="3xs">
              <dt class="text-s">Varighet</dt>
              <dd class="text-bold">{apt.durationMinutes} min</dd>
            </flex-stack>
          </flex-stack>

          {apt.notes && (
            <flex-stack gap="3xs">
              <dt class="text-s">Notater</dt>
              <dd>{apt.notes}</dd>
            </flex-stack>
          )}
        </flex-stack>
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
