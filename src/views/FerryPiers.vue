<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />

    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              香港渡轮码头
            </span>
          </h1>
          <p class="text-lg text-slate-600 mb-2">查看香港六个渡轮码头的位置</p>
          <p class="text-sm text-slate-500">数据来源：HKKF Open Data</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载码头数据...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadPiers"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Fares (Fixed) -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">票价信息</h2>
              <p class="text-sm text-slate-600">以下为4条线路的固定票价，由数据维护</p>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="fare in fares" :key="fare.id" class="p-4 rounded-lg border border-slate-200 bg-white">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-medium text-slate-900">{{ fare.name }}</h3>
                    <span class="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                      固定票价
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span v-if="fare.monthly != null" class="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
                      月票：{{ formatPrice(fare.monthly) }}
                    </span>
                    <span v-if="fare.studentMonthly != null" class="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
                      学生月票：{{ formatPrice(fare.studentMonthly) }}
                    </span>
                    <span v-if="fare.multi != null" class="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
                      多程票：{{ formatPrice(fare.multi) }}
                    </span>
                    <span v-if="fare.adult != null" class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                      成人：{{ formatPrice(fare.adult) }}
                    </span>
                    <span v-if="fare.child != null" class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
                      儿童：{{ formatPrice(fare.child) }}
                    </span>
                    <span v-if="fare.senior != null" class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">
                      65岁以上：{{ formatPrice(fare.senior) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ piers.length }}</div>
              <div class="text-sm text-slate-500">码头数量</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-green-600">{{ successfulCount }}</div>
              <div class="text-sm text-slate-500">成功加载</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ failedCount }}</div>
              <div class="text-sm text-slate-500">失败数量</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-orange-600">{{ routes.length }}</div>
              <div class="text-sm text-slate-500">渡轮线路</div>
            </div>
          </div>

          <!-- Routes Section -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">渡轮线路</h2>
              <p class="text-sm text-slate-600">点击线路查看时间表和实时到港信息</p>
            </div>
            <div class="p-4">
              <div v-if="routesLoading" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="ml-3 text-slate-600">正在加载线路...</span>
              </div>
              <div v-else-if="routes.length === 0" class="text-center py-8 text-slate-500">
                暂无线路数据
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="route in routes" :key="route.route_id"
                  @click="selectRoute(route)"
                  :class="[
                    'p-4 rounded-lg border border-slate-200 cursor-pointer transition-all hover:border-blue-300 hover:shadow-sm',
                    selectedRoute?.route_id === route.route_id ? 'border-blue-500 bg-blue-50' : 'bg-white'
                  ]">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-medium text-slate-900">{{ route.route_name_sc }}</h3>
                    <span class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Route {{ route.route_id }}
                    </span>
                  </div>
                  <p class="text-sm text-slate-600 mb-1">{{ route.route_name_en }}</p>
                  <div class="flex items-center text-sm text-slate-500">
                    <i class="fa fa-arrow-right mr-2"></i>
                    <span>{{ route.origin_sc }} ⇄ {{ route.destination_sc }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Route Details -->
          <div v-if="selectedRoute" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">{{ selectedRoute.route_name_sc }} - 时间表</h2>
                <p class="text-sm text-slate-600">{{ selectedRoute.origin_sc }} ⇄ {{ selectedRoute.destination_sc }}</p>
              </div>
              <button @click="refreshETA" :disabled="etaLoading"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                <i class="fa fa-refresh mr-2" :class="{ 'animate-spin': etaLoading }"></i>
                刷新ETA
              </button>
            </div>
            <div class="p-4">
              <div v-if="timeTableLoading || etaLoading" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="ml-3 text-slate-600">正在加载时间表...</span>
              </div>
              <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Inbound -->
                <div class="bg-green-50 rounded-lg p-4">
                  <h3 class="font-medium text-green-800 mb-3 flex items-center">
                    <i class="fa fa-arrow-left mr-2"></i>
                    {{ getDirectionText('inbound') }} (往{{ selectedRoute.origin_sc }})
                  </h3>
                  
                  <!-- ETA -->
                  <div class="mb-4">
                    <h4 class="text-sm font-medium text-green-700 mb-2">实时到港</h4>
                    <div class="space-y-1">
                      <div v-for="eta in getRouteETA(selectedRoute.route_id, 'inbound')" :key="eta.session_time"
                        class="bg-white rounded p-2 text-sm">
                        <div class="flex justify-between">
                          <span class="text-slate-600">班次: {{ eta.session_time }}</span>
                          <span class="font-medium text-green-600">{{ formatTime(eta.ETA) }}</span>
                        </div>
                      </div>
                      <div v-if="getRouteETA(selectedRoute.route_id, 'inbound').length === 0"
                        class="text-xs text-slate-500 text-center py-2">
                        暂无实时数据
                      </div>
                    </div>
                  </div>

                  <!-- Schedule -->
                  <div>
                    <h4 class="text-sm font-medium text-green-700 mb-2">时间表</h4>
                    <div class="max-h-40 overflow-y-auto space-y-1">
                      <div v-for="schedule in getRouteTimeTable(selectedRoute.route_id, 'inbound')" :key="schedule.time || schedule.departure_time"
                        class="bg-white rounded p-2 text-sm text-slate-600">
                        {{ schedule.time || schedule.departure_time || '--' }}
                      </div>
                      <div v-if="getRouteTimeTable(selectedRoute.route_id, 'inbound').length === 0"
                        class="text-xs text-slate-500 text-center py-2">
                        暂无时间表数据
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Outbound -->
                <div class="bg-blue-50 rounded-lg p-4">
                  <h3 class="font-medium text-blue-800 mb-3 flex items-center">
                    <i class="fa fa-arrow-right mr-2"></i>
                    {{ getDirectionText('outbound') }} (往{{ selectedRoute.destination_sc }})
                  </h3>
                  
                  <!-- ETA -->
                  <div class="mb-4">
                    <h4 class="text-sm font-medium text-blue-700 mb-2">实时到港</h4>
                    <div class="space-y-1">
                      <div v-for="eta in getRouteETA(selectedRoute.route_id, 'outbound')" :key="eta.session_time"
                        class="bg-white rounded p-2 text-sm">
                        <div class="flex justify-between">
                          <span class="text-slate-600">班次: {{ eta.session_time }}</span>
                          <span class="font-medium text-blue-600">{{ formatTime(eta.ETA) }}</span>
                        </div>
                      </div>
                      <div v-if="getRouteETA(selectedRoute.route_id, 'outbound').length === 0"
                        class="text-xs text-slate-500 text-center py-2">
                        暂无实时数据
                      </div>
                    </div>
                  </div>

                  <!-- Schedule -->
                  <div>
                    <h4 class="text-sm font-medium text-blue-700 mb-2">时间表</h4>
                    <div class="max-h-40 overflow-y-auto space-y-1">
                      <div v-for="schedule in getRouteTimeTable(selectedRoute.route_id, 'outbound')" :key="schedule.time || schedule.departure_time"
                        class="bg-white rounded p-2 text-sm text-slate-600">
                        {{ schedule.time || schedule.departure_time || '--' }}
                      </div>
                      <div v-if="getRouteTimeTable(selectedRoute.route_id, 'outbound').length === 0"
                        class="text-xs text-slate-500 text-center py-2">
                        暂无时间表数据
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Map -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">渡轮码头地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图显示六个码头位置</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="finalCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <!-- Piers List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="pier in piers" :key="pier.pier_id"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ pier.name_tc || pier.name_sc }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ pier.name_en }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>纬度：{{ pier.lat.toFixed(6) }}，经度：{{ pier.long.toFixed(6) }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Pier ID: {{ pier.pier_id }}
                    </span>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex gap-2">
                    <button @click="viewOnMap(pier)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <i class="fa fa-map mr-2"></i>
                      在 Google 地图打开
                    </button>
                    <button @click="focusMarker(pier)"
                      class="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                      <i class="fa fa-crosshairs"></i>
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
import GoogleMap from '@/components/GoogleMap.vue'
import request from '@/api/request.js'

const loading = ref(true)
const error = ref('')
const piers = ref([])
const routes = ref([])
const selectedRoute = ref(null)
const timeTables = ref({})
const etaData = ref({})
const routesLoading = ref(false)
const timeTableLoading = ref(false)
const etaLoading = ref(false)

const loadPiers = async () => {
  loading.value = true
  error.value = ''
  piers.value = []
  try {
    const ids = [1, 2, 3, 4, 5, 6]
    const base = 'https://www.hkkfeta.com/opendata/pier/'

    // 并行请求，接口 content-type 为 text/html，需手动解析 JSON
    const results = await Promise.allSettled(
      ids.map(async (id) => {
        const res = await fetch(base + id, { method: 'GET' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        const data = JSON.parse(text)
        return data
      })
    )

    const ok = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(obj => obj && obj.data && typeof obj.data.lat === 'number' && typeof obj.data.long === 'number')
      .map(obj => obj.data)

    piers.value = ok

    const failed = results.filter(r => r.status === 'rejected').length
    if (ok.length === 0) {
      throw new Error('无法加载任何码头数据')
    } else if (failed > 0) {
      // 局部失败仅提示，不阻断渲染
      console.warn(`部分码头数据加载失败：${failed} 个`)
    }
  } catch (e) {
    console.error('加载码头数据失败:', e)
    error.value = '加载码头数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const loadRoutes = async () => {
  routesLoading.value = true
  try {
    const response = await request.get('/ferry-pier/routes')
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      routes.value = response.data.data
    } else {
      throw new Error('线路数据格式错误')
    }
  } catch (e) {
    console.error('加载线路数据失败:', e)
    // 线路数据加载失败不影响码头显示
  } finally {
    routesLoading.value = false
  }
}

const loadTimeTable = async (routeId, direction) => {
  if (!routeId || !direction) return null
  
  const key = `${routeId}_${direction}`
  timeTableLoading.value = true
  
  try {
    const response = await request.get(`/ferry-pier/time_table/${routeId}/${direction}`)
    
    if (response.data && response.data.data) {
      timeTables.value[key] = response.data.data
      return response.data.data
    }
  } catch (e) {
    console.error(`加载时间表失败 (${routeId}-${direction}):`, e)
  } finally {
    timeTableLoading.value = false
  }
  return null
}

const loadETA = async (routeId, direction) => {
  if (!routeId || !direction) return null
  
  const key = `${routeId}_${direction}`
  etaLoading.value = true
  
  try {
    const response = await request.get(`/ferry-pier/eta/${routeId}/${direction}`)
    
    if (response.data && response.data.data) {
      etaData.value[key] = response.data.data
      return response.data.data
    }
  } catch (e) {
    console.error(`加载ETA失败 (${routeId}-${direction}):`, e)
  } finally {
    etaLoading.value = false
  }
  return null
}

onMounted(() => {
  loadPiers()
  loadRoutes()
})

const successfulCount = computed(() => piers.value.length)
const failedCount = computed(() => Math.max(0, 6 - piers.value.length))

const selectRoute = async (route) => {
  selectedRoute.value = route
  // 同时加载两个方向的时间表和ETA
  await Promise.all([
    loadTimeTable(route.route_id, 'inbound'),
    loadTimeTable(route.route_id, 'outbound'),
    loadETA(route.route_id, 'inbound'),
    loadETA(route.route_id, 'outbound')
  ])
}

const getRouteTimeTable = (routeId, direction) => {
  const key = `${routeId}_${direction}`
  return timeTables.value[key] || []
}

const getRouteETA = (routeId, direction) => {
  const key = `${routeId}_${direction}`
  return etaData.value[key] || []
}

const formatTime = (timeString) => {
  if (!timeString) return '--'
  try {
    const date = new Date(timeString)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return timeString
  }
}

const getDirectionText = (direction) => {
  return direction === 'inbound' ? '入港' : '出港'
}

const refreshETA = async () => {
  if (!selectedRoute.value) return
  
  await Promise.all([
    loadETA(selectedRoute.value.route_id, 'inbound'),
    loadETA(selectedRoute.value.route_id, 'outbound')
  ])
}

const mapCenter = computed(() => {
  if (!piers.value.length) return { lat: 22.3027, lng: 114.1772 }
  const lat = piers.value.reduce((s, p) => s + p.lat, 0) / piers.value.length
  const lng = piers.value.reduce((s, p) => s + p.long, 0) / piers.value.length
  return { lat, lng }
})

const mapMarkers = computed(() =>
  piers.value.map(p => ({
    lat: p.lat,
    lng: p.long,
    title: p.name_tc || p.name_sc || p.name_en
  }))
)

const viewOnMap = (pier) => {
  const name = pier.name_sc
  if (name) {
    const query = `${name}`
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    window.open(url, '_blank')
  } else {
    // 兜底：无名称时仍用经纬度
    const url = `https://www.google.com/maps/search/?api=1&query=${pier.lat},${pier.long}`
    window.open(url, '_blank')
  }
}

// 仅用于辅助居中地图，由于 GoogleMap 组件没有直接暴露 map 实例，这里通过修改中心点实现
const mapCenterOverride = ref(null)
const finalCenter = computed(() => mapCenterOverride.value || mapCenter.value)
const focusMarker = (pier) => {
  mapCenterOverride.value = { lat: pier.lat, lng: pier.long }
}

// ----- Fixed Fares for 4 routes -----
const fares = ref([
  { id: 1, name: '线路1', monthly: 827, studentMonthly: 579, multi: 242, adult: 27.5, child: 13.7, senior: 13.7 },
  { id: 2, name: '线路2', monthly: 777, studentMonthly: 543, multi: 195, adult: 22.1, child: 11, senior: 11 },
  { id: 3, name: '线路3', monthly: 676, studentMonthly: 473, multi: 174, adult: 19.8, child: 9.9, senior: 9.9 },
  { id: 4, name: '线路4', adult: 18.7, child: 9.3, senior: 9.3 }
])

const formatPrice = (v) => {
  if (v === null || v === undefined) return '—'
  const n = Number(v)
  if (Number.isNaN(n)) return String(v)
  return `HK$ ${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}`
}

</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
