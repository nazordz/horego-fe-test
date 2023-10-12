import { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";
import Loadable from "@/components/Loadable";
import { lazy } from "react";
import ProtectedRoles from "./ProtectedRoles";

const OrganizationPage = Loadable(lazy(() => import("@/pages/Organization")))
const PersonPage = Loadable(lazy(() => import("@/pages/Person")))
const UserPage = Loadable(lazy(() => import("@/pages/User")))

const MainRouters: RouteObject = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/organization',
      element: <OrganizationPage />
    },
    {
      path: '/organization/:organizationId/person',
      element: <PersonPage/>
    },
    {
      path: '/user',
      element: (
        <ProtectedRoles roles={['admin']}>
          <UserPage />
        </ProtectedRoles>
      )
    },
  ]
}

export default MainRouters;