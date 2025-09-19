<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <Navbar />
    <main class="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
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
                  <p class="text-sm text-slate-500 mt-1">数据来源：static routeList.json，支持按线路、站点目的地关键字检索</p>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                  <div class="flex-1 sm:flex-none sm:w-72">
                    <input v-model="searchQuery" type="text" placeholder="搜索线路号 / 目的地 / 起点"
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
                        <button
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
                  加载更多 (当前 {{ displayedRoutes.length }} / {{ filteredRoutes.length }})
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer />

    <n-modal v-model:show="showStops" :mask-closable="false" transform-origin="center" :style="modalStyle">
      <div class="bg-white rounded-xl p-6 max-h-[80vh] overflow-hidden flex flex-col">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-2xl font-semibold text-slate-900">{{ selectedRoute?.route }} 路线详情</h2>
            <p class="text-sm text-slate-500 mt-1">
              {{ selectedRoute?.orig.zh }} -> {{ selectedRoute?.dest.zh }} | {{ selectedRoute?.orig.en }} -> {{
                selectedRoute?.dest.en }}
            </p>
          </div>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
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
            <p class="text-base font-semibold text-slate-800">{{ selectedRoute?.serviceType || 'N/A' }}</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-4">
            <p class="text-xs text-slate-400 uppercase tracking-widest">行车方向</p>
            <p class="text-base font-semibold text-slate-800">{{ directionLabel }}</p>
          </div>
          <div class="bg-slate-50 rounded-xl p-4" v-if="selectedRoute?.jt">
            <p class="text-xs text-slate-400 uppercase tracking-widest">官方行车时间 (JT)</p>
            <p class="text-base font-semibold text-slate-800 mt-2">{{ selectedRoute?.jt }}</p>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ol class="space-y-3">
            <li v-for="stop in stopDetails" :key="stop.id"
              class="bg-slate-50 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ stop.index }}. {{ stop.nameZh }}</p>
                <p class="text-xs text-slate-500">{{ stop.nameEn }}</p>
                <p class="text-xs text-slate-400 mt-1">ID: {{ stop.id }}</p>
                <p class="text-xs text-slate-400">Lat: {{ stop.lat }} | Lng: {{ stop.lng }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-400 uppercase tracking-widest">票价</span>
                <span class="inline-flex items-center px-3 py-1 rounded-xl"
                  :class="stop.fare ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'">
                  {{ stop.fare ? `HK$${stop.fare}` : '终点站' }}
                </span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </n-modal>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { NModal } from 'naive-ui'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

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
}

const loading = ref(false)
const error = ref('')
const routes = ref([])
const stopList = ref({})
const searchQuery = ref('')
const companyFilter = ref('all')
const displayCount = ref(100)
const showStops = ref(false)
const selectedRouteKey = ref('')
const activeCompany = ref('')

const modalStyle = reactive({
  width: '720px',
  maxWidth: '90vw',
})

const totalRoutes = computed(() => routes.value.length)

const companyFilterOptions = computed(() => {
  const map = new Map()
  routes.value.forEach((item) => {
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
  return routes.value.filter((item) => {
    if (companyFilter.value !== 'all' && !item.co.includes(companyFilter.value)) {
      return false
    }
    if (!keyword) return true
    return [
      item.route,
      item.orig.zh,
      item.orig.en,
      item.dest.zh,
      item.dest.en,
    ]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(keyword))
  })
})

const displayedRoutes = computed(() => filteredRoutes.value.slice(0, displayCount.value))

const hasMore = computed(() => displayCount.value < filteredRoutes.value.length)

const selectedRoute = computed(() => routes.value.find((item) => item.key === selectedRouteKey.value) || null)

const companyOptionsForSelected = computed(() => {
  if (!selectedRoute.value?.co) return []
  return selectedRoute.value.co.map((id) => ({ id, label: mapCompany(id) }))
})

const directionLabel = computed(() => {
  if (!selectedRoute.value?.bound) return '未知方向'
  const bound = selectedRoute.value.bound[activeCompany.value]
  if (bound === 'O') return '往外站 (Outbound)'
  if (bound === 'I') return '往入站 (Inbound)'
  if (bound === 'OI') return '往去程'
  if (bound === 'IO') return '往回程'
  return '未知方向'
})

const stopIds = computed(() => {
  if (!selectedRoute.value?.stops) return []
  return selectedRoute.value.stops[activeCompany.value] || []
})

const activeFares = computed(() => {
  if (!selectedRoute.value) return []
  return selectedRoute.value.fares || []
})

const stopDetails = computed(() => {
  if (!selectedRoute.value) return []
  return stopIds.value.map((stopId, index) => {
    const info = stopList.value[stopId] || {}
    return {
      id: stopId,
      index: index + 1,
      nameZh: info.name?.zh || '未知站',
      nameEn: info.name?.en || 'Unknown Stop',
      lat: info.location?.lat ?? 'N/A',
      lng: info.location?.lng ?? 'N/A',
      fare: index < activeFares.value.length ? activeFares.value[index] : null,
    }
  })
})

const formatFarePreview = (fares) => {
  if (!fares || !fares.length) return '暂无票价'
  const value = fares[fares.length - 1]
  return `HK$${value}`
}

const mapCompany = (id) => {
  return COMPANY_MAP[id] || id.toUpperCase()
}

const loadMore = () => {
  displayCount.value += 100
}

const openRouteDetail = (item) => {
  selectedRouteKey.value = item.key
  const firstCompany = item.co?.[0] || 'kmb'
  activeCompany.value = firstCompany
  showStops.value = true
}

const closeModal = () => {
  showStops.value = false
}

const setActiveCompany = (companyId) => {
  activeCompany.value = companyId
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
    stopList.value = data.stopList || {}
    displayCount.value = 100
  } catch (err) {
    error.value = err.message || '载入数据时出现未知错误'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRoutes()
})
</script>
