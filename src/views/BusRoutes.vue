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
                class="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
                :title="`切换到${oppositeDirectionRoute.bound === 'O' ? '去程' : '回程'}方向`">
                <i class="fa fa-exchange mr-1"></i>
                切换到{{ oppositeDirectionRoute.bound === 'O' ? '去程' : '回程' }}
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
                  <div class="mt-2 flex items-center gap-2">
                    <button @click="viewStopOnMap(stop)"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                      title="在地图查看该站">
                      <i class="fa fa-map-marker mr-1"></i>
                      在地图查看
                    </button>
                    <button @click="openUberForStop(stop)"
                      class="inline-flex items-center justify-center w-7 h-7 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded transition-colors"
                      title="用 Uber 从当前位置前往该站点">
                      <i class="fa fa-car"></i>
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

// 方法
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '无数据'
  return new Date(timestamp).toLocaleString('zh-HK')
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
}

// 切换到相反方向
const switchToOppositeDirection = async () => {
  if (!oppositeDirectionRoute.value) return

  // 切换到相反方向的路线
  await viewRouteStops(oppositeDirectionRoute.value)
}

// 在地图查看整条线路
const openRouteOnMap = () => {
  if (!selectedRoute.value) return
  const { route, bound, service_type } = selectedRoute.value
  const url = `/bus-stops-map.html?route=${encodeURIComponent(route)}&direction=${encodeURIComponent(bound)}&serviceType=${encodeURIComponent(service_type)}`
  window.open(url, '_blank') // 新标签页
}

// 在地图查看单个站点
const viewStopOnMap = (stop) => {
  if (!selectedRoute.value || !stop?.stop_info) return
  const { route, bound, service_type } = selectedRoute.value
  const s = stop.stop_info
  const url =
    `/bus-stops-map.html?route=${encodeURIComponent(route)}` +
    `&direction=${encodeURIComponent(bound)}` +
    `&serviceType=${encodeURIComponent(service_type)}` +
    `&lat=${encodeURIComponent(s.lat || '')}` +
    `&lng=${encodeURIComponent(s.longitude || '')}` +
    `&name=${encodeURIComponent(s.name_tc || s.name_en || '')}`
  window.open(url, '_blank') // 新标签页
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
  fetchRoutes()
})
</script>
