const navigationConfig = [
  {
    id: "calendar",
    title: "Calendrier",
    type: "item",
    icon: "event",
    url: "/calendrier",
  },
  {
    id: "users",
    title: "Utilisateurs",
    type: "item",
    icon: "people",
    url: "/utilisateurs",
  },
  {
    id: "prospection",
    title: "Prospection",
    type: "item",
    auth: ["admin", "prospector"],
    icon: "edit_location",
    url: "/prospection",
  },

  {
    id: "data",
    title: "Export Données",
    // target: "_blank",
    type: "item",
    auth: ["admin"],
    url: "/export",
    icon: "get_app",
  },
];

export default navigationConfig;
