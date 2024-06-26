import {
  AuditOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ResourceProps } from "@refinedev/core";

export type Resource =
  | "faculties"
  | "semesters"
  | "users"
  | "contributions"
  | "contributions_gallery"
  | "reviews"
  | "comments"
  | "systems"
  | "dashboard";

interface IResourceProps extends ResourceProps {
  name: Resource;
  identifier?: Resource;
}

export const resources: IResourceProps[] = [
  {
    name: "dashboard",
    list: "/dashboard",
    meta: {
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "faculties",
    list: "/management/faculties",
    create: "/management/faculties/create",
    edit: "/management/faculties/edit/:id",
    show: "/management/faculties/show/:id",
    meta: {
      canDelete: true,
      icon: <AuditOutlined />,
    },
  },
  {
    name: "semesters",
    list: "/management/semesters",
    create: "/management/semesters/create",
    edit: "/management/semesters/edit/:id",
    show: "/management/semesters/show/:id",
    meta: {
      canDelete: true,
      icon: <ScheduleOutlined />,
    },
  },
  {
    name: "users",
    list: "/management/users",
    create: "/management/users/create",
    edit: "/management/users/edit/:id",
    show: "/management/users/show/:id",
    meta: {
      canDelete: true,
      icon: <UserOutlined />,
    },
  },
  {
    name: "contributions",
    list: "/management/contributions",
    show: "/management/contributions/review/:id",
    meta: {
      canDelete: true,
      icon: <FileTextOutlined />,
    },
  },
  {
    name: "contributions",
    list: "/contributions",
    create: "/contributions/create",
    edit: "/contributions/edit/:id",
    show: "/contributions/:id",
    identifier: "contributions_gallery",
    meta: { canDelete: true, icon: <FileTextOutlined /> },
  },
  {
    name: "systems",
    list: "/management/systems",
    meta: {
      icon: <SettingOutlined />,
    },
  },
];
