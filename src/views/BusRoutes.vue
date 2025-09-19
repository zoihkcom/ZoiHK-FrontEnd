<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    <div class="pt-24 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">香港巴士路線</h1>
          <p class="text-xl text-gray-600">Hong Kong Bus Routes</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span class="ml-3 text-lg text-gray-600">载入路線数据...</span>
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div class="flex items-center">
            <i class="fa fa-exclamation-triangle text-red-500 text-xl mr-3"></i>
            <div>
              <h3 class="text-red-800 font-semibold">数据载入失败</h3>
              <p class="text-red-600 mt-1">{{ error }}</p>
            </div>
          </div>
          <button @click="fetchRoutes"
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            重新载入
          </button>
        </div>

        <!-- Main Content -->
        <div v-if="!loading && !error">
          <div class="bg-white rounded-lg shadow-xl overflow-hidden">
            <div class="px-6 py-4 bg-white">
              <div class="flex justify-between items-center">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">路線列表 (Route List)</h2>
                  <p class="text-sm text-gray-500 mt-1">每条线路显示默认方向，点击"查看站点"可切换到相反方向</p>
                </div>
                <div class="text-gray-600 text-sm">
                  <i class="fa fa-clock-o mr-1"></i>
                  更新时间: {{ formatTimestamp(routeData.generated_timestamp) }}
                </div>
              </div>
            </div>

            <!-- Search -->
            <div class="px-6 py-4 bg-gray-50 border-b">
              <div class="max-w-md">
                <n-input v-model:value="searchQuery" clearable placeholder="搜索路线号码（精准匹配）..." />
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      路線 (Route)
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      起點 (Origin)
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      終點 (Destination)
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      公司
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      服務類型
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="route in filteredRoutes" :key="`${route.route}-${route.bound}`"
                    class="hover:bg-gray-50 transition-colors duration-200">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span class="text-indigo-600 font-bold text-sm">{{ route.route }}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">{{ route.orig_tc }}</div>
                      <div class="text-sm text-gray-500">{{ route.orig_en }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">{{ route.dest_tc }}</div>
                      <div class="text-sm text-gray-500">{{ route.dest_en }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        KMB
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        類型 {{ route.service_type }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button @click="viewRouteStops(route)"
                        class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                        <i class="fa fa-map-marker mr-2"></i>
                        查看站点
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </div>
    </div>

    <!-- Route Stops Right Popup -->
    <div v-if="selectedRoute" class="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-9999">
      <div class="h-full flex flex-col">
        <!-- Header -->
        <div class="px-6 py-4 bg-white text-gray-900 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold">
                {{ selectedRoute.route }}線 - {{ selectedRoute.bound === 'O' ? '去程' : '回程' }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ selectedRoute.orig_tc }} → {{ selectedRoute.dest_tc }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <!-- 方向切换按钮 -->
              <button v-if="oppositeDirectionRoute" @click="switchToOppositeDirection"
                class="text-gray-500 hover:text-gray-700 transition-colors"
                :title="`切换到${oppositeDirectionRoute.bound === 'O' ? '去程' : '回程'}方向`">
                <i class="fa fa-exchange"></i>
              </button>
              <button @click="openRouteOnMap" class="text-gray-500 hover:text-gray-700 transition-colors"
                title="在地图查看整条线路">
                <i class="fa fa-map"></i>
              </button>
              <button @click="clearRouteStops" class="text-gray-500 hover:text-gray-700 transition-colors">
                <i class="fa fa-times text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto">
          <!-- Loading State for Stops -->
          <div v-if="stopsLoading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span class="ml-3 text-gray-600">载入站點数据...</span>
          </div>

          <!-- Error State for Stops -->
          <div v-if="stopsError" class="p-6 bg-red-50 border border-red-200 m-4 rounded-lg">
            <div class="flex items-center">
              <i class="fa fa-exclamation-triangle text-red-500 text-xl mr-3"></i>
              <div>
                <h4 class="text-red-800 font-semibold">站點數據載入失敗</h4>
                <p class="text-red-600 mt-1">{{ stopsError }}</p>
              </div>
            </div>
            <button @click="fetchRouteStops(selectedRoute)"
              class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              重新載入
            </button>
          </div>

          <!-- Stops List -->
          <div v-if="!stopsLoading && !stopsError && routeStops.length > 0" class="divide-y divide-gray-200">
            <div v-for="stop in routeStops" :key="stop.seq" class="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-indigo-600 font-semibold text-sm">{{ stop.seq }}</span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900">{{ stop.stop_info.name_tc }}</div>
                  <div class="text-sm text-gray-500">{{ stop.stop_info.name_en }}</div>
                  <div class="text-xs text-gray-400 mt-1">
                    <i class="fa fa-map-marker mr-1"></i>
                    {{ stop.stop_info.lat }}, {{ stop.stop_info.longitude }}
                  </div>
                  <div class="text-xs text-gray-400 mt-1">
                    ID: {{ stop.stop_info.stop }}
                  </div>

                  <!-- ETA信息显示 -->
                  <div v-if="stopsEta[stop.stop_info.stop] && stopsEta[stop.stop_info.stop].length > 0" class="mt-2">
                    <div class="text-xs text-gray-500 mb-1">到站时间:</div>
                    <div v-for="eta in stopsEta[stop.stop_info.stop].slice(0, 3)" :key="eta.eta_seq"
                      class="flex items-center text-xs text-gray-700 mb-1">
                      <i class="fa fa-clock-o mr-1 text-green-600"></i>
                      <span class="font-medium">{{ formatETA(eta.eta) }}</span>
                      <span v-if="eta.rmk_tc" class="ml-2 text-gray-500">({{ eta.rmk_tc }})</span>
                    </div>
                  </div>
                  <div v-else-if="stopsEta[stop.stop_info.stop] && stopsEta[stop.stop_info.stop].length === 0"
                    class="mt-2 text-xs text-gray-400">
                    <i class="fa fa-info-circle mr-1"></i>
                    暂无班次信息
                  </div>

                  <!-- 在地图查看该站 -->
                  <div class="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    <button @click="viewStopOnMap(stop)"
                      class="inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                      title="在地图查看该站">
                      <i class="fa fa-map-marker mr-1"></i>
                      在地图查看
                    </button>
                    <button @click="navigateToStop(stop)"
                      class="inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                      title="Google Maps导航到该站">
                      <i class="fa fa-location-arrow mr-1"></i>
                      导航到站台
                    </button>
                    <button @click="openUberForStop(stop)"
                      class="inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded transition-colors"
                      title="用 Uber 从当前位置前往该站点">
                      <i class="fa fa-car mr-1"></i>
                      Uber
                    </button>
                    <button @click="toggleStopFavorite(stop, $event)"
                      class="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded transition-colors"
                      :class="isStopFavorite(stop.stop_info.stop) ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'"
                      :title="isStopFavorite(stop.stop_info.stop) ? '取消收藏' : '收藏站台'">
                      <i class="fa" :class="getFavoriteCategoryIcon(stop.stop_info.stop)"></i>
                      <span class="ml-1">{{ getFavoriteCategoryText(stop.stop_info.stop) }}</span>
                    </button>
                    <button @click="toggleOtherRoutes(stop)"
                      class="inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded transition-colors"
                      title="查看该站可搭乘的其它路线">
                      <i class="fa fa-random mr-1"></i>
                      查看其它路线
                    </button>
                  </div>
                  <div v-if="isOtherRoutesVisible(stop.stop_info.stop)" class="mt-3">
                    <div v-if="isOtherRoutesLoading(stop.stop_info.stop)"
                      class="flex items-center text-xs text-gray-500">
                      <i class="fa fa-spinner fa-spin mr-2"></i>
                      正在载入其它路线...
                    </div>
                    <div v-else-if="getOtherRoutesError(stop.stop_info.stop)"
                      class="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                      {{ getOtherRoutesError(stop.stop_info.stop) }}
                    </div>
                    <div v-else>
                      <div v-if="getOtherRoutes(stop.stop_info.stop).length > 0"
                        class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 space-y-2">
                        <div v-for="other in getOtherRoutes(stop.stop_info.stop)" :key="`${stop.stop_info.stop}-${other.route}-${other.bound}-${other.service_type}`"
                          class="flex items-center text-xs text-slate-700 space-x-2">
                          <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                            {{ other.route }}
                          </span>
                          <span class="flex items-center space-x-1 text-slate-600">
                            <i class="fa fa-long-arrow-right text-slate-400"></i>
                            <span>{{ other.destination || '目的地待获取' }}</span>
                          </span>
                        </div>
                      </div>
                      <div v-else class="text-xs text-slate-500">该站暂无其它可用路线</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 收藏分类菜单 -->
  <div v-if="showFavoriteMenu" class="fixed inset-0 z-[9999]" @click="closeFavoriteMenu">
    <div class="absolute bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-40"
      :style="{ left: favoriteMenuPosition.x + 'px', top: (favoriteMenuPosition.y - 140) + 'px', transform: 'translateX(-50%)' }"
      @click.stop>
      <button @click="addFavoriteWithCategory(routeStops.find(s => s.stop_info.stop === showFavoriteMenu), 'normal')"
        class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center text-left">
        <i class="fa fa-star mr-2 text-yellow-500"></i>
        收藏站台
      </button>
      <button @click="addFavoriteWithCategory(routeStops.find(s => s.stop_info.stop === showFavoriteMenu), 'home')"
        class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center text-left">
        <i class="fa fa-home mr-2 text-blue-500"></i>
        设为家庭站台
      </button>
      <button @click="addFavoriteWithCategory(routeStops.find(s => s.stop_info.stop === showFavoriteMenu), 'office')"
        class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center text-left">
        <i class="fa fa-building mr-2 text-green-500"></i>
        设为办公室站台
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import busApi from '@/api/bus.js'
import Navbar from '@/components/Navbar.vue'
import { generateUberDeepLink, openUber as openUberApp } from '@/utils/uber.js'

// 响应式数据
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const routeData = ref({
  type: "RouteList",
  version: "1.0",
  generated_timestamp: new Date().toISOString(),
  data: []
})

// 站点详情相关数据
const selectedRoute = ref(null)
const routeStops = ref([])
const stopsLoading = ref(false)
const stopsError = ref(null)
const stopsEta = ref({})

// 收藏分类弹窗相关
const showFavoriteMenu = ref(null) // 当前显示菜单的站点ID
const favoriteMenuPosition = ref({ x: 0, y: 0 })

// 本地收藏站点（localStorage）
const FAVORITES_KEY = 'bus:favoriteStops'
const favoriteStops = ref([]) // [{ stop, name_tc, name_en, lat, longitude, added_at }]

const activeOtherRoutesStop = ref(null)
const stopOtherRoutes = ref({})
const stopOtherRoutesError = ref({})
const stopOtherRoutesLoading = ref({})

// 计算属性
const routes = computed(() => routeData.value.data || [])

// 去重后的路线列表 - 每条线路只显示一个方向
const uniqueRoutes = computed(() => {
  const routeMap = new Map()

  routes.value.forEach(route => {
    const key = `${route.route}-${route.service_type}`

    if (!routeMap.has(key)) {
      // 如果是第一次遇到这个线路，直接添加
      routeMap.set(key, route)
    } else {
      // 如果已经存在，优先保留出站方向(O)
      const existing = routeMap.get(key)
      if (existing.bound === 'I' && route.bound === 'O') {
        routeMap.set(key, route)
      }
    }
  })

  return Array.from(routeMap.values())
})

const filteredRoutes = computed(() => {
  let filtered = uniqueRoutes.value

  // 按路线号码精准匹配
  if (searchQuery.value) {
    const query = searchQuery.value.trim()
    filtered = filtered.filter(route => route.route === query)
  }

  return filtered
})

// 计算相反方向的路线
const oppositeDirectionRoute = computed(() => {
  if (!selectedRoute.value) return null

  const currentRoute = selectedRoute.value
  const oppositeBound = currentRoute.bound === 'O' ? 'I' : 'O'

  // 在所有路线中查找相同路线号和服务类型，但方向相反的路线
  return routes.value.find(route =>
    route.route === currentRoute.route &&
    route.service_type === currentRoute.service_type &&
    route.bound === oppositeBound
  )
})

// 判断某站点是否收藏
const isStopFavorite = (stopId) => {
  if (!stopId) return false
  return favoriteStops.value.some(s => s.stop === stopId)
}

// 方法
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '无数据'
  return new Date(timestamp).toLocaleString('zh-HK')
}

// 读取/保存收藏（站点）
const loadFavorites = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    favoriteStops.value = Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.warn('读取收藏失败:', e)
    favoriteStops.value = []
  }
}

const saveFavorites = () => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteStops.value))
  } catch (e) {
    console.warn('保存收藏失败:', e)
  }
}

// 切换收藏状态（站点）
const toggleStopFavorite = (stop, event) => {
  const s = stop?.stop_info
  if (!s?.stop) return

  const existing = favoriteStops.value.find(x => x.stop === s.stop)
  if (existing) {
    // 如果已收藏，直接取消收藏
    const idx = favoriteStops.value.findIndex(x => x.stop === s.stop)
    favoriteStops.value.splice(idx, 1)
    saveFavorites()
    showFavoriteMenu.value = null
  } else {
    // 如果未收藏，显示分类菜单
    const rect = event.target.getBoundingClientRect()
    favoriteMenuPosition.value = {
      x: rect.left + rect.width / 2,
      y: rect.top
    }
    showFavoriteMenu.value = s.stop
  }
}

// 添加收藏（带分类）
const addFavoriteWithCategory = (stop, category = 'normal') => {
  const s = stop?.stop_info
  if (!s?.stop) return

  favoriteStops.value.push({
    stop: s.stop,
    name_tc: s.name_tc,
    name_en: s.name_en,
    lat: s.lat,
    longitude: s.longitude,
    category: category, // 'normal', 'home', 'office'
    added_at: new Date().toISOString()
  })
  saveFavorites()
  showFavoriteMenu.value = null
}

// 关闭收藏菜单
const closeFavoriteMenu = () => {
  showFavoriteMenu.value = null
}

// 获取收藏站点信息（包含分类）
const getFavoriteInfo = (stopId) => {
  return favoriteStops.value.find(s => s.stop === stopId)
}

// 获取收藏分类显示文字
const getFavoriteCategoryText = (stopId) => {
  const info = getFavoriteInfo(stopId)
  if (!info) return '收藏站台'
  switch (info.category) {
    case 'home': return '家庭站台'
    case 'office': return '办公室站台'
    default: return '已收藏'
  }
}

// 获取收藏分类图标
const getFavoriteCategoryIcon = (stopId) => {
  const info = getFavoriteInfo(stopId)
  if (!info) return 'fa-star-o'
  switch (info.category) {
    case 'home': return 'fa-home'
    case 'office': return 'fa-building'
    default: return 'fa-star'
  }
}

const isOtherRoutesVisible = (stopId) => {
  if (!stopId) return false
  return activeOtherRoutesStop.value === stopId
}

const isOtherRoutesLoading = (stopId) => {
  if (!stopId) return false
  return Boolean(stopOtherRoutesLoading.value[stopId])
}

const getOtherRoutes = (stopId) => {
  if (!stopId) return []
  return stopOtherRoutes.value[stopId] || []
}

const getOtherRoutesError = (stopId) => {
  if (!stopId) return null
  return stopOtherRoutesError.value[stopId] || null
}

const loadOtherRoutesForStop = async (stopId) => {
  if (!stopId) return

  stopOtherRoutesLoading.value = { ...stopOtherRoutesLoading.value, [stopId]: true }
  stopOtherRoutesError.value = { ...stopOtherRoutesError.value, [stopId]: null }

  try {
    const response = await fetch('/routeBusData.json', { cache: 'no-store' })
    if (!response.ok) {
      throw new Error('无法读取本地路线索引')
    }
    const dataset = await response.json()
    const list = Array.isArray(dataset?.data) ? dataset.data : []
    const currentRoute = selectedRoute.value
    const currentRouteId = currentRoute ? String(currentRoute.route) : ''
    const currentBound = currentRoute ? String(currentRoute.bound) : ''
    const currentServiceType = currentRoute ? String(currentRoute.service_type) : ''

    const seen = new Set()
    const candidates = []

    list.forEach((item) => {
      if (!item || item.stop !== stopId) return
      const key = `${item.route}-${item.bound}-${item.service_type}`
      if (seen.has(key)) return
      seen.add(key)

      if (
        item.route === currentRouteId &&
        String(item.bound) === currentBound &&
        String(item.service_type) === currentServiceType
      ) {
        return
      }

      candidates.push({
        route: String(item.route),
        bound: String(item.bound),
        service_type: String(item.service_type)
      })
    })

    if (candidates.length === 0) {
      stopOtherRoutes.value = { ...stopOtherRoutes.value, [stopId]: [] }
      return
    }

    const details = await Promise.all(candidates.map(async (candidate) => {
      try {
        const response = await busApi.getRoute(candidate.route, candidate.bound, candidate.service_type)
        const detail = response?.data?.data
        if (detail) {
          return {
            route: detail.route,
            bound: detail.bound,
            service_type: detail.service_type,
            destination: detail.dest_sc || detail.dest_tc || detail.dest_en || ''
          }
        }
      } catch (err) {
        console.error(`获取线路 ${candidate.route} 详情失败:`, err)
      }

      return {
        route: candidate.route,
        bound: candidate.bound,
        service_type: candidate.service_type,
        destination: ''
      }
    }))

    stopOtherRoutes.value = { ...stopOtherRoutes.value, [stopId]: details.filter(Boolean) }
  } catch (err) {
    console.error('获取其它路线数据失败:', err)
    const message = err?.message || '无法读取其它路线数据'
    stopOtherRoutesError.value = { ...stopOtherRoutesError.value, [stopId]: message }
    stopOtherRoutes.value = { ...stopOtherRoutes.value, [stopId]: [] }
  } finally {
    stopOtherRoutesLoading.value = { ...stopOtherRoutesLoading.value, [stopId]: false }
  }
}

const toggleOtherRoutes = async (stop) => {
  const stopId = stop?.stop_info?.stop
  if (!stopId) return

  if (activeOtherRoutesStop.value === stopId) {
    activeOtherRoutesStop.value = null
    return
  }

  activeOtherRoutesStop.value = stopId

  await loadOtherRoutesForStop(stopId)
}

const fetchRoutes = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await busApi.getRoutes()

    if (response.data) {
      routeData.value = response.data
    } else {
      throw new Error('没有返回数据')
    }
  } catch (err) {
    console.error('获取巴士路线数据失败:', err)
    error.value = err.response?.data?.error || err.message || '网络连接失败'
  } finally {
    loading.value = false
  }
}

// 查看路线站点
const viewRouteStops = async (route) => {
  selectedRoute.value = route
  await fetchRouteStops(route)
}

// 获取路线站点信息
const fetchRouteStops = async (route) => {
  stopsLoading.value = true
  stopsError.value = null
  routeStops.value = []
  stopsEta.value = {}
  activeOtherRoutesStop.value = null

  console.log('开始获取站点数据:', route)

  try {
    const response = await busApi.getRouteStops(route.route, route.bound, route.service_type)
    console.log('API响应:', response)

    if (response.data && response.data.data) {
      routeStops.value = response.data.data
      // 获取每个站点的ETA数据
      await fetchAllStopsETA(response.data.data)
    } else {
      throw new Error('没有返回站点数据')
    }
  } catch (err) {
    console.error('获取站点数据失败:', err)
    stopsError.value = err.response?.data?.error || err.message || '网络连接失败'
  } finally {
    stopsLoading.value = false
  }
}

// 获取所有站点的ETA数据
const fetchAllStopsETA = async (stops) => {
  // 使用 Promise.all 进行并行查询
  const etaPromises = stops.map(async (stop) => {
    if (stop.stop_info && stop.stop_info.stop) {
      try {
        const etaResponse = await busApi.getStopETA(stop.stop_info.stop)
        if (etaResponse.data && etaResponse.data.data) {
          // 过滤当前路线的ETA数据
          const filteredEta = etaResponse.data.data.filter(eta =>
            eta.route === selectedRoute.value.route &&
            eta.dir === selectedRoute.value.bound &&
            eta.service_type === parseInt(selectedRoute.value.service_type)
          )
          return { stopId: stop.stop_info.stop, eta: filteredEta }
        }
      } catch (err) {
        console.error(`获取站点 ${stop.stop_info.stop} ETA失败:`, err)
        return { stopId: stop.stop_info.stop, eta: [] }
      }
    }
    return null
  })

  // 等待所有ETA查询完成
  const etaResults = await Promise.all(etaPromises)

  // 将结果设置到stopsEta对象中
  etaResults.forEach(result => {
    if (result) {
      stopsEta.value[result.stopId] = result.eta
    }
  })
}

// 清除站点详情
const clearRouteStops = () => {
  selectedRoute.value = null
  routeStops.value = []
  stopsError.value = null
  stopsEta.value = {}
  activeOtherRoutesStop.value = null
}

// 切换到相反方向
const switchToOppositeDirection = async () => {
  if (!oppositeDirectionRoute.value) return

  // 切换到相反方向的路线
  await viewRouteStops(oppositeDirectionRoute.value)
}

// 在地图查看整条线路
const openRouteOnMap = () => {
  if (!selectedRoute.value || !routeStops.value.length) return

  // 收集所有站点的经纬度和名称
  const stopsData = routeStops.value
    .filter(stop => stop.stop_info && Number.isFinite(Number(stop.stop_info.lat)) && Number.isFinite(Number(stop.stop_info.longitude)))
    .map(stop => {
      const lat = Number(stop.stop_info.lat)
      const lng = Number(stop.stop_info.longitude)
      const name = stop.stop_info.name_tc || stop.stop_info.name_en || `站点${stop.seq}`
      return `${lat},${lng},${name}`
    })

  if (stopsData.length === 0) {
    // 如果没有坐标数据，回退到搜索模式
    const { route, orig_tc, dest_tc } = selectedRoute.value
    const searchQuery = `香港巴士${route}号线 ${orig_tc}到${dest_tc}`
    const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`
    window.open(url, '_blank')
    return
  }

  // 构建新页面URL参数
  const params = new URLSearchParams({
    stops: stopsData.join('|')
  })

  const url = `/route-map?${params.toString()}`
  window.open(url, '_blank')
}

// 在地图查看单个站点
const viewStopOnMap = (stop) => {
  if (!selectedRoute.value || !stop?.stop_info) return
  const s = stop.stop_info
  const lat = Number(s.lat)
  const lng = Number(s.longitude)

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    // 使用经纬度坐标直接定位
    const url = `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`
    window.open(url, '_blank')
  } else {
    // 如果没有经纬度，则回退到搜索模式
    const searchQuery = `香港${s.name_tc || s.name_en}巴士站`
    const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`
    window.open(url, '_blank')
  }
}

// 格式化ETA时间显示
const formatETA = (etaString) => {
  if (!etaString) return ''
  const etaTime = new Date(etaString)
  const now = new Date()
  const diffMinutes = Math.floor((etaTime - now) / 1000 / 60)

  if (diffMinutes <= 0) {
    return '即将到站'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟`
  } else {
    return etaTime.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })
  }
}

// Google Maps 导航到站点
const navigateToStop = (stop) => {
  if (!stop?.stop_info) return
  const s = stop.stop_info
  const lat = Number(s.lat)
  const lng = Number(s.longitude)
  
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    // 使用经纬度坐标导航
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
  } else {
    // 如果没有经纬度，则回退到地名搜索
    const destination = `香港${s.name_tc || s.name_en || '巴士站'}`
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
    window.open(url, '_blank')
  }
}

// 使用 Uber 从当前位置前往该站点
const openUberForStop = (stop) => {
  if (!selectedRoute.value || !stop?.stop_info) return
  const s = stop.stop_info
  const destLat = Number(s.lat)
  const destLng = Number(s.longitude)
  if (!Number.isFinite(destLat) || !Number.isFinite(destLng)) {
    alert('站点缺少经纬度信息，无法打开 Uber')
    return
  }

  if (!navigator.geolocation) {
    alert('您的浏览器不支持地理位置功能')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      try {
        const pickup = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: '当前位置'
        }
        const destination = {
          lat: destLat,
          lng: destLng,
          name: s.name_tc || s.name_en || '巴士站'
        }
        const url = generateUberDeepLink(pickup, destination)
        openUberApp(url, { pickup, destination })
      } catch (e) {
        console.error('生成 Uber 链接失败:', e)
        alert('生成 Uber 链接失败：' + (e?.message || '未知错误'))
      }
    },
    (error) => {
      let msg = '获取当前位置失败'
      switch (error.code) {
        case error.PERMISSION_DENIED:
          msg = '位置权限被拒绝，请在浏览器设置中允许位置访问'
          break
        case error.POSITION_UNAVAILABLE:
          msg = '位置信息不可用'
          break
        case error.TIMEOUT:
          msg = '获取位置超时'
          break
      }
      alert(msg)
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  )
}
// 生命周期
onMounted(() => {
  loadFavorites()
  fetchRoutes()
})
</script>
