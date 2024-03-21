import { ResourceProps } from "@refinedev/core";

export type Resource = "faculties" | "semesters" | "users";

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
    name: "semesters",
    list: "/semesters",
    create: "/semesters/create",
    edit: "/semesters/edit/:id",
    show: "/semesters/show/:id",
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
