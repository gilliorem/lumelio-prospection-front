import { Navigate } from "react-router-dom";
import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import Error404Page from "app/main/404/Error404Page";
import ContactsAppConfig from "app/main/contacts/ContactsConfig";
import ProspectionConfig from "app/main/prospection/ProspectionConfig";
import CalendarAppConfig from "app/main/calendar/CalendarAppConfig";
import ProfilConfig from "app/main/profil/ProfilConfig";
import LoginConfig from "app/main/login/LoginConfig";
import Error404Config from "app/main/404/Error404Config";
import DataExportConfig from "app/main/export/DataExportConfig";

const routeConfigs = [
  ContactsAppConfig,
  ProspectionConfig,
  CalendarAppConfig,
  ProfilConfig,
  LoginConfig,
  Error404Config,
  DataExportConfig,
];

const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    path: "/",
    element: <Navigate to="calendrier" />,
  },
  {
    path: "loading",
    element: <FuseLoading />,
  },
];

export default routes;
