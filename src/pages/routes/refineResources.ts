import { ResourceProps } from "@refinedev/core";

export type Resource = "faculties" | "semesters" | "users" | "contributions";

interface IResourceProps extends ResourceProps {
  name: Resource;
}

export const resources: IResourceProps[] = [
  {
    name: "faculties",
    list: "/admin/faculties",
    create: "/admin/faculties/create",
    edit: "/admin/faculties/edit/:id",
    show: "/admin/faculties/show/:id",
    meta: {
      canDelete: true,
    },
  },
  {
    name: "semesters",
    list: "/admin/semesters",
    create: "/admin/semesters/create",
    edit: "/admin/semesters/edit/:id",
    show: "/admin/semesters/show/:id",
    meta: {
      canDelete: true,
    },
  },
  {
    name: "users",
    list: "/admin/users",
    create: "/admin/users/create",
    edit: "/admin/users/edit/:id",
    show: "/admin/users/show/:id",
    meta: {
      canDelete: true,
    },
  },
  {
    name: "contributions",
    list: "/admin/contributions",
    meta: {
      canDelete: true,
    },
  },
];
