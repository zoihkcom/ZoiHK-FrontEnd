# SmartHK · 香港智能生活助手（前端）

SmartHK 是一个面向香港本地生活与出行的「一站式信息聚合」Web 应用，整合政府开放数据与公共服务，提供天气与预警、出入境繁忙度、交通与公共交通、停车场、医院急症轮候、Wi‑Fi 热点、公共设施地图、票务与活动日历、地铁线路与到站信息、航班查询、AI 旅游助手等功能。

本仓库为前端项目，基于 Vue 3 + Vite 构建，推荐与后端 API 网关（默认 `http://localhost:8901/api/v1` 或线上 `https://api.smarthk.one/api/v1`）联动使用。


**目录**

- 项目特性
- 在线功能导航
- 技术栈与架构
- 本地开发
- 环境变量
- 后端与数据源说明
- 构建与部署
- 目录结构
- 常见问题
- 许可与声明


## 项目特性

- 实时天气与预警：气温、湿度、降雨、紫外线、9 日预报等（香港天文台 Open Data）。
- 出入境繁忙度：各口岸居民/访客排队等级与时间区间（入境事务处）。
- 交通与出行：
  - 地铁线路与到站信息（MTR 实时到站）。
  - 九巴/城巴线路、站点与实时 ETA。
  - 专线小巴线路资料。
  - 实时交通 CCTV 与路况信息（运输署）。
  - 路线规划（高德地图 Web JSAPI，驾车/步行/骑行/公交）。
- 城市公共服务：
  - 停车场位置与车位（data.gov.hk，断路时有本地示例回退）。
  - 医管局急症室轮候时间。
  - 环境卫生设施（公厕、市场、垃圾收集站等，FEHD 提供 XML 数据离线解析）。
  - 学校、饮水机、渡轮码头、AED、免费 Wi‑Fi 热点等位置服务。
- 航空与票务：
  - 航班到港/离港查询（HKIA）。
  - URBTIX 票务按日批量数据解析与筛选。
  - 活动日历（公共假期 iCal + 活动聚合）。
- AI 辅助：
  - 旅游行程对话助手（SSE 流式接口 `/chat/completion`）。


## 在线功能导航（主要路由）

以下路由在本地开发或部署后可直接访问：

- `/` 首页与产品概览
- `/datahub` 一站式信息中心
- `/weather` 天气与预警看板
- `/air-quality` 空气质量 AQHI
- `/immigration` 出入境繁忙度
- `/subway` MTR 地铁线路与到站
- `/bus-routes` 九巴路线 · `/citybus-routes` 城巴路线 · `/minibus-routes` 专线小巴
- `/cctv` 交通 CCTV + 路况信息
- `/route-planner` 路线规划（高德地图）
- `/carparks` 停车场信息
- `/hospital` 医管局急症轮候
- `/wifi` 免费 Wi‑Fi 热点
- `/fehd` 环境卫生设施地图
- `/schools` 学校信息 · `/water-dispensers` 饮水机 · `/ferry-piers` 渡轮码头 · `/aed` AED
- `/flight` 航班到港/离港
- `/tickets` URBTIX 票务 · `/holidays` 假期与活动日历
- `/chat` TripGenie 旅游 AI 助手


## 技术栈与架构

- 前端框架：Vue 3（`<script setup>`）+ Vue Router 4
- 构建工具：Vite 7
- UI 组件：Naive UI + Tailwind CSS 4
- 可视化：Chart.js（温度/降雨/UV 等图表）、FullCalendar（假期与活动）
- 地图能力：
  - Google Maps JS API（地点标注、多边形渲染）。
  - 高德地图 JSAPI（关键字联想、地理编码、路线规划）。
- 数据访问：Axios（集中封装于 `src/api/request.js`，`VITE_API_BASE_URL` 可切换后端网关）
- 其它：Markdown-It（聊天消息渲染）、ESM 全量依赖


## 本地开发

前置要求：

- Node.js 18+（推荐 18 LTS 或更高）
- 可选：Google Maps JavaScript API Key、高德地图 Web JSAPI Key 与 Security JS Code（用于地图与路线规划）
- 可选：本地后端服务（默认 `http://localhost:8901/api/v1`）

安装与运行：

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 5173，已开启 --host）
npm run dev

# 生产构建与本地预览
npm run build
npm run preview
```


## 环境变量

本项目使用 Vite 环境变量，已在根目录提供示例：`.env.development` 与 `.env.production`。

- `VITE_API_BASE_URL`：后端 API 基础路径
  - 开发：`http://localhost:8901/api/v1`
  - 生产：`https://api.smarthk.one/api/v1`
- `VITE_GOOGLE_MAPS_API_KEY`：Google Maps JS API Key（供 `src/components/GoogleMap.vue` 默认读取）

说明与建议：

- 高德地图 JSAPI Key 与 Security JS Code 当前在组件中以 props 默认值形式提供（参见 `src/components/AmapView.vue` 与个别视图如 `WaterDispensers.vue`、`Subway.vue` 的示例常量）。如需替换为你自己的 Key：
  - 方式 A：在使用处（如 `RoutePlanner.vue`）以组件 props 传入 `amapKey` 与 `securityJsCode`。
  - 方式 B：将 Key 抽出到环境变量（如 `VITE_AMAP_KEY`、`VITE_AMAP_SECURITY`）并在组件中读取（需少量改动）。
- 本地开发如涉及跨域，请在后端开启 CORS 允许 `http://localhost:5173`。


## 后端与数据源说明

前端通过 `VITE_API_BASE_URL` 访问后端聚合接口，同时也会直接访问部分官方开放数据。主要接口/数据源包括：

- 后端聚合接口（节选）：
  - 空气质量：`GET /air-quality/aqhi`
  - 出入境繁忙度：`GET /immigration/queue-time/visitor`、`GET /immigration/queue-time/resident`
  - 航班：`GET /flight/arrivals?date=YYYY-MM-DD`、`GET /flight/departures?date=YYYY-MM-DD`
  - 票务：`GET /tickets/events?date=YYYYMMDD`（URBTIX 批量 XML 解析）
  - Wi‑Fi 热点：`GET /wifi`
  - 交通 CCTV：`GET /cctv`
  - 巴士：`/bus/routes`、`/bus/route-stop/:route/:bound/:serviceType`、`/bus/stop-eta/:stopId`
  - 城巴：`/citybus/routes`、`/citybus/route-stop/:route/:bound`、`/citybus/stop-eta/:stopId`、`/citybus/stop-eta/:stopId/:route`
  - 路况信息（XML 透传）：`GET /traffic/info`
  - 聊天流式 SSE：`GET /chat/completion?sessionId=...&query=...`

- 直接使用的开放数据示例：
  - 香港天文台天气：`https://data.weather.gov.hk/weatherAPI/...`（实时与 9 日预报）
  - MTR 实时到站：`https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?...`
  - 停车场：`https://api.data.gov.hk/v1/carpark-info-vacancy?...`（失败时回退到 `src/data/park.json`）
  - FEHD 设施：随仓库提供 `src/data/FE_HD_MAP.xml`，前端直接解析
  - InvestHK 即将活动：`https://www1.investhk.gov.hk/api/upcoming-events`

注意：如未提供后端或相关 Key，部分页面会无数据或仅展示回退示例（例如停车场）。


## 构建与部署

- 运行 `npm run build` 产出静态资源到 `dist/`。
- 部署到静态站点或 CDN 时需启用 SPA History Fallback，将未知路由回退到 `index.html`（例如 Nginx `try_files $uri /index.html`）。
- 如自定义部署路径（非根路径），可在 Vite 配置中设置 `base`。


## 目录结构（摘录）

```
SmartHK-Front
├─ src
│  ├─ api/                 # Axios 封装与各业务 API
│  ├─ assets/              # 图片与静态资源
│  ├─ components/          # 公共组件（GoogleMap、AmapView、Navbar、ChatBox 等）
│  ├─ data/                # 本地示例数据与静态 XML/GeoJSON
│  ├─ router/              # 路由配置
│  ├─ styles/              # 页面样式（如地铁样式）
│  ├─ views/               # 业务页面（Weather/Immigration/...）
│  ├─ App.vue / main.js    # 应用入口
│  └─ style.css            # Tailwind 入口样式
├─ public                  # 静态资源与辅助 HTML（地图等）
├─ .env.development        # 开发环境变量（示例）
├─ .env.production         # 生产环境变量（示例）
├─ vite.config.js          # 构建与别名（@ -> src）
└─ package.json            # 脚本与依赖
```


## 常见问题（FAQ）

- 地图不显示或报错 MissingKey：
  - 请设置有效的 `VITE_GOOGLE_MAPS_API_KEY`；
  - 高德路线规划需有效的 JSAPI Key 与 Security JS Code，可通过 `AmapView` 组件 props 传入或改造为环境变量读取。
- 开发环境出现 CORS 错误：
  - 后端需允许 `http://localhost:5173` 来源；或通过本地代理解决跨域。
- 某些页面数据为空：
  - 多由后端未启动或未配置 `VITE_API_BASE_URL` 导致；天气/MTR/停车场等直接来源的页面不依赖后端可先行使用。
- SSE 聊天无响应：
  - 请检查后端 `/chat/completion` 是否支持 EventSource、网络是否可达。


## 许可与声明

- 项目聚合了多来源的公开数据，数据版权归原始提供方所有，仅供学习与非商业用途。请遵循各数据源的使用条款与频控限制。
- 如需商用或高并发场景，请自行申请各地图与数据平台的正式 Key，并在后端增加缓存与限流。


—— 祝使用顺利，在香港，一个 “SmartHK” 就够了！

