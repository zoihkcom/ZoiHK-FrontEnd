<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
    <Navbar />
    <main class="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto space-y-10">
        <section class="text-center space-y-3">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Bus</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">香港公共交通路线总览</h1>
          <p class="text-base sm:text-lg text-slate-600">聚合所有路线，快速浏览每条线路的公司、目的地以及票价与站点详情</p>
        </section>

        <section v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-4">
          <div class="flex items-center justify-center w-10 h-10 bg-red-100 rounded-xl text-red-500 text-xl">!</div>
          <div class="text-left">
            <h2 class="text-lg font-semibold text-red-700">数据载入失败</h2>
            <p class="text-sm text-red-600 mt-1">{{ error }}</p>
            <button @click="loadRoutes"
              class="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">重新尝试</button>
          </div>
        </section>

        <section v-else>
          <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-xl h-12 w-12 border-b-2 border-blue-600"></div>
            <span class="ml-4 text-lg text-slate-500">正在载入所有线路数据...</span>
          </div>

          <div v-else class="space-y-6">
            <div class="bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-xl p-6">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 class="text-2xl font-semibold text-slate-900">共 {{ totalRoutes }} 条路线</h2>
                  <p class="text-sm text-slate-500 mt-1">数据来源：routeList.json 与
                    tramways_main_routes_sc.csv，支持按线路、站点目的地以及任意站点名称检索</p>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                  <div class="flex-1 sm:flex-none sm:w-72">
                    <input v-model="searchQuery" type="text" placeholder="搜索线路号 / 目的地 / 起点 / 任意站点"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                  </div>
                  <div class="sm:w-56">
                    <select v-model="companyFilter"
                      class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                      <option value="all">全部公司</option>
                      <option v-for="option in companyFilterOptions" :key="option.id" :value="option.id">{{ option.label
                        }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-lg shadow-slate-200/40">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200">
                  <thead class="bg-slate-50">
                    <tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th class="px-6 py-3">路线</th>
                      <th class="px-6 py-3">起点</th>
                      <th class="px-6 py-3">终点</th>
                      <th class="px-6 py-3">运营公司</th>
                      <th class="px-6 py-3">最高票价</th>
                      <th class="px-6 py-3">操作</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 bg-white">
                    <tr v-for="item in displayedRoutes" :key="item.key" class="hover:bg-slate-50/70 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center gap-3">
                          <div
                            class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 font-semibold flex items-center justify-center text-sm">
                            {{ item.route }}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-slate-900">{{ item.orig.zh }}</div>
                        <div class="text-xs text-slate-500">{{ item.orig.en }}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-slate-900">{{ item.dest.zh }}</div>
                        <div class="text-xs text-slate-500">{{ item.dest.en }}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex flex-wrap gap-1.5">
                          <span v-for="company in item.co" :key="company"
                            class="inline-flex items-center px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium whitespace-nowrap">
                            {{ mapCompany(company) }}
                          </span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span
                          class="inline-flex items-center px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          {{ formatFarePreview(item.fares) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <router-link v-if="item.type === 'ferry'"
                          class="inline-flex items-center px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                          :to="{ path: '/ferry', query: { provider: item.providerId, route: item.sourceRouteKey } }">
                          查看详情
                        </router-link>
                        <span v-else-if="item.type === 'tram'"
                          class="inline-flex items-center px-3 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm font-medium">
                          仅展示基础资料
                        </span>
                        <button v-else
                          class="inline-flex items-center px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                          @click="openRouteDetail(item)">
                          查看详情
                        </button>
                      </td>
                    </tr>
                    <tr v-if="!displayedRoutes.length">
                      <td colspan="6" class="px-6 py-12 text-center text-sm text-slate-500">没有匹配的线路，请调整筛选条件</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="hasMore" class="px-6 py-4 bg-slate-50 flex justify-center">
                <button @click="loadMore"
                  class="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 hover:bg-slate-100 transition-colors">
                  加载更多 (当前 {{ displayedRoutes.length }} / {{ uniqueFilteredRoutes.length }})
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer />

    <n-modal v-model:show="showStops" :mask-closable="true" transform-origin="center" :style="modalStyle">
      <div class="bg-white rounded-xl p-6 max-h-[80vh] overflow-hidden flex flex-col">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-2xl font-semibold text-slate-900">{{ selectedRoute?.route }} 路线详情</h2>
          </div>
          <div class="flex items-center gap-3">
            <button type="button" @click="toggleDirection" :disabled="!hasReverseRoute"
              class="flex items-center justify-center text-lg text-blue-500 hover:text-blue-600 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed">
              <i class="fa fa-exchange" aria-hidden="true"></i>
              <span class="sr-only">切换方向</span>
            </button>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
          </div>
        </div>

        <div
          class="bg-slate-50 rounded-xl px-4 py-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm text-slate-500">当前公司：</span>
            <button v-for="company in companyOptionsForSelected" :key="company.id" type="button"
              @click="setActiveCompany(company.id)"
              class="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium transition-colors whitespace-nowrap"
              :class="activeCompany === company.id ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'">
              {{ company.label }}
            </button>
          </div>
          <div class="text-xs text-slate-400">共 {{ stopDetails.length }} 个站点</div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 mb-4">
          <div class="bg-slate-50 rounded-xl p-4">
            <p class="text-xs text-slate-400 uppercase tracking-widest">服务类型</p>
            <p class="text-base font-semibold text-slate-800 mt-2">{{ selectedRoute?.serviceType || 'N/A' }}</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-4" v-if="selectedRoute?.jt">
            <p class="text-xs text-slate-400 uppercase tracking-widest">官方行车时间 (JT)</p>
            <p class="text-base font-semibold text-slate-800 mt-2">{{ selectedRoute?.jt }}</p>
          </div>
        </div>

        <div class="bg-slate-50 rounded-xl p-4 mb-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex-1">
              <p class="text-xs text-slate-400 uppercase tracking-widest">起点</p>
              <p class="text-base font-semibold text-slate-800 mt-1">{{ selectedRoute?.orig.zh || '未知起点' }}</p>
              <p class="text-xs text-slate-500">{{ selectedRoute?.orig.en || 'Unknown Origin' }}</p>
            </div>
            <div class="hidden sm:block h-12 w-px bg-slate-200"></div>
            <div class="flex-1">
              <p class="text-xs text-slate-400 uppercase tracking-widest">目的地</p>
              <p class="text-base font-semibold text-slate-800 mt-1">{{ selectedRoute?.dest.zh || '未知目的地' }}</p>
              <p class="text-xs text-slate-500">{{ selectedRoute?.dest.en || 'Unknown Destination' }}</p>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ol class="space-y-3">
            <li v-for="stop in stopDetails" :key="stop.id"
              class="bg-slate-50 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="sm:flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-900">{{ stop.index }}. {{ stop.nameZh }}</p>
                <p class="text-xs text-slate-500 break-words">{{ stop.nameEn }}</p>
                <p class="text-xs text-slate-400 mt-1 break-all">ID: {{ stop.id }}</p>
                <p class="text-xs text-slate-400">Lat: {{ stop.lat }} | Lng: {{ stop.lng }}</p>
              </div>
              <div class="flex flex-col sm:items-end gap-2 min-w-[180px] sm:flex-none sm:w-64">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-400 uppercase tracking-widest">票价</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-xl"
                    :class="stop.fare ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'">
                    {{ stop.fare ? `HK$${stop.fare}` : '终点站' }}
                  </span>
                </div>
                <div class="flex flex-col sm:items-end gap-1">
                  <span class="text-xs text-slate-400 uppercase tracking-widest">预计到达</span>
                  <div class="flex flex-wrap gap-2 sm:justify-end">
                    <span v-for="(badge, idx) in stop.etaBadges" :key="idx"
                      :class="['inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium', badge.className]">
                      {{ badge.text }}
                    </span>
                  </div>
                  <p v-if="stop.etaRemark" class="text-[11px] text-slate-400">{{ stop.etaRemark }}</p>
                </div>
                <div class="flex flex-wrap sm:flex-nowrap gap-2 sm:justify-end pt-1">
                  <button @click="viewStopOnMap(stop)"
                    class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap">
                    <i class="fa fa-map-marker mr-1"></i>
                    在地图查看
                  </button>
                  <button @click="navigateToStop(stop)"
                    class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors whitespace-nowrap">
                    <i class="fa fa-location-arrow mr-1"></i>
                    导航到站台
                  </button>
                  <button @click="toggleStopFavorite(stop, $event)"
                    :class="['inline-flex items-center px-3 py-1 text-xs font-medium rounded-xl transition-colors whitespace-nowrap', favoriteButtonClass(stop.id)]">
                    <i class="fa" :class="getFavoriteCategoryIcon(stop.id)"></i>
                    <span class="ml-1">{{ favoriteButtonLabel(stop.id) }}</span>
                  </button>
                  <button @click="openOtherRoutesModal(stop)"
                    class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors whitespace-nowrap">
                    <i class="fa fa-random mr-1"></i>
                    查看其他线路
                  </button>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </n-modal>
    <n-modal v-model:show="showOtherRoutesModal" :mask-closable="true" transform-origin="center"
      :style="otherRoutesModalStyle">
      <div class="bg-white rounded-xl p-6 max-h-[70vh] overflow-hidden flex flex-col">
        <div class="flex items-start justify-between mb-4">
          <div class="space-y-1">
            <h2 class="text-xl font-semibold text-slate-900">该站点其他线路 ETA</h2>
            <div class="text-sm text-slate-500">
              <span>{{ otherRoutesModalStop?.nameZh || '未知站点' }}</span>
              <span v-if="otherRoutesModalStop?.nameEn"
                class="block text-xs text-slate-400 sm:inline sm:ml-2">{{ otherRoutesModalStop?.nameEn }}</span>
            </div>
          </div>
          <button @click="closeOtherRoutesModal"
            class="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>
        <div class="mb-4 text-xs text-slate-400">
          <span v-if="otherRoutesModalStop?.index">站序：{{ otherRoutesModalStop.index }}</span>
          <span v-if="otherRoutesModalStop?.fare" class="ml-3">票价：HK${{ otherRoutesModalStop.fare }}</span>
        </div>
        <div class="flex-1 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div v-if="otherRoutesLoading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-xl h-10 w-10 border-b-2 border-purple-500"></div>
            <span class="ml-3 text-sm text-slate-500">正在获取其它线路的到站时间...</span>
          </div>
          <div v-else-if="!otherRoutesModalRoutes.length" class="py-10 text-center text-sm text-slate-500">
            暂无其它线路或缺少站点数据
          </div>
          <div v-else class="space-y-3">
            <div v-for="route in otherRoutesModalRoutes" :key="`${route.key}-${route.company}`"
              class="bg-slate-50 rounded-xl p-4 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span
                    class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600 font-semibold text-sm">
                    {{ route.route }}
                  </span>
                  <div>
                    <p class="text-sm font-semibold text-slate-900">{{ route.destLabel || '目的地待获取' }}</p>
                    <p class="text-xs text-slate-500">{{ route.companyLabel }}</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2 sm:justify-end">
                  <span v-for="(badge, idx) in getOtherRouteEtaBadges(route)" :key="idx"
                    :class="['inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium', badge.className]">
                    {{ badge.text }}
                  </span>
                </div>
              </div>
              <p v-if="getOtherRouteEtaRemark(route)" class="text-xs text-slate-400">
                {{ getOtherRouteEtaRemark(route) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </n-modal>
    <Teleport to="body">
      <div v-if="showFavoriteMenu" class="fixed inset-0 z-[3500]" @click="closeFavoriteMenu">
        <div class="absolute bg-white rounded-lg shadow-xl border border-slate-200 py-2 min-w-[170px]"
          :style="favoriteMenuStyle" @click.stop>
          <button @click="addFavoriteWithCategory('normal')"
            class="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center text-left">
            <i class="fa fa-star text-yellow-500 mr-2"></i>
            收藏站台
          </button>
          <button @click="addFavoriteWithCategory('home')"
            class="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center text-left">
            <i class="fa fa-home text-blue-500 mr-2"></i>
            设为家庭站台
          </button>
          <button @click="addFavoriteWithCategory('office')"
            class="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center text-left">
            <i class="fa fa-building text-emerald-500 mr-2"></i>
            设为办公室站台
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { NModal } from 'naive-ui'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { fetchEtas } from 'hk-bus-eta'
import { useFerryServices } from '@/composables/useFerryServices'

const COMPANY_MAP = {
  kmb: '九巴 KMB',
  ctb: '城巴 CTB',
  nwfb: '新巴 NWFB',
  lwb: '龙运巴士 LWB',
  mtr: '港铁巴士 MTR',
  nlb: '新大屿山巴士 NLB',
  gmb: '绿色专线小巴 GMB',
  hkkf: '港九小轮',
  sunferry: '新渡轮',
  lrtfeeder: '轻铁接驳',
  fortuneferry: '富裕小轮',
  lightRail: '轻铁',
  ferryTsuiWah: '翠华船务',
  ferryChuenKee: '全记渡',
  ferryStarFerry: '天星小轮',
  hktram: '香港电车 Hong Kong Tramways',
}

const mapCompany = (id) => {
  return COMPANY_MAP[id] || id.toUpperCase()
}

const TRAM_COMPANY_ID = 'hktram'

const loading = ref(false)
const error = ref('')
const routes = ref([])
const tramRoutes = ref([])
const stopList = ref({})
const searchQuery = ref('')
const companyFilter = ref('all')
const displayCount = ref(100)
const showStops = ref(false)
const selectedRouteKey = ref('')
const activeCompany = ref('')
const holidays = ref([])
const serviceDayMap = ref({})
const etaState = reactive({})

const { services: ferryServices } = useFerryServices()

const FAVORITES_KEY = 'bus:favoriteStops'
const favoriteStops = ref([])
const showFavoriteMenu = ref(null)
const favoriteMenuPosition = ref({ x: 0, y: 0 })
const pendingFavoriteStop = ref(null)
const stopRoutesMap = ref({})
const showOtherRoutesModal = ref(false)
const otherRoutesModalStop = ref(null)
const otherRoutesEtaState = reactive({})
const otherRoutesLoading = ref(false)
let otherRoutesEtaToken = 0

const FERRY_COMPANY_CONFIG = {
  tsuiWah: {
    companyId: 'ferryTsuiWah',
    defaultRouteCode: 'FW1',
  },
  chuenKee: {
    companyId: 'ferryChuenKee',
    defaultRouteCode: 'FW2',
  },
  starFerryCentralTST: {
    companyId: 'ferryStarFerry',
    defaultRouteCode: 'SF-CEN',
  },
  starFerryWanchaiTST: {
    companyId: 'ferryStarFerry',
    defaultRouteCode: 'SF-WCH',
  },
}

const FERRY_ROUTE_CODE_MAP = {
  'tsuiWah-L': 'FW1',
  'tsuiWah-K': 'FW1-K',
  'chuenKee-L': 'FW2',
  'chuenKee-K': 'FW2-K',
  'starFerryCentralTST-SF-CEN-TST': 'SF-CEN',
  'starFerryWanchaiTST-SF-WAN-TST': 'SF-WCH',
}

const cleanEndpointText = (value = '') => value.replace(/（.*?）/g, '').trim()

const extractEndpoints = (title = '', fallback = '') => {
  const candidates = [title, fallback]
  for (const text of candidates) {
    if (!text) continue
    const parts = text.split(/[↔⇄→-]/).map((part) => cleanEndpointText(part)).filter(Boolean)
    if (parts.length >= 2) {
      return {
        origZh: parts[0],
        destZh: parts[parts.length - 1],
      }
    }
  }
  const trimmed = cleanEndpointText(title || fallback)
  return {
    origZh: trimmed || '未知码头',
    destZh: trimmed || '未知码头',
  }
}

const extractFareValue = (route) => {
  if (!route?.fares?.length) {
    return ''
  }
  for (const section of route.fares) {
    for (const category of section.categories || []) {
      const adultItem = category.items?.find((item) => /成人/.test(item.label))
      const candidate = adultItem || category.items?.[0]
      if (candidate?.priceText) {
        const match = candidate.priceText.match(/(\d+(?:\.\d+)?)/)
        if (match) {
          return match[1]
        }
      }
    }
  }
  return ''
}

const ferryRouteEntries = computed(() => {
  return ferryServices.value.flatMap((service) => {
    const companyConfig = FERRY_COMPANY_CONFIG[service.id]
    if (!companyConfig) {
      return []
    }
    return service.routes.map((route, index) => {
      const routeCode =
        FERRY_ROUTE_CODE_MAP[route.key] || FERRY_ROUTE_CODE_MAP[`${service.id}-${route.routeType}`] ||
        `${companyConfig.defaultRouteCode}${index > 0 ? `-${index + 1}` : ''}`

      const { origZh, destZh } = extractEndpoints(route.title, service.tagline)
      const fareValue = extractFareValue(route)

      const keywords = [
        service.name,
        service.tagline,
        route.title,
        route.description,
      ].filter(Boolean)

      return {
        key: `ferry-${route.key}`,
        route: routeCode,
        orig: { zh: origZh, en: origZh },
        dest: { zh: destZh, en: destZh },
        co: [companyConfig.companyId],
        fares: fareValue ? [fareValue] : [],
        serviceType: 'FERRY',
        type: 'ferry',
        detailUrl: '/ferry',
        keywords,
        description: route.description,
        stops: { [companyConfig.companyId]: [] },
        providerId: service.id,
        sourceRouteKey: route.key,
        routeType: route.routeType,
      }
    })
  })
})

const allRoutes = computed(() => [...routes.value, ...ferryRouteEntries.value, ...tramRoutes.value])

const parseTramCsv = (csvText) => {
  const sanitized = (csvText || '').replace(/^\uFEFF/, '')
  const lines = sanitized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (!lines.length) {
    return []
  }

  return lines.slice(1).map((line, index) => {
    const cells = line.split(',').map((cell) => cell.trim())
    const [routeRaw = '', originRaw = '', destRaw = ''] = cells
    const normalizedRouteId = String(routeRaw || '').trim()
    const routeId = normalizedRouteId || `TRAM-${index + 1}`
    const originZh = originRaw || '未知起点'
    const destZh = destRaw || '未知终点'
    const originEn = originRaw || 'Unknown Origin'
    const destEn = destRaw || 'Unknown Destination'

    return {
      key: `tram-${routeId}`,
      route: routeId,
      orig: { zh: originZh, en: originEn },
      dest: { zh: destZh, en: destEn },
      co: [TRAM_COMPANY_ID],
      fares: [],
      serviceType: 'TRAM',
      type: 'tram',
      stops: { [TRAM_COMPANY_ID]: [] },
      keywords: [routeId, originZh, destZh, '香港电车', 'Hong Kong Tramways'].filter(Boolean),
    }
  })
}

const loadTramRoutes = async () => {
  try {
    tramRoutes.value = []
    const response = await fetch('/tramways_main_routes_sc.csv', { cache: 'no-store' })
    if (!response.ok) {
      console.error(`香港电车路线数据请求失败：${response.status}`)
      return
    }
    const csvText = await response.text()
    tramRoutes.value = parseTramCsv(csvText)
  } catch (err) {
    console.error('载入香港电车路线数据时出现异常', err)
    tramRoutes.value = []
  }
}

const loadFavorites = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    favoriteStops.value = Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('读取收藏数据失败', error)
    favoriteStops.value = []
  }
}

const saveFavorites = () => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteStops.value))
  } catch (error) {
    console.warn('保存收藏数据失败', error)
  }
}

const isStopFavorite = (stopId) => {
  if (!stopId) return false
  return favoriteStops.value.some((item) => item.stop === stopId)
}

const getFavoriteInfo = (stopId) => favoriteStops.value.find((item) => item.stop === stopId)

const getFavoriteCategoryText = (stopId) => {
  const info = getFavoriteInfo(stopId)
  if (!info) return '收藏站台'
  switch (info.category) {
    case 'home':
      return '家庭站台'
    case 'office':
      return '办公室站台'
    default:
      return '已收藏'
  }
}

const getFavoriteCategoryIcon = (stopId) => {
  const info = getFavoriteInfo(stopId)
  if (!info) return 'fa-star-o'
  switch (info.category) {
    case 'home':
      return 'fa-home'
    case 'office':
      return 'fa-building'
    default:
      return 'fa-star'
  }
}

const favoriteButtonLabel = (stopId) => getFavoriteCategoryText(stopId)

const favoriteButtonClass = (stopId) =>
  isStopFavorite(stopId)
    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
    : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'

const closeFavoriteMenu = () => {
  showFavoriteMenu.value = null
  pendingFavoriteStop.value = null
}

const toggleStopFavorite = (stop, event) => {
  if (!stop?.id) return
  const existingIndex = favoriteStops.value.findIndex((item) => item.stop === stop.id)
  if (existingIndex >= 0) {
    favoriteStops.value.splice(existingIndex, 1)
    saveFavorites()
    closeFavoriteMenu()
    return
  }

  pendingFavoriteStop.value = stop
  const rect = event.currentTarget.getBoundingClientRect()
  favoriteMenuPosition.value = {
    x: rect.left + rect.width / 2,
    y: rect.top,
  }
  showFavoriteMenu.value = stop.id
}

const addFavoriteWithCategory = (category) => {
  const stop = pendingFavoriteStop.value
  if (!stop?.id) return

  const latNumber = Number(stop.lat)
  const lngNumber = Number(stop.lng)

  favoriteStops.value.push({
    stop: stop.id,
    name_tc: stop.nameZh,
    name_en: stop.nameEn,
    lat: Number.isFinite(latNumber) ? latNumber : null,
    longitude: Number.isFinite(lngNumber) ? lngNumber : null,
    category,
    added_at: new Date().toISOString(),
  })
  saveFavorites()
  closeFavoriteMenu()
}

const getStopSearchName = (stop) => stop.nameZh || stop.nameEn || '巴士站'

const viewStopOnMap = (stop) => {
  if (!stop) return
  const lat = Number(stop.lat)
  const lng = Number(stop.lng)

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`
    window.open(url, '_blank')
    return
  }

  const searchQuery = `香港${getStopSearchName(stop)}`
  const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`
  window.open(url, '_blank')
}

const navigateToStop = (stop) => {
  if (!stop) return
  const lat = Number(stop.lat)
  const lng = Number(stop.lng)

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
    return
  }

  const destination = `香港${getStopSearchName(stop)}`
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
  window.open(url, '_blank')
}

const favoriteMenuStyle = computed(() => {
  const top = Math.max(favoriteMenuPosition.value.y - 140, 16)
  return {
    left: `${favoriteMenuPosition.value.x}px`,
    top: `${top}px`,
    transform: 'translateX(-50%)',
  }
})

const buildStopRoutesMap = (routeEntries) => {
  const result = {}
  routeEntries.forEach((route) => {
    const companies = route.co || []
    companies.forEach((companyId) => {
      const stopSequence = route.stops?.[companyId] || []
      const boundInfo = route.bound
      let direction = ''
      if (typeof boundInfo === 'string') {
        direction = boundInfo
      } else if (boundInfo && typeof boundInfo === 'object') {
        direction = boundInfo[companyId] || ''
      }

      stopSequence.forEach((stopId) => {
        if (!result[stopId]) {
          result[stopId] = []
        }
        result[stopId].push({
          route: route.route,
          company: companyId,
          key: route.key,
          dest: route.dest?.zh || route.dest?.en || '',
        })
      })
    })
  })
  return result
}



const getOtherRoutesForStop = (stopId) => {
  if (!stopId) return []
  const entries = stopRoutesMap.value[stopId] || []
  const currentKey = selectedRoute.value?.key
  const currentCompany = activeCompany.value

  const unique = new Map()
  entries.forEach((entry) => {
    if (entry.key === currentKey && entry.company === currentCompany) {
      return
    }
    const uniqueKey = `${entry.route}-${entry.company}`
    if (!unique.has(uniqueKey)) {
      unique.set(uniqueKey, entry)
    }
  })

  return Array.from(unique.values())
}

const otherRoutesModalRoutes = computed(() => {
  const stop = otherRoutesModalStop.value
  if (!stop?.id) return []
  const entries = getOtherRoutesForStop(stop.id)
  return entries.map((entry) => {
    const routeEntry = allRoutes.value.find((item) => item.key === entry.key)
    if (!routeEntry) {
      return {
        ...entry,
        routeEntry: null,
        companyLabel: mapCompany(entry.company),
        destLabel: entry.dest || '',
        seq: -1,
        etaKey: '',
      }
    }
    const stopSequence = routeEntry.stops?.[entry.company] || []
    const seq = stopSequence.indexOf(stop.id)
    return {
      ...entry,
      routeEntry,
      companyLabel: mapCompany(entry.company),
      destLabel: entry.dest || routeEntry.dest?.zh || routeEntry.dest?.en || '',
      seq,
      etaKey: seq >= 0 ? getOtherRouteEtaKey(routeEntry.key, entry.company, stop.id) : '',
    }
  })
})

const resetOtherRoutesModalState = () => {
  otherRoutesModalStop.value = null
  otherRoutesEtaToken += 1
  otherRoutesLoading.value = false
  Object.keys(otherRoutesEtaState).forEach((key) => {
    delete otherRoutesEtaState[key]
  })
}

const closeOtherRoutesModal = () => {
  showOtherRoutesModal.value = false
}

const getOtherRouteEtaBadges = (entry) => {
  if (!entry?.etaKey) {
    return [
      {
        text: '暂无数据',
        className: 'bg-slate-200 text-slate-500',
      },
    ]
  }
  const etaRecords = otherRoutesEtaState[entry.etaKey]
  if (etaRecords === undefined || etaRecords === null) {
    return [
      {
        text: '载入中',
        className: 'bg-slate-200 text-slate-500',
      },
    ]
  }
  if (Array.isArray(etaRecords) && etaRecords.length) {
    return etaRecords.slice(0, 2).map((etaItem) => buildEtaBadge(etaItem))
  }
  return [
    {
      text: '暂无班次',
      className: 'bg-slate-200 text-slate-500',
    },
  ]
}

const getOtherRouteEtaRemark = (entry) => {
  if (!entry?.etaKey) return ''
  const etaRecords = otherRoutesEtaState[entry.etaKey]
  if (Array.isArray(etaRecords) && etaRecords.length) {
    return etaRecords[0]?.remark?.zh || etaRecords[0]?.remark?.en || ''
  }
  return ''
}

const openOtherRoutesModal = (stop) => {
  if (!stop?.id) return
  closeFavoriteMenu()
  otherRoutesModalStop.value = stop
  showOtherRoutesModal.value = true
  loadOtherRoutesEtas()
}

const loadOtherRoutesEtas = async () => {
  const stop = otherRoutesModalStop.value
  if (!stop?.id) {
    otherRoutesLoading.value = false
    return
  }

  const token = ++otherRoutesEtaToken

  Object.keys(otherRoutesEtaState).forEach((key) => {
    delete otherRoutesEtaState[key]
  })

  const targets = otherRoutesModalRoutes.value.filter((entry) => entry.routeEntry && entry.etaKey && entry.seq >= 0)
  if (!targets.length) {
    if (otherRoutesEtaToken === token) {
      otherRoutesLoading.value = false
    }
    return
  }

  if (otherRoutesEtaToken === token) {
    otherRoutesLoading.value = true
  }
  try {
    await Promise.all(
      targets.map(async (entry) => {
        const etaKey = entry.etaKey
        if (otherRoutesEtaToken !== token) {
          return
        }
        otherRoutesEtaState[etaKey] = null
        try {
          const etas = await fetchEtas({
            ...entry.routeEntry,
            co: [entry.company],
            stops: entry.routeEntry.stops,
            bound: entry.routeEntry.bound || {},
            stopList: stopList.value,
            holidays: holidays.value,
            serviceDayMap: serviceDayMap.value,
            language: 'zh',
            seq: entry.seq,
          })
          if (otherRoutesEtaToken === token) {
            otherRoutesEtaState[etaKey] = etas
          }
        } catch (err) {
          console.error('获取其他线路 ETA 失败', err)
          if (otherRoutesEtaToken === token) {
            otherRoutesEtaState[etaKey] = []
          }
        }
      })
    )
  } finally {
    if (otherRoutesEtaToken === token) {
      otherRoutesLoading.value = false
    }
  }
}

const modalStyle = reactive({
  width: '720px',
  maxWidth: '90vw',
})

const otherRoutesModalStyle = reactive({
  width: '640px',
  maxWidth: '90vw',
})

const getOtherRouteEtaKey = (routeKey, companyId, stopId) => `${routeKey}__${companyId}__${stopId}`

const buildRouteDisplayKey = (route) => {
  const routeId = route.route || route.key || ''
  const companiesKey = (route.co || []).slice().sort().join('|') || 'unknown'
  const serviceTypeKey = route.serviceType === undefined || route.serviceType === null
    ? 'default'
    : String(route.serviceType)
  const typeKey = route.type || 'standard'
  return `${typeKey}__${routeId}__${companiesKey}__${serviceTypeKey}`
}

const deduplicateRoutesForDisplay = (list) => {
  const seen = new Set()
  return list.filter((item) => {
    const displayKey = buildRouteDisplayKey(item)
    if (seen.has(displayKey)) {
      return false
    }
    seen.add(displayKey)
    return true
  })
}

const uniqueAllRoutes = computed(() => deduplicateRoutesForDisplay(allRoutes.value))

const totalRoutes = computed(() => uniqueAllRoutes.value.length)

const companyFilterOptions = computed(() => {
  const map = new Map()
  uniqueAllRoutes.value.forEach((item) => {
    item.co.forEach((id) => {
      if (!map.has(id)) {
        map.set(id, mapCompany(id))
      }
    })
  })
  return Array.from(map, ([id, label]) => ({ id, label }))
})

const filteredRoutes = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  return allRoutes.value.filter((item) => {
    if (companyFilter.value !== 'all' && !item.co.includes(companyFilter.value)) {
      return false
    }
    if (!keyword) return true

    // 检查基本字段
    const basicFieldsMatch = [
      item.route,
      item.orig.zh,
      item.orig.en,
      item.dest.zh,
      item.dest.en,
      ...(item.keywords || []),
    ]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(keyword))

    if (basicFieldsMatch) return true

    // 检查站点名称（检查路线的站点列表）
    const companies = item.co || []
    for (const companyId of companies) {
      const stopSequence = item.stops?.[companyId] || []
      for (const stopId of stopSequence) {
        const stopInfo = stopList.value[stopId]
        if (!stopInfo) continue

        const stopNameZh = stopInfo.name?.zh?.toLowerCase()
        const stopNameEn = stopInfo.name?.en?.toLowerCase()

        if ((stopNameZh && stopNameZh.includes(keyword)) ||
          (stopNameEn && stopNameEn.includes(keyword))) {
          return true
        }
      }
    }
    return false
  })
})

const uniqueFilteredRoutes = computed(() => deduplicateRoutesForDisplay(filteredRoutes.value))

const displayedRoutes = computed(() => uniqueFilteredRoutes.value.slice(0, displayCount.value))

const hasMore = computed(() => displayCount.value < uniqueFilteredRoutes.value.length)

const selectedRoute = computed(() => allRoutes.value.find((item) => item.key === selectedRouteKey.value) || null)

const reverseRoute = computed(() => {
  if (!selectedRoute.value) return null
  const current = selectedRoute.value
  const match = allRoutes.value.find((item) => {
    if (item.route !== current.route || item.key === current.key) return false
    const sameZh = item.orig?.zh === current.dest?.zh && item.dest?.zh === current.orig?.zh
    const sameEn = item.orig?.en === current.dest?.en && item.dest?.en === current.orig?.en
    return sameZh || sameEn
  })
  return match || null
})

const hasReverseRoute = computed(() => Boolean(reverseRoute.value))

const companyOptionsForSelected = computed(() => {
  if (!selectedRoute.value?.co) return []
  return selectedRoute.value.co.map((id) => ({ id, label: mapCompany(id) }))
})

const stopIds = computed(() => {
  if (!selectedRoute.value?.stops) return []
  return selectedRoute.value.stops[activeCompany.value] || []
})

const activeFares = computed(() => {
  if (!selectedRoute.value) return []
  return selectedRoute.value.fares || []
})

const getEtaKey = (routeKey, companyId, seq) => `${routeKey}__${companyId}__${seq}`

const etaTimeFormatter = new Intl.DateTimeFormat('zh-HK', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Hong_Kong',
})

const buildEtaBadge = (etaItem) => {
  if (!etaItem?.eta) {
    return {
      text: '时间待定',
      className: 'bg-slate-200 text-slate-500',
    }
  }
  const etaDate = new Date(etaItem.eta)
  if (Number.isNaN(etaDate.getTime())) {
    return {
      text: '时间待定',
      className: 'bg-slate-200 text-slate-500',
    }
  }

  const diffMinutes = Math.round((etaDate.getTime() - Date.now()) / 60000)
  let displayText = ''
  let toneClass = 'bg-blue-100 text-blue-700'

  if (diffMinutes <= 1) {
    displayText = '即将进站'
    toneClass = 'bg-emerald-100 text-emerald-700'
  } else if (diffMinutes < 60) {
    displayText = `${diffMinutes} 分钟`
    toneClass = diffMinutes <= 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
  } else {
    displayText = etaTimeFormatter.format(etaDate)
  }

  const companyLabel = etaItem.co ? mapCompany(etaItem.co) : ''
  const text = companyLabel ? `${displayText} · ${companyLabel}` : displayText

  return {
    text,
    className: toneClass,
  }
}

const stopDetails = computed(() => {
  if (!selectedRoute.value) return []
  const routeKey = selectedRoute.value.key
  const companyId = activeCompany.value
  return stopIds.value.map((stopId, index) => {
    const info = stopList.value[stopId] || {}
    const cacheKey = getEtaKey(routeKey, companyId, index)
    const etaRecords = etaState[cacheKey]
    let etaBadges = []
    let etaRemark = ''

    if (etaRecords === undefined || etaRecords === null) {
      etaBadges = [
        {
          text: '载入中',
          className: 'bg-slate-200 text-slate-500',
        },
      ]
    } else if (Array.isArray(etaRecords) && etaRecords.length) {
      etaBadges = etaRecords.slice(0, 2).map((etaItem) => buildEtaBadge(etaItem))
      etaRemark = etaRecords[0]?.remark?.zh || etaRecords[0]?.remark?.en || ''
    } else {
      etaBadges = [
        {
          text: '暂无班次',
          className: 'bg-slate-200 text-slate-500',
        },
      ]
    }

    return {
      id: stopId,
      index: index + 1,
      nameZh: info.name?.zh || '未知站',
      nameEn: info.name?.en || 'Unknown Stop',
      lat: info.location?.lat ?? 'N/A',
      lng: info.location?.lng ?? 'N/A',
      fare: index < activeFares.value.length ? activeFares.value[index] : null,
      etaBadges,
      etaRemark,
    }
  })
})

const formatFarePreview = (fares) => {
  if (!fares || !fares.length) return '暂无票价'
  const maxFare = Math.max(...fares)
  return `HK$${maxFare}`
}

const loadMore = () => {
  displayCount.value += 100
}

const openRouteDetail = (item) => {
  selectedRouteKey.value = item.key
  const firstCompany = item.co?.[0] || 'kmb'
  activeCompany.value = firstCompany
  closeOtherRoutesModal()
  closeFavoriteMenu()
  showStops.value = true
  nextTick(() => {
    loadEtasForStops()
  })
}

const closeModal = () => {
  showStops.value = false
  closeOtherRoutesModal()
  closeFavoriteMenu()
}

const setActiveCompany = (companyId) => {
  activeCompany.value = companyId
  closeOtherRoutesModal()
  nextTick(() => {
    loadEtasForStops()
  })
}

const toggleDirection = () => {
  if (!reverseRoute.value) return
  selectedRouteKey.value = reverseRoute.value.key
  const currentCompany = activeCompany.value
  const companies = reverseRoute.value.co || []
  activeCompany.value = companies.includes(currentCompany) ? currentCompany : companies[0] || ''
  closeOtherRoutesModal()
  nextTick(() => {
    loadEtasForStops()
  })
}

const loadEtasForStops = async () => {
  const routeEntry = selectedRoute.value
  const companyId = activeCompany.value
  if (!routeEntry || !companyId) return

  const stopSequence = routeEntry.stops?.[companyId] || []
  if (!stopSequence.length) return

  Object.keys(etaState).forEach((key) => {
    if (key.startsWith(`${routeEntry.key}__`)) {
      delete etaState[key]
    }
  })

  for (let index = 0; index < stopSequence.length; index += 1) {
    const cacheKey = getEtaKey(routeEntry.key, companyId, index)
    etaState[cacheKey] = null
    try {
      const etas = await fetchEtas({
        ...routeEntry,
        co: [companyId],
        stops: routeEntry.stops,
        bound: routeEntry.bound || {},
        stopList: stopList.value,
        holidays: holidays.value,
        serviceDayMap: serviceDayMap.value,
        language: 'zh',
        seq: index,
      })
      etaState[cacheKey] = etas
    } catch (err) {
      console.error('获取 ETA 失败', err)
      etaState[cacheKey] = []
    }
  }
}

const loadRoutes = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('/routeList.json', { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`)
    }
    const data = await response.json()
    const entries = Object.entries(data.routeList || {})
    routes.value = entries.map(([key, value]) => ({ key, ...value }))
    stopRoutesMap.value = buildStopRoutesMap(routes.value)
    stopList.value = data.stopList || {}
    holidays.value = data.holidays || []
    serviceDayMap.value = data.serviceDayMap || {}
    await loadTramRoutes()
    Object.keys(etaState).forEach((key) => {
      delete etaState[key]
    })
    displayCount.value = 100
  } catch (err) {
    error.value = err.message || '载入数据时出现未知错误'
    stopRoutesMap.value = {}
    tramRoutes.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFavorites()
  loadRoutes()
  // console.log(routes)
})

watch(showStops, (visible) => {
  if (!visible) {
    closeOtherRoutesModal()
    closeFavoriteMenu()
  }
})

watch(showOtherRoutesModal, (visible) => {
  if (!visible) {
    resetOtherRoutesModalState()
  }
})
</script>
