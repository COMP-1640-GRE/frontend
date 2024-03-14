import { ResourceProps } from "@refinedev/core";

export type Resource = "faculties" | "periods" | "users";

interface IResourceProps extends ResourceProps {
  name: Resource;
}

export const resources: IResourceProps[] = [
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
  {
    name: "users",
    list: "/users",
    create: "/users/create",
    edit: "/users/edit/:id",
    show: "/users/show/:id",
    meta: {
      canDelete: true,
    },
  },
];
