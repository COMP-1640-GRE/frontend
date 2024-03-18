import { Route, RouteProps } from "react-router-dom";
import {
  FacultyCreate,
  FacultyEdit,
  FacultyList,
  FacultyShow,
} from "../faculties";
import { PeriodCreate, PeriodEdit, PeriodList, PeriodShow } from "../periods";
import { Login } from "../login";
import { ForgotPassword } from "../forgotPassword";
import { ActivateAccount } from "../activate-account";
import { UserCreate, UserEdit, UserList, UserShow } from "../users";
import { ChangePassword } from "../change-password";
import { UpdateProfile } from "../update-profile";

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
      <Route path="edit/:id" element={<PeriodEdit />} />,
      <Route path="show/:id" element={<PeriodShow />} />,
    ],
  },
  {
    path: "/users",
    children: [
      <Route index element={<UserList />} />,
      <Route path="create" element={<UserCreate />} />,
      <Route path="edit/:id" element={<UserEdit />} />,
      <Route path="show/:id" element={<UserShow />} />,
    ],
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/update-profile",
    element: <UpdateProfile />,
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
