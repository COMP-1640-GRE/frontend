import { Route, RouteProps } from "react-router-dom";
import {
  FacultyCreate,
  FacultyEdit,
  FacultyList,
  FacultyShow,
} from "../faculties";
import {
  PeriodCreate,
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
      <Route path="create" element={<FacultyCreate />} />,
      <Route path="edit/:id" element={<FacultyEdit />} />,
      <Route path="show/:id" element={<FacultyShow />} />,
    ],
  },
  {
    path: "/periods",
    children: [
      <Route index element={<PeriodList />} />,
      <Route path="create" element={<PeriodCreate />} />,
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
