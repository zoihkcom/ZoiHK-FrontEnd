import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/store",
    name: "Store",
    component: () => import("../views/Store.vue"),
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
    path: "/libraries",
    name: "Libraries",
    component: () => import("../views/Libraries.vue"),
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
    path: "/traffic-notices",
    name: "TrafficNotices",
    component: () => import("../views/TrafficNotices.vue"),
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
    path: "/bus",
    name: "Bus",
    component: () => import("../views/BusRoute.vue"),
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
    path: "/route-map",
    name: "RouteMap",
    component: () => import("../views/RouteMap.vue"),
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
    path: "/swimming-pools",
    name: "SwimmingPools",
    component: () => import("../views/SwimmingPools.vue"),
  },
  {
    path: "/aed",
    name: "AED",
    component: () => import("../views/AED.vue"),
  },
  {
    path: "/ferry-piers",
    name: "FerryPiers",
    component: () => import("../views/FerryPiers.vue"),
  },
  {
    path: "/tsui-wah-ferry",
    name: "TsuiWahFerry",
    component: () => import("../views/TsuiWahFerry.vue"),
  },
  {
    path: "/heritage/monuments",
    name: "HeritageMonuments",
    component: () => import("../views/HeritageMonuments.vue"),
  },
  {
    path: "/metered-parking",
    name: "MeteredParking",
    component: () => import("../views/MeteredParking.vue"),
  },
  {
    path: "/bike-parking",
    name: "BikeParking",
    component: () => import("../views/BikeParking.vue"),
  },
  {
    path: "/status",
    name: "Status",
    component: () => import("../views/Status.vue"),
  },
  {
    path: "/no-smoking-areas",
    name: "NoSmokingAreas",
    component: () => import("../views/NoSmokingAreas.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
