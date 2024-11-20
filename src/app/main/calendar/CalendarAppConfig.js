import { lazy } from "react";

const CalendarApp = lazy(() => import("./CalendarApp"));

const CalendarAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: ["prospector", "commercial", "admin"],
  routes: [
    {
      path: "/calendrier",
      element: <CalendarApp />,
    },
  ],
};

export default CalendarAppConfig;
