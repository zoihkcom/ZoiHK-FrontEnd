<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-6xl mx-auto space-y-12">
        <header class="text-center space-y-4">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Data Hub</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">数据来源目录</h1>
          <p class="text-base sm:text-lg text-slate-600">覆盖导航栏中所有服务的权威数据来源，便于溯源、合规使用与后续维护。</p>
        </header>

        <section v-for="group in groupedSources" :key="group.category.id" class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3 text-slate-700">
              <span :class="['text-2xl', group.category.iconColor]"><i :class="['fa', group.category.icon]"></i></span>
              <div>
                <h2 class="text-2xl font-semibold text-slate-900">{{ group.category.name }}</h2>
                <p class="text-sm text-slate-500 mt-1">{{ group.category.description }}</p>
              </div>
            </div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
              共 {{ group.sources.length }} 条数据源
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article v-for="source in group.sources" :key="source.id"
              class="bg-white rounded-2xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 space-y-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="text-xs font-semibold text-blue-600 uppercase tracking-wide">{{ source.provider }}</div>
                  <h3 class="text-xl font-semibold text-slate-900 mt-1">{{ source.name }}</h3>
                  <p class="text-sm text-slate-500 mt-3 leading-relaxed">{{ source.description }}</p>
                </div>
                <span v-if="source.isRealtime"
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  实时
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <div class="text-xs uppercase text-slate-400 mb-1">更新频率</div>
                  <div class="font-medium text-slate-800">{{ source.updateFrequency }}</div>
                </div>
                <div>
                  <div class="text-xs uppercase text-slate-400 mb-1">覆盖范围</div>
                  <div class="font-medium text-slate-800">{{ source.coverage }}</div>
                </div>
                <div>
                  <div class="text-xs uppercase text-slate-400 mb-1">数据格式</div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="format in source.dataFormats" :key="format"
                      class="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{{ format }}</span>
                  </div>
                </div>
                <div>
                  <div class="text-xs uppercase text-slate-400 mb-1">授权许可</div>
                  <div class="font-medium text-slate-800">{{ source.license }}</div>
                </div>
              </div>

              <div class="flex flex-wrap gap-3 pt-2">
                <button v-if="source.internalRoute" @click="navigateTo(source.internalRoute)"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <i class="fa fa-arrow-right mr-2"></i>
                  打开页面
                </button>
                <button v-if="source.portal" @click="openExternal(source.portal)"
                  class="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                  <i class="fa fa-external-link mr-2"></i>
                  数据源
                </button>
                <button v-if="source.documentation" @click="openExternal(source.documentation)"
                  class="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                  <i class="fa fa-book mr-2"></i>
                  技术说明
                </button>
              </div>
            </article>
          </div>
        </section>

        <section v-if="!groupedSources.length" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
            <i class="fa fa-database text-2xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到符合条件的数据源</h3>
          <p class="text-slate-600">当前目录暂时没有可展示的数据。</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()

const sourceCategories = [
  {
    id: 'transport',
    name: '交通与出行',
    description: '天气预警、口岸繁忙度、公共交通与道路停车资讯。',
    icon: 'fa-road',
    iconColor: 'text-blue-500'
  },
  {
    id: 'city-life',
    name: '城市生活服务',
    description: '教育医疗、银行网点、公共设施与便民服务数据。',
    icon: 'fa-building',
    iconColor: 'text-emerald-500'
  },
  {
    id: 'culture-events',
    name: '文化与活动',
    description: '政府活动、URBTIX 票务与公共假期资讯。',
    icon: 'fa-calendar-check-o',
    iconColor: 'text-rose-500'
  },
  {
    id: 'platform',
    name: '平台增值服务',
    description: 'SmartHK 自研模块与合作服务的数据支撑。',
    icon: 'fa-th-large',
    iconColor: 'text-indigo-500'
  }
]

const dataSources = ref([
  {
    id: 'home-dashboard',
    name: '首页实时概览',
    provider: 'SmartHK 数据团队',
    description: '聚合天气、交通、设施等模块指标，提供面向公众的综合仪表盘。',
    categoryId: 'platform',
    updateFrequency: '实时聚合',
    isRealtime: true,
    dataFormats: ['Internal'],
    coverage: '全平台模块',
    license: 'SmartHK 数据使用政策',
    internalRoute: '/',
    portal: '',
    documentation: ''
  },
  {
    id: 'store',
    name: '在港商城商品目录',
    provider: 'SmartHK × 本地商户',
    description: '汇聚香港本地品牌库存、售价与物流信息，用于商城浏览与下单。',
    categoryId: 'platform',
    updateFrequency: '每日',
    isRealtime: false,
    dataFormats: ['Internal'],
    coverage: '香港地区合作商户',
    license: 'SmartHK 商务合作协议',
    internalRoute: '/store',
    portal: '',
    documentation: ''
  },
  {
    id: 'datahub-meta',
    name: '数据源元信息',
    provider: 'SmartHK 数据团队',
    description: '维护各模块数据来源、刷新策略与合规信息的元数据目录。',
    categoryId: 'platform',
    updateFrequency: '持续更新',
    isRealtime: false,
    dataFormats: ['Metadata'],
    coverage: 'SmartHK 平台',
    license: 'SmartHK 数据使用政策',
    internalRoute: '/datahub',
    portal: '',
    documentation: ''
  },
  {
    id: 'weather',
    name: '天气与预警',
    provider: '香港天文台 Hong Kong Observatory',
    description: '提供实时天气观测、雷暴与暴雨警告，以及未来 9 日天气预报。',
    categoryId: 'transport',
    updateFrequency: '实时 / 每日',
    isRealtime: true,
    dataFormats: ['JSON', 'XML'],
    coverage: '香港及邻近水域',
    license: '香港天文台开放资料许可',
    internalRoute: '/weather',
    portal: 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php',
    documentation: 'https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data.pdf'
  },
  {
    id: 'air-quality',
    name: '空气质量健康指数',
    provider: '环境保护署 Environmental Protection Department',
    description: '按监测站点发布 AQHI、主要污染物浓度及健康提示。',
    categoryId: 'transport',
    updateFrequency: '每小时',
    isRealtime: true,
    dataFormats: ['JSON'],
    coverage: '全港 13 个监测站',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/air-quality',
    portal: 'https://data.gov.hk/en-data/dataset/epd-air-quality-health-index',
    documentation: 'https://static.data.gov.hk/doc/epd-air-quality-health-index.pdf'
  },
  {
    id: 'immigration',
    name: '口岸旅客等候时间',
    provider: '入境事务处 Immigration Department',
    description: '实时显示机场、港口及陆路口岸的排队时间与繁忙程度。',
    categoryId: 'transport',
    updateFrequency: '15 分钟',
    isRealtime: true,
    dataFormats: ['JSON'],
    coverage: '主要出入境口岸',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/immigration',
    portal: 'https://data.gov.hk/en-data/dataset/immd-immigration-waiting-time',
    documentation: 'https://static.data.gov.hk/doc/immd-immigration-waiting-time.pdf'
  },
  {
    id: 'route-planner',
    name: '综合路线规划',
    provider: '高德开放平台 AMap / 运输署',
    description: '结合公共交通、驾车与步行路径，提供多模式导航建议。',
    categoryId: 'transport',
    updateFrequency: '实时',
    isRealtime: true,
    dataFormats: ['API'],
    coverage: '香港及大湾区主要道路',
    license: '高德开放平台服务协议',
    internalRoute: '/route-planner',
    portal: 'https://lbs.amap.com/api/webservice/guide/api/direction',
    documentation: 'https://lbs.amap.com/api'
  },
  {
    id: 'cross-border-bus',
    name: '跨境巴士班次与座位',
    provider: '运输署 Transport Department',
    description: '覆盖主要陆路口岸班次、票价及余座，支援即时报班查询。',
    categoryId: 'transport',
    updateFrequency: '15 分钟',
    isRealtime: true,
    dataFormats: ['JSON'],
    coverage: '香港 ↔ 大湾区口岸线路',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/cross-border-bus',
    portal: 'https://data.gov.hk/en-data/dataset/td-cross-boundary-bus',
    documentation: 'https://static.data.gov.hk/doc/td-cross-boundary-bus.pdf'
  },
  {
    id: 'bus-overview',
    name: '专营巴士路线总览',
    provider: '运输署 Transport Department',
    description: '整合专营巴士路线、行车方向及站点数据，支持多运营商分析。',
    categoryId: 'transport',
    updateFrequency: '每日',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '全港专营巴士网络',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/bus',
    portal: 'https://data.gov.hk/en-data/dataset/td-route-information-of-bus-services',
    documentation: 'https://static.data.gov.hk/doc/td-route-information-of-bus-services.pdf'
  },
  {
    id: 'kmb-routes',
    name: '九龙巴士 (KMB) 路线',
    provider: '九龙巴士（一九三三）有限公司',
    description: '提供九巴路线、班次及站点坐标，支持路线比对与站距查询。',
    categoryId: 'transport',
    updateFrequency: '每日',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '九龙及新界路线网络',
    license: '九巴开放资料条款',
    internalRoute: '/bus-routes',
    portal: 'https://data.gov.hk/en-data/dataset/kmb-bus-routes',
    documentation: 'https://static.data.gov.hk/doc/kmb-bus-routes.pdf'
  },
  {
    id: 'citybus-routes',
    name: '城巴 / 新巴 路线',
    provider: '城巴有限公司 Citybus',
    description: '涵盖城巴、市区线及机场快线的最新营运资料。',
    categoryId: 'transport',
    updateFrequency: '每日',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '香港岛及机场路线网络',
    license: '城巴开放资料条款',
    internalRoute: '/citybus-routes',
    portal: 'https://data.gov.hk/en-data/dataset/citybus-nwfb-route-list',
    documentation: 'https://static.data.gov.hk/doc/citybus-nwfb-route-list.pdf'
  },
  {
    id: 'minibus-routes',
    name: '专线小巴路线',
    provider: '运输署 Transport Department',
    description: '收录全港 530+ 条专线小巴的路线、运营商与收费资讯。',
    categoryId: 'transport',
    updateFrequency: '每周',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '全港专线小巴网络',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/minibus-routes',
    portal: 'https://data.gov.hk/en-data/dataset/td-transport-minibuses',
    documentation: 'https://static.data.gov.hk/doc/td-transport-minibuses.pdf'
  },
  {
    id: 'subway',
    name: '港铁线路与车站',
    provider: '香港铁路有限公司 MTR',
    description: '提供港铁线路、车站资料及换乘关系，用于路径规划。',
    categoryId: 'transport',
    updateFrequency: '每月',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '港铁全线',
    license: 'MTR Open Data Terms',
    internalRoute: '/subway',
    portal: 'https://data.gov.hk/en-data/dataset/mtr-lines-and-stations',
    documentation: 'https://static.data.gov.hk/doc/mtr-lines-and-stations.pdf'
  },
  {
    id: 'traffic-cctv',
    name: '道路交通 CCTV',
    provider: '运输署 Transport Department',
    description: '路面摄影机实时画面，协助掌握拥堵及事故状况。',
    categoryId: 'transport',
    updateFrequency: '实时',
    isRealtime: true,
    dataFormats: ['JPEG', 'HLS'],
    coverage: '主要干道与隧道',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/cctv',
    portal: 'https://data.gov.hk/en-data/dataset/td-hk-traffic-cameras',
    documentation: 'https://static.data.gov.hk/doc/td-hk-traffic-cameras.pdf'
  },
  {
    id: 'traffic-notices',
    name: '交通事故与封路通告',
    provider: '运输署 Transport Department',
    description: '即时发布道路事故、封路、交通改道等通知。',
    categoryId: 'transport',
    updateFrequency: '实时',
    isRealtime: true,
    dataFormats: ['JSON', 'RSS'],
    coverage: '全港道路网络',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/traffic-notices',
    portal: 'https://data.gov.hk/en-data/dataset/td-road-traffic-event',
    documentation: 'https://static.data.gov.hk/doc/td-road-traffic-event.pdf'
  },
  {
    id: 'flight-info',
    name: '航班到离港信息',
    provider: '机场管理局 Airport Authority Hong Kong',
    description: '提供航班状态、登机口与延误信息，支持旅客即时查询。',
    categoryId: 'transport',
    updateFrequency: '实时',
    isRealtime: true,
    dataFormats: ['JSON'],
    coverage: '香港国际机场',
    license: 'AAHK Data Licence',
    internalRoute: '/flight',
    portal: 'https://www.hongkongairport.com/en/flights/departures.page',
    documentation: 'https://www.hongkongairport.com/iwov-resources/airport-authority/en/pdf/business/aviation-data/flight-info-open-data.pdf'
  },
  {
    id: 'uber-taxi',
    name: '出行叫车可用性',
    provider: 'Uber Developers / 运输署的士资料',
    description: '结合 Uber 接单热点与的士营运资料，提供即时叫车建议。',
    categoryId: 'transport',
    updateFrequency: '实时',
    isRealtime: true,
    dataFormats: ['API', 'JSON'],
    coverage: '香港市区及机场',
    license: 'Uber Developer Terms / 政府资料开放授权协议 2.0',
    internalRoute: '/uber',
    portal: 'https://developer.uber.com/docs/riders',
    documentation: 'https://developer.uber.com/'
  },
  {
    id: 'carparks',
    name: '公共停车场容量',
    provider: '运输署 Transport Department',
    description: '整合公共停车场余位、收费与设施信息，支持地图可视化。',
    categoryId: 'transport',
    updateFrequency: '10 分钟',
    isRealtime: true,
    dataFormats: ['JSON'],
    coverage: '全港公共与合作车场',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/carparks',
    portal: 'https://data.gov.hk/en-data/dataset/td-parking-info',
    documentation: 'https://static.data.gov.hk/doc/td-parking-info.pdf'
  },
  {
    id: 'metered-parking',
    name: '咪表停车位状态',
    provider: '运输署 Transport Department',
    description: '街边计时停车位位置、收费时段及智能咪表运作状态。',
    categoryId: 'transport',
    updateFrequency: '10 分钟',
    isRealtime: true,
    dataFormats: ['JSON'],
    coverage: '全港路边停车位',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/metered-parking',
    portal: 'https://data.gov.hk/en-data/dataset/td-parking-meter',
    documentation: 'https://static.data.gov.hk/doc/td-parking-meter.pdf'
  },
  {
    id: 'bike-parking',
    name: '公共单车泊位',
    provider: '运输署 Transport Department',
    description: '提供单车泊位位置、容量与支援设施，便于骑行者规划。',
    categoryId: 'transport',
    updateFrequency: '季度',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '新界及主要市镇',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/bike-parking',
    portal: 'https://data.gov.hk/en-data/dataset/td-cycle-track-parking',
    documentation: 'https://static.data.gov.hk/doc/td-cycle-track-parking.pdf'
  },
  {
    id: 'ferry-piers',
    name: '公共渡轮码头',
    provider: '海事处 Marine Department',
    description: '列出公共渡轮码头设施、航线及营运时间。',
    categoryId: 'transport',
    updateFrequency: '每月',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '香港主要离岛航线',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/ferry-piers',
    portal: 'https://data.gov.hk/en-data/dataset/md-ferry-piers',
    documentation: 'https://static.data.gov.hk/doc/md-ferry-piers.pdf'
  },
  {
    id: 'wifi',
    name: 'GovWiFi 热点',
    provider: '政府资讯科技总监办公室 OGCIO',
    description: '提供政府免费 Wi-Fi 热点的位置、服务时间与覆盖范围。',
    categoryId: 'city-life',
    updateFrequency: '每月',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '公共设施及主要商圈',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/wifi',
    portal: 'https://data.gov.hk/en-data/dataset/ogcio-govwifi-hotspots',
    documentation: 'https://static.data.gov.hk/doc/ogcio-govwifi-hotspots.pdf'
  },
  {
    id: 'bank-branches',
    name: '银行分行资料',
    provider: '香港金融管理局 Hong Kong Monetary Authority',
    description: '列出持牌银行网点地址、营业时间及提供的服务。',
    categoryId: 'city-life',
    updateFrequency: '每周',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '全港银行网点',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/bank-branches',
    portal: 'https://data.gov.hk/en-data/dataset/hkma-branch-list',
    documentation: 'https://static.data.gov.hk/doc/hkma-branch-list.pdf'
  },
  {
    id: 'bank-atms',
    name: '银行自动柜员机',
    provider: '香港金融管理局 Hong Kong Monetary Authority',
    description: 'ATM 网络的地理位置、货币服务及无障碍设施。',
    categoryId: 'city-life',
    updateFrequency: '每周',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '全港 ATM 网络',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/bank-atms',
    portal: 'https://data.gov.hk/en-data/dataset/hkma-atm-list',
    documentation: 'https://static.data.gov.hk/doc/hkma-atm-list.pdf'
  },
  {
    id: 'libraries',
    name: '公共图书馆设施',
    provider: '康乐及文化事务署 LCSD',
    description: '含图书馆类型、开放时间、无障碍设施及馆藏服务。',
    categoryId: 'city-life',
    updateFrequency: '每月',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '全港公共图书馆网络',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/libraries',
    portal: 'https://data.gov.hk/en-data/dataset/lcsd-library-facility',
    documentation: 'https://static.data.gov.hk/doc/lcsd-library-facility.pdf'
  },
  {
    id: 'schools',
    name: '学校概览',
    provider: '教育局 Education Bureau',
    description: '涵盖学校类别、校网、教学语言与联络方式，支援择校需求。',
    categoryId: 'city-life',
    updateFrequency: '学年',
    isRealtime: false,
    dataFormats: ['CSV', 'JSON'],
    coverage: '幼稚园至中学',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/schools',
    portal: 'https://data.gov.hk/en-data/dataset/edb-school-profile',
    documentation: 'https://static.data.gov.hk/doc/edb-school-profile.pdf'
  },
  {
    id: 'heritage-monuments',
    name: '法定古迹与历史建筑',
    provider: '古物古迹办事处 Antiquities and Monuments Office',
    description: '列出法定古迹、历史建筑与保育项目的资料及开放情况。',
    categoryId: 'city-life',
    updateFrequency: '季度',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '全港文化遗产',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/heritage/monuments',
    portal: 'https://data.gov.hk/en-data/dataset/amo-heritage-list',
    documentation: 'https://static.data.gov.hk/doc/amo-heritage-list.pdf'
  },
  {
    id: 'fehd',
    name: '环境卫生设施',
    provider: '食物环境卫生署 Food and Environmental Hygiene Department',
    description: '包含街市、熟食中心、公厕及垃圾收集站等公共卫生设施。',
    categoryId: 'city-life',
    updateFrequency: '每月',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '全港环境卫生设施',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/fehd',
    portal: 'https://data.gov.hk/en-data/dataset/fehd-market-info',
    documentation: 'https://static.data.gov.hk/doc/fehd-market-info.pdf'
  },
  {
    id: 'hospital',
    name: '医院与诊所信息',
    provider: '医院管理局 Hospital Authority',
    description: '列出公立医院、专科诊所及急症室服务范围与联络资料。',
    categoryId: 'city-life',
    updateFrequency: '每日',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '全港医院网络',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/hospital',
    portal: 'https://data.gov.hk/en-data/dataset/hospital-authority-hospital-info',
    documentation: 'https://static.data.gov.hk/doc/hospital-authority-hospital-info.pdf'
  },
  {
    id: 'water-dispensers',
    name: '公共饮水机',
    provider: '水务署 Water Supplies Department',
    description: '记录公共饮水机位置、维护周期与水质监测结果。',
    categoryId: 'city-life',
    updateFrequency: '季度',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '康体设施及公共空间',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/water-dispensers',
    portal: 'https://data.gov.hk/en-data/dataset/wsd-water-dispenser',
    documentation: 'https://static.data.gov.hk/doc/wsd-water-dispenser.pdf'
  },
  {
    id: 'swimming-pools',
    name: '公共泳池设施',
    provider: '康乐及文化事务署 LCSD',
    description: '提供室内外泳池位置、开放时间及维护安排。',
    categoryId: 'city-life',
    updateFrequency: '季度',
    isRealtime: false,
    dataFormats: ['JSON'],
    coverage: '全港泳池设施',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/swimming-pools',
    portal: 'https://data.gov.hk/en-data/dataset/lcsd-swimming-pool',
    documentation: 'https://static.data.gov.hk/doc/lcsd-swimming-pool.pdf'
  },
  {
    id: 'aed',
    name: '公共 AED 装置',
    provider: '消防处 Fire Services Department',
    description: '自动体外心脏除颤器的所在地、可达性与开放时间。',
    categoryId: 'city-life',
    updateFrequency: '每周',
    isRealtime: false,
    dataFormats: ['JSON', 'GeoJSON'],
    coverage: '政府设施及公共空间',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/aed',
    portal: 'https://data.gov.hk/en-data/dataset/hkfsd-aed-location',
    documentation: 'https://static.data.gov.hk/doc/hkfsd-aed-location.pdf'
  },
  {
    id: 'no-smoking-areas',
    name: '指定禁烟区',
    provider: '卫生署 Tobacco and Alcohol Control Office',
    description: '列出法定禁烟区范围、管制要求与最新变更。',
    categoryId: 'city-life',
    updateFrequency: '季度',
    isRealtime: false,
    dataFormats: ['JSON', 'GeoJSON'],
    coverage: '香港公共空间',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/no-smoking-areas',
    portal: 'https://data.gov.hk/en-data/dataset/dh-no-smoking-area',
    documentation: 'https://static.data.gov.hk/doc/dh-no-smoking-area.pdf'
  },
  {
    id: 'tickets',
    name: 'URBTIX 批量票务数据',
    provider: '康乐及文化事务署 LCSD',
    description: '提供演出节目、场地、售票状态与票价信息的 XML 数据。',
    categoryId: 'culture-events',
    updateFrequency: '每日 02:00',
    isRealtime: false,
    dataFormats: ['XML'],
    coverage: 'URBTIX 合作场地',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/tickets',
    portal: 'https://data.gov.hk/en-data/dataset/lcsd-urbtix-event',
    documentation: 'https://static.data.gov.hk/doc/lcsd-urbtix-event.pdf'
  },
  {
    id: 'events',
    name: '政府活动资讯',
    provider: '政府资讯服务处 & 康文署',
    description: '汇集展览、表演、体育及社区活动的最新资讯。',
    categoryId: 'culture-events',
    updateFrequency: '每日',
    isRealtime: false,
    dataFormats: ['JSON', 'RSS'],
    coverage: '全港文化与社区活动',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/events',
    portal: 'https://www.gov.hk/tc/theme/events/pdf/opendata.html',
    documentation: 'https://www.gov.hk/tc/theme/events/'
  },
  {
    id: 'holidays',
    name: '香港公众假期',
    provider: '政府资讯科技总监办公室 OGCIO',
    description: '发布法定及补假安排，供行事历与业务系统同步使用。',
    categoryId: 'culture-events',
    updateFrequency: '年度',
    isRealtime: false,
    dataFormats: ['ICS', 'JSON'],
    coverage: '香港特别行政区',
    license: '政府资料开放授权协议 2.0',
    internalRoute: '/holidays',
    portal: 'https://data.gov.hk/en-data/dataset/ogcio-ical-holiday',
    documentation: 'https://static.data.gov.hk/doc/ogcio-ical-holiday.pdf'
  }
])

const groupedSources = computed(() => {
  const grouped = new Map()
  dataSources.value.forEach((source) => {
    if (!grouped.has(source.categoryId)) {
      grouped.set(source.categoryId, [])
    }
    grouped.get(source.categoryId).push(source)
  })
  return sourceCategories
    .filter((category) => grouped.has(category.id))
    .map((category) => ({
      category,
      sources: grouped.get(category.id)
    }))
})

const navigateTo = (route) => {
  router.push(route)
}

const openExternal = (url) => {
  if (!url) return
  window.open(url, '_blank', 'noopener')
}
</script>
