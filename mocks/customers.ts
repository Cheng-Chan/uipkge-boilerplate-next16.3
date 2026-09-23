import type { Customer } from "@/features/customers/schema";

export const CUSTOMER_FIXTURES = [
  {
    id: "customer-demo-northstar",
    name: "Northstar Demo Studio",
    contactName: "Sample Contact One",
    contactEmail: "hello@northstar-demo.invalid",
    status: "active",
    createdAt: "2025-01-10T09:00:00.000Z",
    updatedAt: "2025-11-18T14:30:00.000Z",
  },
  {
    id: "customer-demo-juniper",
    name: "Juniper Demo Works",
    contactName: "Sample Contact Two",
    contactEmail: "hello@juniper-demo.invalid",
    status: "active",
    createdAt: "2025-02-14T10:15:00.000Z",
    updatedAt: "2025-12-02T08:45:00.000Z",
  },
  {
    id: "customer-demo-saffron",
    name: "Saffron Demo Lab",
    contactName: "Sample Contact Three",
    contactEmail: "hello@saffron-demo.invalid",
    status: "prospect",
    createdAt: "2025-04-03T13:20:00.000Z",
    updatedAt: "2025-10-21T16:10:00.000Z",
  },
  {
    id: "customer-demo-cobalt",
    name: "Cobalt Demo Cooperative",
    contactName: "Sample Contact Four",
    contactEmail: "hello@cobalt-demo.invalid",
    status: "inactive",
    createdAt: "2025-05-19T07:40:00.000Z",
    updatedAt: "2025-09-12T12:00:00.000Z",
  },
] as const satisfies readonly Customer[];
