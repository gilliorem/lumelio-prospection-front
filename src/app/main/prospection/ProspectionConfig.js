import { lazy } from "react";

const ProspectionApp = lazy(() => import("./ProspectionApp"));

const ProspectionConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: ["prospector", "admin", "commercial"],
  routes: [
    {
      path: "/prospection",
      exact: true,
      element: <ProspectionApp />,
    },
  ],
};

export default ProspectionConfig;
