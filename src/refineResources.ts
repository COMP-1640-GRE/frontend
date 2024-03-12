import { ResourceProps } from "@refinedev/core";

export const resources: ResourceProps[] = [
  {
    name: "faculties",
    list: "/faculties",
    create: "/faculties/create",
    edit: "/faculties/edit/:id",
    show: "/faculties/show/:id",
    meta: {
      canDelete: true,
    },
  },
  {
    name: "periods",
    list: "/periods",
    create: "/periods/create",
    edit: "/periods/edit/:id",
    show: "/periods/show/:id",
    meta: {
      canDelete: true,
    },
  },
];
