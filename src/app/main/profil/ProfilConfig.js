import { authRoles } from "app/auth";
import Contact from "./modifier/Contact";
import Profil from "./Profil";

const ProfilConfig = {
  settings: {
    layout: {},
  },
  auth: ["prospector", "commercial", "admin"],
  routes: [
    {
      path: "/profil",
      exact: true,
      element: <Profil />,
    },
    {
      path: "/modifier-profil",
      element: <Contact />,
    },
  ],
};

export default ProfilConfig;
