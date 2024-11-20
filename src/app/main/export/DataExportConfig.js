import { authRoles } from "app/auth";
import { Navigate } from "react-router-dom";
import DataExportPage from "./DataExportPage";

const DataExportConfig = {
  settings: {
    layout: {},
  },
  auth: ["admin"],
  routes: [
    {
      path: "/export",
      element: <DataExportPage />,
    },
  ],
};

export default DataExportConfig;
