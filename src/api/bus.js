import request from "./request.js";

export const busApi = {
  // 获取巴士路线列表
  getRoutes() {
    return request.get("/bus/routes");
  },

  // 获取特定路线的站点信息
  getRouteStops(route, direction, serviceType) {
    return request.get(`/bus/route-stop/${route}/${direction}/${serviceType}`);
  },

  // 获取站点ETA实时到站数据
  getStopETA(stopId) {
    return request.get(`/bus/stop-eta/${stopId}`);
  },

  // 获取线路详细数据
  getRoute(route, direction, serviceType) {
    return request.get(`/bus/route/${route}/${direction}/${serviceType}`);
  },
};

export default busApi;
