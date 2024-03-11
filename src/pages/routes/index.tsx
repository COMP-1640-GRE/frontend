import { Route, RouteProps } from "react-router-dom";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "../blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "../categories";
import { Login } from "../login";

export const authRoutes: RouteProps[] = [
  {
    path: "/blog-posts",
    children: [
      <Route index element={<BlogPostList />} />,
      <Route path="create" element={<BlogPostCreate />} />,
      <Route path="edit/:id" element={<BlogPostEdit />} />,
      <Route path="show/:id" element={<BlogPostShow />} />,
    ],
  },
  {
    path: "/categories",
    children: [
      <Route index element={<CategoryList />} />,
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
  //   {
  //     path: "/forgot-password",
  //     element: <ForgotPassword />,
  //   },
];
