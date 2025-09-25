import axios from "axios";

const BASE_URL = "https://zakcm.zakc.group/zakcm-gtrip-backend-service";

const DEFAULT_HEADERS = {
  distantid: "MINI_wui6t8t3tgo8bn4x",
  language: "zh_CN",
  source: "MINI",
  xweb_xhr: "1",
  token: "f5323d9fefe0475591d708a3697d2c14",
  "Content-Type": "application/json",
  "Accept-Language": "zh-CN,zh;q=0.9",
};

const generateTraceId = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let id = "";
  for (let i = 0; i < 16; i += 1) {
    const index = Math.floor(Math.random() * chars.length);
    id += chars[index];
  }
  return id;
};

const crossBorderClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

crossBorderClient.interceptors.request.use((config) => {
  config.headers = {
    ...DEFAULT_HEADERS,
    ...config.headers,
    traceid: generateTraceId(),
  };
  return config;
});

const unwrap = (response) => response?.data ?? {};

export const crossBorderBusApi = {
  async fetchDepartureCities(singleTrip = 0) {
    const res = await crossBorderClient.get("/crossBorderTicketing/citys/on", {
      params: {
        singleTrip,
        pageFrom: "single",
      },
    });
    return unwrap(res);
  },

  async fetchArrivalCities(onCityId, singleTrip = 0) {
    const res = await crossBorderClient.get("/crossBorderTicketing/citys/off", {
      params: {
        singleTrip,
        pageFrom: "single",
        chooseOnCityId: onCityId,
      },
    });
    return unwrap(res);
  },

  async fetchOnStations({
    onCityId,
    offCityId,
    departureDate,
    singleTrip = 0,
  }) {
    const res = await crossBorderClient.get(
      "/crossBorderTicketing/city/stations/on",
      {
        params: {
          singleTrip,
          pageFrom: "single",
          onCityId,
          offCityId,
          departureDate,
          onStationId: "",
          offStationId: "",
        },
      }
    );
    return unwrap(res);
  },

  async fetchOffStations({
    onCityId,
    offCityId,
    departureDate,
    singleTrip = 0,
  }) {
    const res = await crossBorderClient.get(
      "/crossBorderTicketing/city/stations/off",
      {
        params: {
          singleTrip,
          pageFrom: "single",
          onCityId,
          offCityId,
          departureDate,
          onStationId: "",
          offStationId: "",
        },
      }
    );
    return unwrap(res);
  },

  async fetchRuns({ date, onStationId, offStationId, singleTrip = 0 }) {
    const res = await crossBorderClient.get(
      "/crossBorderTicketing/getRunsAndPrices",
      {
        params: {
          date,
          onStationId,
          offStationId,
          singleTrip,
        },
      }
    );
    return unwrap(res);
  },

  async fetchSeatInfo({ runIds = [], beginStopId, endStopId, ticketId = "" }) {
    const res = await crossBorderClient.get(
      "/crossBorderTicketing/queryRunSeatNums",
      {
        params: {
          runIds: runIds.join(","),
          ticketId,
          beginStopId,
          endStopId,
        },
      }
    );
    return unwrap(res);
  },
};

export default crossBorderBusApi;
