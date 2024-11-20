import { lazy } from "react";
import UserProfilePage from "./ProfilUser";

const ContactsApp = lazy(() => import("./ContactsApp"));
const Contact = lazy(() => import("./contact/Contact"));

const ContactsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: ["prospector", "commercial", "admin"],
  routes: [
    {
      path: "/utilisateurs",
      exact: true,
      element: <ContactsApp />,
    },
    {
      path: "/utilisateurs/ajouter",
      element: <Contact />,
    },
    {
      path: "/utilisateurs/modifier/:userId",
      element: <Contact />,
    },
    {
      path: "/utilisateurs/:userId",
      element: <UserProfilePage />,
    },
  ],
};

export default ContactsAppConfig;
