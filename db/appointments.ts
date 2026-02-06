import { faker } from "@faker-js/faker";

export type Appointment = {
  id: string;
  customerId: string;
  startTime: string;
  durationMinutes: number;
  service: string;
  notes: string;
};

const appointments: Map<string, Appointment> = new Map();

let idCounter = 1;
function generateId(): string {
  return String(idCounter++);
}

export function getAll(): Appointment[] {
  return Array.from(appointments.values()).sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );
}

export function getById(id: string): Appointment | undefined {
  return appointments.get(id);
}

export function getByCustomerId(customerId: string): Appointment[] {
  return Array.from(appointments.values()).filter(
    (a) => a.customerId === customerId,
  );
}

export function hasOverlap(
  startTime: Date,
  durationMinutes: number,
  excludeId?: string,
): boolean {
  const newEnd = new Date(startTime.getTime() + durationMinutes * 60_000);

  return getAll().some((appt) => {
    if (excludeId && appt.id === excludeId) return false;
    const existingStart = new Date(appt.startTime);
    const existingEnd = new Date(
      existingStart.getTime() + appt.durationMinutes * 60_000,
    );
    return startTime < existingEnd && newEnd > existingStart;
  });
}

export function create(
  data: Omit<Appointment, "id">,
): Appointment | { error: string } {
  const startTime = new Date(data.startTime);
  if (hasOverlap(startTime, data.durationMinutes)) {
    return { error: "Time slot overlaps with an existing appointment" };
  }

  const id = generateId();
  const appointment: Appointment = { id, ...data };
  appointments.set(id, appointment);
  return appointment;
}

export function update(
  id: string,
  data: Partial<Omit<Appointment, "id">>,
): Appointment | { error: string } | undefined {
  const existing = appointments.get(id);
  if (!existing) return undefined;

  const merged = { ...existing, ...data };
  const startTime = new Date(merged.startTime);
  if (hasOverlap(startTime, merged.durationMinutes, id)) {
    return { error: "Time slot overlaps with an existing appointment" };
  }

  appointments.set(id, merged);
  return merged;
}

export function remove(id: string): boolean {
  return appointments.delete(id);
}

const services = [
  "useEffect Dependency Array Therapy",
  "Server Component Hydration Mismatch Recovery",
  "Props Drilling Trauma Counseling",
  "Next.js App Router Migration Support",
  "State Management Addiction Intervention",
  "Suspense Boundary Anxiety Workshop",
  "RSC vs Client Component Crisis Hotline",
  "Bundle Size Reduction Hypnotherapy",
  "Middleware Edge Runtime Confusion Healing",
  "TypeScript Generic Inference Meditation",
];

const notes = [
  "",
  "Hydration mismatch in prod",
  "useEffect runs twice, losing it",
  "Blames the App Router",
  "Considers going back to Pages Router",
  "Added 47 useState hooks today",
  "'use client' everywhere now",
  "Can't stop creating context providers",
  "Wrapped everything in Suspense",
  "Spent 6 hours on a missing 'use server'",
  "Cache invalidation existential crisis",
  "Dreams about RSC payload size",
];

function seed() {
  faker.seed(42);

  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 10);
  const to = new Date(today);
  to.setDate(today.getDate() + 10);

  for (let i = 0; i < 60; i++) {
    const appointmentDate = faker.date.between({ from, to });
    appointmentDate.setHours(
      faker.helpers.arrayElement([9, 10, 11, 13, 14, 15, 16]),
    );
    appointmentDate.setMinutes(faker.helpers.arrayElement([0, 30]));
    appointmentDate.setSeconds(0, 0);

    create({
      customerId: String(faker.number.int({ min: 1, max: 6 })),
      startTime: appointmentDate.toISOString(),
      durationMinutes: faker.helpers.arrayElement([30, 60, 90]),
      service: faker.helpers.arrayElement(services),
      notes: faker.helpers.arrayElement(notes),
    });
  }
}

seed();
