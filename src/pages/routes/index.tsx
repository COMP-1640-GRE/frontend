import { Route, RouteProps } from "react-router-dom";
import {
  FacultyCreate,
  FacultyEdit,
  FacultyList,
  FacultyShow,
} from "../faculties";
import {
  SemesterCreate,
  SemesterEdit,
  SemesterList,
  SemesterShow,
} from "../semesters";
import { Login } from "../login";
import { ForgotPassword } from "../forgotPassword";
import { ActivateAccount } from "../activate-account";
import { UserCreate, UserEdit, UserList, UserShow } from "../users";
import { ChangePassword } from "../change-password";
import { UpdateProfile } from "../update-profile";

export const authRoutes: RouteProps[] = [
  // {
  //   path: "/faculties",
  //   children: [
  //     <Route index element={<FacultyList />} />,
  //     <Route path="create" element={<FacultyCreate />} />,
  //     <Route path="edit/:id" element={<FacultyEdit />} />,
  //     <Route path="show/:id" element={<FacultyShow />} />,
  //   ],
  // },
  // {
  //   path: "/semesters",
  //   children: [
  //     <Route index element={<SemesterList />} />,
  //     <Route path="create" element={<SemesterCreate />} />,
  //     <Route path="edit/:id" element={<SemesterEdit />} />,
  //     <Route path="show/:id" element={<SemesterShow />} />,
  //   ],
  // },
  // {
  //   path: "/users",
  //   children: [
  //     <Route index element={<UserList />} />,
  //     <Route path="create" element={<UserCreate />} />,
  //     <Route path="edit/:id" element={<UserEdit />} />,
  //     <Route path="show/:id" element={<UserShow />} />,
  //   ],
  // },
  {
    path: "admin",
    children: [
      <Route>
        <Route path="faculties">
          <Route index element={<FacultyList />} />,
          <Route path="create" element={<FacultyCreate />} />,
          <Route path="edit/:id" element={<FacultyEdit />} />,
          <Route path="show/:id" element={<FacultyShow />} />,
        </Route>
        <Route path="semesters">
          <Route index element={<SemesterList />} />,
          <Route path="create" element={<SemesterCreate />} />,
          <Route path="edit/:id" element={<SemesterEdit />} />,
          <Route path="show/:id" element={<SemesterShow />} />,
        </Route>
        <Route path="users">
          <Route index element={<UserList />} />,
          <Route path="create" element={<UserCreate />} />,
          <Route path="edit/:id" element={<UserEdit />} />,
          <Route path="show/:id" element={<UserShow />} />,
        </Route>
        {/* <Route path="faculties">
        </Route> */}
      </Route>,
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
