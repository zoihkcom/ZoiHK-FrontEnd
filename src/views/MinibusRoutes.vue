<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    <div class="pt-24 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">专线小巴路线</h1>
          <p class="text-xl text-gray-600">Hong Kong Green Minibus Routes</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span class="ml-3 text-lg text-gray-600">载入路线数据...</span>
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
          <button @click="fetchMinibusData"
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
                  <h2 class="text-xl font-semibold text-gray-900">路线列表 (Route List)</h2>
                  <p class="text-sm text-gray-500 mt-1">点击路线查看详细站点信息，可切换方向</p>
                </div>
                <div class="text-gray-600 text-sm" v-if="minibusData.generated_timestamp">
                  <i class="fa fa-clock-o mr-1"></i>
                  更新时间: {{ formatTimestamp(minibusData.generated_timestamp) }}
                </div>
              </div>
            </div>

            <!-- Search -->
            <div class="px-6 py-4 bg-gray-50 border-b">
              <div class="max-w-xl flex gap-3">
                <input v-model="searchQuery"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="搜索路线号码、起点或终点..." />
                <select v-model="regionFilter" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none">
                  <option value="">全部地区</option>
                  <option value="HKI">港岛 HKI</option>
                  <option value="KLN">九龙 KLN</option>
                  <option value="NT">新界 NT</option>
                </select>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">路线
                      (Route)</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">起点
                      (Origin)</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">终点
                      (Destination)</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地区</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="route in filteredRoutes" :key="route.key"
                    class="hover:bg-gray-50 transition-colors duration-200">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span class="text-green-700 font-bold text-sm">{{ route.route_code }}</span>
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
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {{ route.region }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button @click="viewRoute(route)"
                        class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
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
                {{ selectedRoute.route_code }} 线 - {{ currentDirectionIndex === 0 ? '去程' : '回程' }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ currentDirectionIndex === 0
                  ? (selectedRoute.directions[0]?.orig_tc + ' → ' + selectedRoute.directions[0]?.dest_tc)
                  : (selectedRoute.directions[1]?.orig_tc + ' → ' + selectedRoute.directions[1]?.dest_tc) }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="switchDirection"
                class="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                :title="`切换到${currentDirectionIndex === 0 ? '回程' : '去程'}方向`">
                <i class="fa fa-exchange mr-1"></i>
                切换{{ currentDirectionIndex === 0 ? '回程' : '去程' }}
              </button>
              <button @click="clearSelected" class="text-gray-500 hover:text-gray-700 transition-colors">
                <i class="fa fa-times text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="stopsLoading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span class="ml-3 text-gray-600">载入站点数据...</span>
          </div>

          <div v-if="stopsError" class="p-6 bg-red-50 border border-red-200 m-4 rounded-lg">
            <div class="flex items-center">
              <i class="fa fa-exclamation-triangle text-red-500 text-xl mr-3"></i>
              <div>
                <h4 class="text-red-800 font-semibold">站点数据载入失败</h4>
                <p class="text-red-600 mt-1">{{ stopsError }}</p>
              </div>
            </div>
          </div>

          <div v-if="!stopsLoading && !stopsError" class="divide-y divide-gray-200">
            <div v-for="(stop, index) in currentStops" :key="stop.stop_id + '-' + index"
              class="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span class="text-green-700 font-semibold text-sm">{{ index + 1 }}</span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900">{{ stop.name_tc }}</div>
                  <div class="text-sm text-gray-500">{{ stop.name_en }}</div>
                  <div class="text-xs text-gray-400 mt-1">ID: {{ stop.stop_id }}</div>
                  <div class="text-xs text-gray-400 mt-1 flex items-center">
                    <i class="fa fa-map-marker mr-1"></i>
                    <template v-if="stopCoords[stop.stop_id]">
                      {{ formatCoord(stopCoords[stop.stop_id].lat) }}, {{ formatCoord(stopCoords[stop.stop_id].lng) }}
                    </template>
                    <template v-else-if="coordsLoading[stop.stop_id]">
                      坐标加载中...
                    </template>
                    <template v-else>
                      无坐标
                    </template>
                  </div>

                  <!-- ETA -->
                  <div class="mt-2">
                    <div class="text-xs text-gray-500 mb-1">到站时间:</div>
                    <div v-if="etaLoading[stop.stop_id]" class="text-xs text-gray-400">
                      <i class="fa fa-clock-o mr-1"></i> ETA 加载中...
                    </div>
                    <template v-else>
                      <div v-if="(stopsEta[stop.stop_id] || []).length > 0">
                        <div v-for="eta in (stopsEta[stop.stop_id] || []).slice(0, 3)" :key="eta.eta_seq"
                          class="flex items-center text-xs text-gray-700 mb-1">
                          <i class="fa fa-clock-o mr-1 text-green-600"></i>
                          <span class="font-medium">{{ formatEtaDiff(eta.diff, eta.timestamp) }}</span>
                          <span v-if="eta.remarks_tc" class="ml-2 text-gray-500">({{ eta.remarks_tc }})</span>
                        </div>
                      </div>
                      <div v-else class="text-xs text-gray-400">
                        <i class="fa fa-info-circle mr-1"></i> 暂无班次信息
                      </div>
                    </template>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="mt-2 flex items-center gap-2">
                    <button @click="viewStopOnMap(stop)"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                      title="在地图查看该站">
                      <i class="fa fa-map-marker mr-1"></i>
                      在地图查看
                    </button>
                    <button v-if="stopCoords[stop.stop_id]" @click="navigateToStop(stop)"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                      title="Google Maps导航到该站">
                      <i class="fa fa-directions mr-1"></i>
                      导航
                    </button>
                    <button v-if="stopCoords[stop.stop_id]" @click="openUberForStop(stop)"
                      class="inline-flex items-center justify-center w-7 h-7 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded transition-colors"
                      title="用 Uber 从当前位置前往该站点">
                      <i class="fa fa-car"></i>
                    </button>
                    <button @click="toggleStopFavorite(stop)"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium rounded transition-colors"
                      :class="isStopFavorite(stop.stop_id) ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'"
                      :title="isStopFavorite(stop.stop_id) ? '取消收藏' : '收藏本站'">
                      <i class="fa" :class="isStopFavorite(stop.stop_id) ? 'fa-star' : 'fa-star-o'"></i>
                      <span class="ml-1">{{ isStopFavorite(stop.stop_id) ? '已收藏' : '收藏本站' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { generateUberDeepLink, openUber as openUberApp } from '@/utils/uber.js'

const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const regionFilter = ref('')

const minibusData = ref({ type: '', version: '', generated_timestamp: '', regions: { HKI: [], KLN: [], NT: [] } })

const selectedRoute = ref(null)
const stopsLoading = ref(false)
const stopsError = ref(null)
const currentDirectionIndex = ref(0) // 0: 去程, 1: 回程
const stopCoords = ref({}) // { [stopId]: { lat, lng, updatedAt } }
const coordsLoading = ref({}) // { [stopId]: boolean }
const stopsEta = ref({}) // { [stopId]: EtaItem[] }
const etaLoading = ref({}) // { [stopId]: boolean }

// 本地收藏站点（与其他页面共用同一键）
const FAVORITES_KEY = 'bus:favoriteStops'
const favoriteStops = ref([]) // [{ stop, name_tc, name_en, lat, longitude, added_at }]

// 将 regions 下的数组扁平化成列表，展示默认用方向1的起讫点
const routes = computed(() => {
  const list = []
  const regions = minibusData.value?.regions || {}
  for (const regionKey of Object.keys(regions)) {
    const arr = regions[regionKey] || []
    for (const route of arr) {
      const d1 = route.directions?.[0]
      list.push({
        key: `${regionKey}-${route.route_id}-${route.route_code}`,
        region: regionKey,
        route_id: route.route_id,
        route_code: route.route_code,
        directions: route.directions || [],
        orig_tc: d1?.orig_tc || '',
        orig_en: d1?.orig_en || '',
        dest_tc: d1?.dest_tc || '',
        dest_en: d1?.dest_en || '',
      })
    }
  }
  // 路线号码排序（字符串，保持前端表现稳定）
  return list.sort((a, b) => a.route_code.localeCompare(b.route_code, 'zh-Hans-CN', { numeric: true }))
})

const filteredRoutes = computed(() => {
  let result = routes.value
  const q = searchQuery.value.trim().toLowerCase()
  const reg = regionFilter.value

  if (reg) result = result.filter(r => r.region === reg)

  if (q) {
    result = result.filter(r =>
      r.route_code.toLowerCase().includes(q) ||
      r.orig_tc.toLowerCase().includes(q) ||
      r.dest_tc.toLowerCase().includes(q) ||
      r.orig_en.toLowerCase().includes(q) ||
      r.dest_en.toLowerCase().includes(q)
    )
  }

  return result
})

const currentStops = computed(() => {
  if (!selectedRoute.value) return []
  const dirs = selectedRoute.value.directions || []
  const idx = currentDirectionIndex.value
  return dirs[idx]?.stops || []
})

const formatTimestamp = (ts) => {
  try {
    return new Date(ts).toLocaleString('zh-HK', { hour12: false })
  } catch (e) {
    return ts || ''
  }
}

// -------- 收藏站点（localStorage） --------
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

const isStopFavorite = (stopId) => {
  if (!stopId) return false
  return favoriteStops.value.some(s => s.stop === stopId)
}

const toggleStopFavorite = (stop) => {
  const sId = stop?.stop_id
  if (!sId) return
  const idx = favoriteStops.value.findIndex(s => s.stop === sId)
  if (idx >= 0) {
    favoriteStops.value.splice(idx, 1)
  } else {
    favoriteStops.value.push({
      stop: sId,
      name_tc: stop.name_tc,
      name_en: stop.name_en,
      lat: stopCoords.value[sId]?.lat ?? null,
      longitude: stopCoords.value[sId]?.lng ?? null,
      added_at: new Date().toISOString(),
    })
  }
  saveFavorites()
}

const fetchMinibusData = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('/minibus_data.json', { cache: 'no-cache' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    // 兼容直接根层结构
    minibusData.value = json?.regions ? json : { regions: {}, ...json }
  } catch (e) {
    console.error('载入专线小巴数据失败:', e)
    error.value = e?.message || '网络连接失败'
  } finally {
    loading.value = false
  }
}

const viewRoute = (route) => {
  selectedRoute.value = route
  currentDirectionIndex.value = 0
  // 本地 JSON 已包含站点清单，无需额外请求
  stopsLoading.value = false
  stopsError.value = null
  // 拉取当前方向坐标
  fetchCurrentDirectionCoords()
  // 拉取当前方向 ETA
  fetchCurrentDirectionETA()
}

const switchDirection = () => {
  if (!selectedRoute.value) return
  const total = selectedRoute.value.directions?.length || 0
  if (total <= 1) return
  currentDirectionIndex.value = currentDirectionIndex.value === 0 ? 1 : 0
  // 切换方向后拉取新方向的坐标
  fetchCurrentDirectionCoords()
  // 以及 ETA
  fetchCurrentDirectionETA()
}

const clearSelected = () => {
  selectedRoute.value = null
  currentDirectionIndex.value = 0
  stopsError.value = null
}

onMounted(() => {
  loadFavorites()
  fetchMinibusData()
})

// ------ 坐标(WGS84)获取 ------
const formatCoord = (n) => {
  if (typeof n !== 'number' || !Number.isFinite(n)) return ''
  return n.toFixed(6)
}

const fetchStopWgs84 = async (stopId, { force = false } = {}) => {
  if (!stopId) return
  if (!force && stopCoords.value[stopId]) return
  if (coordsLoading.value[stopId]) return
  coordsLoading.value[stopId] = true
  try {
    const res = await fetch(`https://data.etagmb.gov.hk/stop/${encodeURIComponent(stopId)}`, {
      cache: 'no-cache',
      mode: 'cors',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const wgs84 = json?.data?.coordinates?.wgs84
    const lat = Number(wgs84?.latitude)
    const lng = Number(wgs84?.longitude)
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      stopCoords.value[stopId] = {
        lat,
        lng,
        updatedAt: json?.generated_timestamp || new Date().toISOString(),
      }
    }
  } catch (e) {
    console.error(`获取站点 ${stopId} 坐标失败:`, e)
  } finally {
    coordsLoading.value[stopId] = false
  }
}

const fetchCurrentDirectionCoords = async () => {
  const stops = currentStops.value || []
  if (!stops.length) return
  // 控制并发数，避免请求过快
  const concurrency = 6
  let idx = 0
  const runner = async () => {
    while (idx < stops.length) {
      const i = idx++
      const s = stops[i]
      await fetchStopWgs84(s.stop_id)
    }
  }
  const tasks = Array.from({ length: Math.min(concurrency, stops.length) }, () => runner())
  await Promise.allSettled(tasks)
}

// 在地图查看单个站点
const viewStopOnMap = (stop) => {
  if (!stop?.stop_id) return
  const coord = stopCoords.value[stop.stop_id]
  
  if (coord && Number.isFinite(coord.lat) && Number.isFinite(coord.lng)) {
    // 使用经纬度坐标直接定位
    const url = `https://www.google.com/maps/search/?api=1&query=${coord.lat}%2C${coord.lng}`
    window.open(url, '_blank')
  } else {
    // 如果没有经纬度，则回退到搜索模式
    const searchQuery = `香港${stop.name_tc || stop.name_en || '巴士站'}`
    const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`
    window.open(url, '_blank')
  }
}

// Google Maps 导航到站点
const navigateToStop = (stop) => {
  if (!stop?.stop_id || !stopCoords.value[stop.stop_id]) return
  const destination = `香港${stop.name_tc || stop.name_en || '巴士站'}`
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
  window.open(url, '_blank')
}

// 使用 Uber 从当前位置前往该站点
const openUberForStop = (stop) => {
  if (!stop?.stop_id || !stopCoords.value[stop.stop_id]) return
  const coord = stopCoords.value[stop.stop_id]
  const destLat = coord.lat
  const destLng = coord.lng
  
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
          name: stop.name_tc || stop.name_en || '巴士站'
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

// ------ ETA 获取（按路线-站点） ------
const fetchStopETA = async (stopId, routeId, routeSeqTarget) => {
  if (!stopId || !routeId || !routeSeqTarget) return
  if (etaLoading.value[stopId]) return
  etaLoading.value[stopId] = true
  try {
    const res = await fetch(`https://data.etagmb.gov.hk/eta/route-stop/${encodeURIComponent(routeId)}/${encodeURIComponent(stopId)}`, {
      cache: 'no-cache',
      mode: 'cors',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const arr = Array.isArray(json?.data) ? json.data : []
    // 找到当前方向（route_seq）对应的ETA项
    const entry = arr.find(e => e?.route_seq === routeSeqTarget)
    const list = Array.isArray(entry?.eta) ? entry.eta : []
    stopsEta.value[stopId] = list
  } catch (e) {
    console.error(`获取站点 ${stopId} ETA 失败:`, e)
    stopsEta.value[stopId] = []
  } finally {
    etaLoading.value[stopId] = false
  }
}

const fetchCurrentDirectionETA = async () => {
  if (!selectedRoute.value) return
  const routeId = selectedRoute.value.route_id
  const seqTarget = (currentDirectionIndex.value || 0) + 1 // route_seq: 1 或 2
  const stops = currentStops.value || []
  if (!routeId || !stops.length) return

  const concurrency = 6
  let idx = 0
  const runner = async () => {
    while (idx < stops.length) {
      const i = idx++
      const s = stops[i]
      await fetchStopETA(s.stop_id, routeId, seqTarget)
    }
  }
  const tasks = Array.from({ length: Math.min(concurrency, stops.length) }, () => runner())
  await Promise.allSettled(tasks)
}

const formatEtaDiff = (diff, timestamp) => {
  const n = Number(diff)
  if (Number.isFinite(n)) {
    if (n <= 0) return '即将到站'
    if (n < 60) return `${n} 分钟`
  }
  // 兜底用时间戳
  if (timestamp) {
    try { return new Date(timestamp).toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' }) } catch { }
  }
  return ''
}
</script>
