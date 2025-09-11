import request from "./request.js";

export const cityBusApi = {
  // 获取城巴路线列表
  getRoutes() {
    return request.get("/citybus/routes");
  },

  // 获取特定路线的站点信息
  getRouteStops(route, direction) {
    return request.get(`/citybus/route-stop/${route}/${direction}`);
  },

  // 获取站点ETA实时到站数据
  getStopETA(stopId) {
    return request.get(`/citybus/stop-eta/${stopId}`);
  },

  // 获取特定路线在特定站点的ETA数据
  getStopETAByRoute(stopId, route) {
    return request.get(`/citybus/stop-eta/${stopId}/${route}`);
  },
};

export default cityBusApi;
