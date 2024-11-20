import { authRoles } from "app/auth";
import { Navigate } from "react-router-dom";
import Error404 from "./Error404Page";

const Error404Config = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: ["prospector", "commercial", "admin"],
  routes: [
    {
      path: "404",
      element: <Error404 />,
    },
    {
      path: "*",
      element: <Navigate to="404" />,
    },
  ],
};

export default Error404Config;
