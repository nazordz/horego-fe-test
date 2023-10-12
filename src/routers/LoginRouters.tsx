import Loadable from "@/components/Loadable";
import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const LoginPage = Loadable(lazy(() => import("@/pages/Login")))

const LoginRouters: RouteObject = {
  path: '/login',
  element: <LoginPage />
}

export default LoginRouters