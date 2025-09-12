import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/datahub",
    name: "DataHub",
    component: () => import("../views/DataHub.vue"),
  },
  {
    path: "/features",
    name: "Features",
    component: () => import("../views/Features.vue"),
  },
  {
    path: "/pricing",
    name: "Pricing",
    component: () => import("../views/Pricing.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("../views/Chat.vue"),
  },
  {
    path: "/subway",
    name: "Subway",
    component: () => import("../views/Subway.vue"),
  },
  {
    path: "/map",
    name: "MapDisplay",
    component: () => import("../views/MapDisplay.vue"),
  },
  {
    path: "/weather",
    name: "Weather",
    component: () => import("../views/Weather.vue"),
  },
  {
    path: "/immigration",
    name: "Immigration",
    component: () => import("../views/Immigration.vue"),
  },
  {
    path: "/hospital",
    name: "Hospital",
    component: () => import("../views/Hospital.vue"),
  },
  {
    path: "/air-quality",
    name: "AirQuality",
    component: () => import("../views/AirQuality.vue"),
  },
  {
    path: "/flight",
    name: "FlightInfo",
    component: () => import("../views/FlightInfo.vue"),
  },
  {
    path: "/schools",
    name: "Schools",
    component: () => import("../views/Schools.vue"),
  },
  {
    path: "/wifi",
    name: "Wifi",
    component: () => import("../views/Wifi.vue"),
  },
  {
    path: "/fehd",
    name: "FEHD",
    component: () => import("../views/FEHD.vue"),
  },
  {
    path: "/cctv",
    name: "CCTV",
    component: () => import("../views/CCTV.vue"),
  },
  {
    path: "/events",
    name: "Events",
    component: () => import("../views/Events.vue"),
  },
  {
    path: "/tickets",
    name: "Tickets",
    component: () => import("../views/Tickets.vue"),
  },
  {
    path: "/bus-routes",
    name: "BusRoutes",
    component: () => import("../views/BusRoutes.vue"),
  },
  {
    path: "/citybus-routes",
    name: "CityBusRoutes",
    component: () => import("../views/CityBusRoutes.vue"),
  },
  {
    path: "/minibus-routes",
    name: "MinibusRoutes",
    component: () => import("../views/MinibusRoutes.vue"),
  },
  {
    path: "/uber",
    name: "Uber",
    component: () => import("../views/Uber.vue"),
  },
  {
    path: "/carparks",
    name: "Carparks",
    component: () => import("../views/Carparks.vue"),
  },
  {
    path: "/holidays",
    name: "Holidays",
    component: () => import("../views/Holidays.vue"),
  },
  {
    path: "/route-planner",
    name: "RoutePlanner",
    component: () => import("../views/RoutePlanner.vue"),
  },
  {
    path: "/water-dispensers",
    name: "WaterDispensers",
    component: () => import("../views/WaterDispensers.vue"),
  },
  {
    path: "/ferry-piers",
    name: "FerryPiers",
    component: () => import("../views/FerryPiers.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
