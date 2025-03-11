
import React from "react";
import { Routes } from "react-router-dom";
import { GeneralRoutes } from "./GeneralRoutes";
import { AuthRoutes } from "./AuthRoutes";
import { UserRoutes } from "./UserRoutes";
import { EmployerRoutes } from "./EmployerRoutes";
import { ResourceRoutes } from "./ResourceRoutes";
import { AdminRoutes } from "./AdminRoutes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <GeneralRoutes />
      <AuthRoutes />
      <UserRoutes />
      <EmployerRoutes />
      <ResourceRoutes />
      <AdminRoutes />
    </Routes>
  );
};

export default AppRoutes;
