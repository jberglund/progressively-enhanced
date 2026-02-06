import { faker } from "@faker-js/faker";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

const customers: Map<string, Customer> = new Map();

let idCounter = 1;
function generateId(): string {
  return String(idCounter++);
}

export function getAll(): Customer[] {
  return Array.from(customers.values());
}

export function getById(id: string): Customer | undefined {
  return customers.get(id);
}

export function create(data: Omit<Customer, "id">): Customer {
  const id = generateId();
  const customer: Customer = { id, ...data };
  customers.set(id, customer);
  return customer;
}

export function update(
  id: string,
  data: Partial<Omit<Customer, "id">>,
): Customer | undefined {
  const existing = customers.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...data };
  customers.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return customers.delete(id);
}

function seed() {
  faker.seed(42);

  for (let i = 0; i < 6; i++) {
    create({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number({ style: "national" }),
    });
  }
}

seed();
