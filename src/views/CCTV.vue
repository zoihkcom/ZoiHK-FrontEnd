<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Main Content -->
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center space-y-3 mb-8">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Traffic CCTV</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">香港交通CCTV实时监控</h1>
          <p class="text-base sm:text-lg text-slate-600">查看香港各区交通监控摄像头分布及实时画面</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载CCTV数据...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadCCTVData"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Statistics -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ cctvCameras.length }}</div>
              <div class="text-sm text-slate-500">监控摄像头总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-green-600">{{ regions.length }}</div>
              <div class="text-sm text-slate-500">覆盖区域</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ districts.length }}</div>
              <div class="text-sm text-slate-500">覆盖地区</div>
            </div>
          </div>

          <!-- Map View -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">CCTV分布地图</h2>
              <p class="text-sm text-slate-600">点击地图上的标记查看监控画面</p>
            </div>
            <div class="h-180">
              <iframe src="/cctv-map.html" class="w-full h-full" frameborder="0" title="CCTV分布地图"></iframe>
            </div>
          </div>

          <!-- Filters (Naive UI) -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索地点描述或代码..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedRegion" :options="regionOptions" clearable placeholder="全部区域" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedDistrict" :options="districtOptions" clearable placeholder="全部地区" />
            </div>
          </div>

          <!-- Traffic Information -->
          <div v-if="trafficData && trafficData.length > 0"
            class="mb-10 rounded-3xl border border-slate-200/80 bg-white/95 p-7 sm:p-10 backdrop-blur-xl">
            <div class="mb-2 flex flex-wrap items-start justify-between gap-6 sm:gap-8">
              <div class="flex items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <i class="fa fa-road text-lg"></i>
                </div>
                <div class="space-y-1">
                  <h3 class="text-2xl font-light tracking-tight text-slate-900">特别交通信息</h3>
                  <p class="text-sm text-slate-500 sm:text-base">实时掌握道路状况，提前做好出行安排</p>
                </div>
              </div>
              <button @click="refreshTrafficData" :disabled="trafficLoading"
                class="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
                <i v-if="trafficLoading" class="fa fa-spinner fa-spin"></i>
                {{ trafficLoading ? '刷新中...' : '刷新' }}
              </button>
            </div>

            <div class="max-h-96 space-y-4 overflow-y-auto pr-1">
              <div v-for="(traffic, index) in trafficData" :key="traffic.id || index"
                class="border-slate-200/80 bg-white/95 p-5 backdrop-blur-lg sm:p-6">
                <div class="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div class="flex flex-wrap items-center gap-3">
                    <h4 class="text-base font-medium tracking-tight text-slate-900">{{ traffic.headingCn }}</h4>
                    <span
                      class="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                      :class="getStatusClass(traffic.statusCn)">
                      {{ traffic.statusCn }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <i class="fa fa-clock-o"></i>
                    <span>{{ formatTrafficTime(traffic.announcementDate) }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <i class="fa fa-map-marker text-blue-500"></i>
                  <span>{{ traffic.locationCn }}</span>
                  <span v-if="traffic.directionCn" class="text-slate-400">· 往{{ traffic.directionCn }}方向</span>
                </div>

                <div v-if="traffic.nearLandmarkCn" class="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <i class="fa fa-location-arrow text-violet-500"></i>
                  <span>近{{ traffic.nearLandmarkCn }}</span>
                </div>

                <div
                  class="mt-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-700">
                  {{ traffic.contentCn }}
                </div>

                <div v-if="traffic.incidentNumber" class="mt-3 text-right text-xs tracking-wide text-slate-400">
                  事故编号：{{ traffic.incidentNumber }}
                </div>
              </div>
            </div>

            <div v-if="trafficError"
              class="mt-6 inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">
              <i class="fa fa-exclamation-triangle"></i>
              <span>{{ trafficError }}</span>
            </div>
          </div>

          <!-- CCTV List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="camera in filteredCameras" :key="camera.key"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">

              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ camera.description }}</h3>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ camera.region }}, {{ camera.district }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                      {{ camera.key }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-lg font-semibold text-blue-600">{{ parseFloat(camera.latitude).toFixed(4) }}</div>
                    <div class="text-xs text-slate-500">纬度</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-purple-600">{{ parseFloat(camera.longitude).toFixed(4) }}
                    </div>
                    <div class="text-xs text-slate-500">经度</div>
                  </div>
                </div>

                <!-- CCTV Image Preview -->
                <div class="mb-4 bg-slate-50 rounded-lg p-3">
                  <div class="text-center">
                    <div v-if="!camera.imageLoaded && !camera.imageError" class="text-slate-400 py-8">
                      <i class="fa fa-camera text-3xl mb-2"></i>
                      <p class="text-sm">点击查看实时画面</p>
                    </div>
                    <img v-else-if="camera.imageLoaded" :src="camera.url" :alt="`CCTV ${camera.key}`"
                      class="max-w-full h-32 object-cover rounded mx-auto"
                      @error="camera.imageError = true; camera.imageLoaded = false" />
                    <div v-else-if="camera.imageError" class="text-red-400 py-8">
                      <i class="fa fa-exclamation-triangle text-2xl mb-2"></i>
                      <p class="text-sm">图片加载失败</p>
                    </div>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      实时监控
                    </span>
                    <span class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-medium">
                      <i class="fa fa-video-camera mr-1"></i>
                      在线
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <button @click="viewOnMap(camera)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <i class="fa fa-map mr-2"></i>
                      地图查看
                    </button>
                    <button @click="loadCameraImage(camera)"
                      class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                      <i class="fa fa-refresh"></i>
                    </button>
                    <button @click="openFullImage(camera)"
                      class="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                      <i class="fa fa-external-link"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredCameras.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的监控摄像头</h3>
            <p class="text-slate-600 mb-6">请尝试调整搜索条件或筛选器</p>
            <button @click="resetFilters"
              class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
              重置筛选器
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import request from '@/api/request.js'
import { fetchTrafficInfo } from '@/api/traffic.js'

const loading = ref(true)
const error = ref('')
const cctvCameras = ref([])
const searchQuery = ref('')
const selectedRegion = ref('')
const selectedDistrict = ref('')

// 交通信息相关状态
const trafficData = ref([])
const trafficLoading = ref(false)
const trafficError = ref('')

const loadCCTVData = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await request.get('/cctv')
    const data = response.data
    cctvCameras.value = data.filter(item =>
      item.description && item.latitude && item.longitude && item.url
    ).map(camera => ({
      ...camera,
      imageLoaded: false,
      imageError: false
    }))

    // 自动加载所有摄像头图片
    setTimeout(() => {
      cctvCameras.value.forEach(camera => {
        loadCameraImage(camera)
      })
    }, 500) // 延迟500ms开始加载图片，避免一次性请求过多

  } catch (err) {
    error.value = '加载CCTV数据失败，请稍后重试'
    console.error('Error loading CCTV data:', err)
  } finally {
    loading.value = false
  }
}

// 获取交通信息
const fetchTrafficData = async () => {
  try {
    const data = await fetchTrafficInfo()
    trafficData.value = data || []
  } catch (err) {
    console.error('获取交通信息失败:', err)
    trafficError.value = '无法获取交通信息，请稍后重试'
    throw err
  }
}

// 同时获取CCTV和交通信息
const loadAllData = async () => {
  try {
    loading.value = true
    error.value = ''
    trafficError.value = ''

    // 并行获取两个数据源
    await Promise.allSettled([
      loadCCTVData(),
      fetchTrafficData()
    ])

  } catch (err) {
    console.error('获取数据失败:', err)
  } finally {
    loading.value = false
  }
}

const refreshTrafficData = async () => {
  try {
    trafficLoading.value = true
    trafficError.value = ''
    await fetchTrafficData()
  } catch (err) {
    // 错误已在fetchTrafficData中处理
  } finally {
    trafficLoading.value = false
  }
}

const filteredCameras = computed(() => {
  let filtered = cctvCameras.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(camera =>
      camera.description.toLowerCase().includes(query) ||
      camera.key.toLowerCase().includes(query)
    )
  }

  if (selectedRegion.value) {
    filtered = filtered.filter(camera => camera.region === selectedRegion.value)
  }

  if (selectedDistrict.value) {
    filtered = filtered.filter(camera => camera.district === selectedDistrict.value)
  }

  return filtered
})

const regions = computed(() => {
  return [...new Set(cctvCameras.value.map(camera => camera.region))].sort()
})

const districts = computed(() => {
  return [...new Set(cctvCameras.value.map(camera => camera.district))].sort()
})

const regionOptions = computed(() => regions.value.map(r => ({ label: r, value: r })))
const districtOptions = computed(() => districts.value.map(d => ({ label: d, value: d })))

const viewOnMap = (camera) => {
  const params = new URLSearchParams({
    lat: camera.latitude,
    lng: camera.longitude,
    name: camera.description,
    key: camera.key,
    region: camera.region,
    district: camera.district,
    url: camera.url
  })
  const mapUrl = `/cctv-map.html?${params.toString()}`
  window.open(mapUrl, '_blank')
}

const loadCameraImage = (camera) => {
  camera.imageLoaded = false
  camera.imageError = false

  const img = new Image()
  img.onload = () => {
    camera.imageLoaded = true
  }
  img.onerror = () => {
    camera.imageError = true
  }
  img.src = camera.url
}

const openFullImage = (camera) => {
  window.open(camera.url, '_blank')
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedRegion.value = ''
  selectedDistrict.value = ''
}

// 格式化交通信息时间
const formatTrafficTime = (timeString) => {
  if (!timeString) return ''
  try {
    const date = new Date(timeString)
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return timeString
  }
}

// 获取交通状态样式类
const getStatusClass = (status) => {
  const rawStatus = status ? status.toString().trim() : ''
  const normalized = rawStatus.toUpperCase()

  if (rawStatus === '完结' || rawStatus === '已完结' || normalized === 'CLOSED') {
    return 'border border-emerald-200 bg-emerald-50 text-emerald-600'
  }

  if (rawStatus === '进行中' || rawStatus === '处理中' || normalized === 'ONGOING') {
    return 'border border-rose-200 bg-rose-50 text-rose-600'
  }

  if (rawStatus === '已更新' || rawStatus === '更新' || normalized === 'UPDATED') {
    return 'border border-amber-200 bg-amber-50 text-amber-600'
  }

  return 'border border-slate-200 bg-slate-100 text-slate-700'
}

onMounted(() => {
  loadAllData()
})
</script>
