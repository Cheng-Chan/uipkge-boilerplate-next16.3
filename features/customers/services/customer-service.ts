import {
  customerCreateInputSchema,
  customerListSchema,
  customerSchema,
  customerUpdateInputSchema,
  type Customer,
  type CustomerCreateInput,
  type CustomerUpdateInput,
} from "@/features/customers/schema";
import {
  createLocalCollection,
  type LocalPersistence,
  type LocalServiceData,
} from "@/lib/local-collection";
import {
  serviceFailure,
  serviceSuccess,
  type ServiceResult,
} from "@/lib/service-result";
import {
  createVersionedStorage,
  type StorageProvider,
} from "@/lib/storage/versioned-storage";
import { validationFailure } from "@/lib/validation";
import { CUSTOMER_FIXTURES } from "@/mocks/customers";

const MUTATION_TIMESTAMP = "2026-01-15T12:00:00.000Z";

export type CustomerService = {
  create: (
    input: CustomerCreateInput,
  ) => Promise<ServiceResult<LocalServiceData<Customer>>>;
  delete: (id: string) => Promise<ServiceResult<LocalServiceData<Customer>>>;
  getById: (id: string) => Promise<ServiceResult<LocalServiceData<Customer>>>;
  list: () => Promise<ServiceResult<LocalServiceData<readonly Customer[]>>>;
  reset: () => Promise<ServiceResult<LocalServiceData<readonly Customer[]>>>;
  update: (
    id: string,
    input: CustomerUpdateInput,
  ) => Promise<ServiceResult<LocalServiceData<Customer>>>;
};

function nextCustomerId(customers: readonly Customer[]) {
  let sequence = 1;
  while (customers.some(({ id }) => id === `customer-local-${sequence}`)) {
    sequence += 1;
  }
  return `customer-local-${sequence}`;
}

function entityResult<T>(
  value: T,
  persistence: LocalPersistence,
): ServiceResult<LocalServiceData<T>> {
  return serviceSuccess({ value, persistence });
}

export function createCustomerService(
  options: {
    getStorage?: StorageProvider;
  } = {},
): CustomerService {
  const collection = createLocalCollection<Customer>({
    fixtures: CUSTOMER_FIXTURES,
    storage: createVersionedStorage({
      name: "customers",
      version: 1,
      schema: customerListSchema,
      getStorage: options.getStorage,
    }),
  });

  return {
    async create(input) {
      const validated = customerCreateInputSchema.safeParse(input);
      if (!validated.success) {
        return validationFailure("Customer input is invalid.", validated.error);
      }

      const current = collection.snapshot();
      if (!current.ok) return current;

      const customer = customerSchema.parse({
        ...validated.data,
        id: nextCustomerId(current.data.value),
        createdAt: MUTATION_TIMESTAMP,
        updatedAt: MUTATION_TIMESTAMP,
      });
      const committed = collection.commit([...current.data.value, customer]);
      if (!committed.ok) return committed;

      return entityResult(customer, committed.data.persistence);
    },
    async delete(id) {
      const current = collection.snapshot();
      if (!current.ok) return current;

      const customer = current.data.value.find((item) => item.id === id);
      if (!customer) {
        return serviceFailure("NOT_FOUND", "Customer was not found.");
      }

      const committed = collection.commit(
        current.data.value.filter((item) => item.id !== id),
      );
      if (!committed.ok) return committed;

      return entityResult(customer, committed.data.persistence);
    },
    async getById(id) {
      const current = collection.snapshot();
      if (!current.ok) return current;

      const customer = current.data.value.find((item) => item.id === id);
      return customer
        ? entityResult(customer, current.data.persistence)
        : serviceFailure("NOT_FOUND", "Customer was not found.");
    },
    async list() {
      return collection.snapshot();
    },
    async reset() {
      return collection.reset();
    },
    async update(id, input) {
      const validated = customerUpdateInputSchema.safeParse(input);
      if (!validated.success) {
        return validationFailure(
          "Customer update is invalid.",
          validated.error,
        );
      }

      const current = collection.snapshot();
      if (!current.ok) return current;

      const index = current.data.value.findIndex((item) => item.id === id);
      if (index < 0) {
        return serviceFailure("NOT_FOUND", "Customer was not found.");
      }

      const customer = customerSchema.parse({
        ...current.data.value[index],
        ...validated.data,
        updatedAt: MUTATION_TIMESTAMP,
      });
      const next = [...current.data.value];
      next[index] = customer;
      const committed = collection.commit(next);
      if (!committed.ok) return committed;

      return entityResult(customer, committed.data.persistence);
    },
  };
}
