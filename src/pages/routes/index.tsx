import { Route, RouteProps } from "react-router-dom";
import {
  BlogPostCreate,
  BlogPostEdit,
  FacultyList,
  BlogPostShow,
} from "../faculties";
import {
  CategoryCreate,
  CategoryEdit,
  PeriodList,
  CategoryShow,
} from "../periods";
import { Login } from "../login";
import { ForgotPassword } from "../forgotPassword";
import { ActivateAccount } from "../activate-account";

export const authRoutes: RouteProps[] = [
  {
    path: "/faculties",
    children: [
      <Route index element={<FacultyList />} />,
      <Route path="create" element={<BlogPostCreate />} />,
      <Route path="edit/:id" element={<BlogPostEdit />} />,
      <Route path="show/:id" element={<BlogPostShow />} />,
    ],
  },
  {
    path: "/periods",
    children: [
      <Route index element={<PeriodList />} />,
      <Route path="create" element={<CategoryCreate />} />,
      <Route path="edit/:id" element={<CategoryEdit />} />,
      <Route path="show/:id" element={<CategoryShow />} />,
    ],
  },
];

export const nonAuthRoutes: RouteProps[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/activate-account",
    element: <ActivateAccount />,
  },
];
