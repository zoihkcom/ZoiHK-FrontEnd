<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center space-y-3 mb-12">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Ride Hailing</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900"><i class="fa fa-car mr-2"></i>Uber 打车</h1>
          <p class="text-base sm:text-lg text-slate-600">快速叫车，一键跳转到Uber应用</p>
        </div>

        <!-- Location Section -->
        <div class="space-y-8">
          <!-- Current Location -->
          <div
            class="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 transition-all duration-300 hover:shadow-md">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i class="fa fa-map-marker text-blue-600 text-xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-slate-900">当前位置</h3>
              </div>
              <button @click="getCurrentLocation" :disabled="loadingLocation"
                class="group inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
                <svg v-if="loadingLocation" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                  <path fill="currentColor" class="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <svg v-else class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.293 9.293a1 1 0 011.414 0L8 13.586V10a1 1 0 012 0v3.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
                </svg>
                {{ loadingLocation ? '获取中...' : '刷新' }}
              </button>
            </div>

            <div class="text-slate-600">
              <div v-if="loadingLocation" class="flex items-center text-blue-600">
                <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                  <path fill="currentColor" class="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                正在获取位置...
              </div>
              <div v-else-if="locationError" class="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd" />
                  </svg>
                  {{ locationError }}
                </div>
              </div>
              <div v-else-if="currentLocation" class="space-y-1.5">
                <p class="text-lg font-medium text-slate-900">{{ currentLocation.name || '当前位置' }}</p>
                <p class="text-xs text-slate-500 font-mono">{{ currentLocation.lat.toFixed(6) }}, {{
                  currentLocation.lng.toFixed(6) }}</p>
              </div>
              <p v-else class="text-slate-400 italic">点击刷新获取当前位置</p>
            </div>
          </div>

          <!-- Destination -->
          <div
            class="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 transition-all duration-300 hover:shadow-md">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i class="fa fa-bullseye text-green-600 text-xl"></i>
              </div>
              <h3 class="text-xl font-semibold text-slate-900">目的地</h3>
            </div>

            <div class="space-y-6">
              <div class="flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                  <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <n-input v-model:value="destinationInput" @keyup.enter="searchDestination" clearable
                    placeholder="输入目的地地址或地点名称" />
                </div>
                <button @click="searchDestination" :disabled="!destinationInput.trim()"
                  class="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg">
                  搜索
                </button>
              </div>

              <!-- Destination Info -->
              <div v-if="destination"
                class="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-4 shadow-sm">
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <i class="fa fa-map-pin"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-base font-medium text-slate-900">{{ destination.name }}</p>
                    <p class="text-xs text-slate-500 font-mono mt-1">{{ destination.lat.toFixed(6) }}, {{
                      destination.lng.toFixed(6) }}</p>
                  </div>
                </div>
              </div>

              <!-- Popular Destinations -->
              <div>
                <h4 class="text-lg font-medium text-slate-900 mb-4">热门目的地</h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button v-for="place in popularPlaces" :key="place.name" @click="selectDestination(place)"
                    class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-sm font-medium shadow-sm">
                    {{ place.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Section -->
        <div class="mt-8 space-y-6">
          <button @click="openUber" :disabled="!canOpenUber"
            class="w-full group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold text-lg rounded-2xl hover:from-black hover:to-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl gap-3 ring-1 ring-black/10 hover:ring-black/20">
            <i class="fa fa-car text-white text-2xl"></i>
            <span>
              {{ canOpenUber ? '打开 Uber 叫车' : '请先设置起点和终点' }}
            </span>
          </button>


        </div>

        <!-- Info Section -->
        <div class="mt-8">
          <div
            class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-500 rounded-xl shadow-lg p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i class="fa fa-lightbulb-o text-blue-600"></i>
              </div>
              <h4 class="text-xl font-bold text-blue-800">使用说明</h4>
            </div>
            <div class="text-blue-700 text-sm leading-relaxed space-y-2">
              <p>• 首次使用需要允许获取位置权限</p>
              <p>• 可以输入地址搜索目的地，或选择热门地点</p>
              <p>• 点击"打开 Uber 叫车"会跳转到Uber应用或网页版</p>
              <p>• 如果没有安装Uber应用，会自动打开网页版</p>
              <p>• 使用官方Uber深度链接格式，确保最佳兼容性</p>
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

// 响应式数据
const currentLocation = ref(null)
const destination = ref(null)
const destinationInput = ref('')
const loadingLocation = ref(false)
const locationError = ref('')

// 香港热门地点
const popularPlaces = ref([
  { name: '香港国际机场', lat: 22.3080, lng: 113.9185 },
  { name: '中环', lat: 22.2783, lng: 114.1747 },
  { name: '尖沙咀', lat: 22.2976, lng: 114.1722 },
  { name: '铜锣湾', lat: 22.2793, lng: 114.1847 },
  { name: '旺角', lat: 22.3193, lng: 114.1694 },
  { name: '海港城', lat: 22.2945, lng: 114.1678 },
])

// 计算属性
const canOpenUber = computed(() => {
  return currentLocation.value && destination.value
})

const uberUrl = computed(() => {
  if (!canOpenUber.value) return ''

  try {
    return generateUberDeepLink(currentLocation.value, destination.value)
  } catch (error) {
    console.error('生成Uber链接失败:', error)
    return ''
  }
})

// 方法
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = '您的浏览器不支持地理位置功能'
    return
  }

  loadingLocation.value = true
  locationError.value = ''

  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        name: '当前位置'
      }
      loadingLocation.value = false
    },
    (error) => {
      let errorMessage = '获取位置失败'
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = '位置权限被拒绝，请在浏览器设置中允许位置访问'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = '位置信息不可用'
          break
        case error.TIMEOUT:
          errorMessage = '获取位置超时'
          break
      }
      locationError.value = errorMessage
      loadingLocation.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    }
  )
}

const searchDestination = async () => {
  const query = destinationInput.value.trim()
  if (!query) return

  // 简单的地址解析（实际项目中可以集成更强大的地理编码服务）
  try {
    // 检查是否是坐标格式 (lat,lng)
    const coordMatch = query.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/)
    if (coordMatch) {
      destination.value = {
        lat: parseFloat(coordMatch[1]),
        lng: parseFloat(coordMatch[2]),
        name: query
      }
      return
    }

    // 检查是否匹配热门地点
    const popularPlace = popularPlaces.value.find(place =>
      place.name.includes(query) || query.includes(place.name)
    )
    if (popularPlace) {
      destination.value = { ...popularPlace }
      destinationInput.value = popularPlace.name
      return
    }

    // 默认设置为香港中心区域
    destination.value = {
      lat: 22.2783,
      lng: 114.1747,
      name: query
    }
  } catch (error) {
    console.error('搜索目的地失败:', error)
  }
}

const selectDestination = (place) => {
  destination.value = { ...place }
  destinationInput.value = place.name
}

const openUber = () => {
  if (!canOpenUber.value) return

  const url = uberUrl.value
  if (!url) return

  try {
    openUberApp(url, {
      pickup: currentLocation.value,
      destination: destination.value
    })
  } catch (error) {
    console.error('打开Uber应用失败:', error)
  }
}

// 生命周期
onMounted(() => {
  // 页面加载时自动获取当前位置
  getCurrentLocation()
})
</script>
