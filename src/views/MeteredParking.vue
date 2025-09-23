<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Main Content -->
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center space-y-3 mb-8">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Metered Parking</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">香港咪錶停车位信息</h1>
          <p class="text-base sm:text-lg text-slate-600">查看香港各区咪錶停车位分布情况</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载咪錶停车位数据...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadMeteredParkingData"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Statistics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ totalSpaces }}</div>
              <div class="text-sm text-slate-500">停车位总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-green-600">{{ totalPoles }}</div>
              <div class="text-sm text-slate-500">咪錶总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-purple-600">{{ regionCount }}</div>
              <div class="text-sm text-slate-500">地区数量</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-orange-600">{{ districtCount }}</div>
              <div class="text-sm text-slate-500">区域数量</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-sky-600">{{ vehicleTypes.length }}</div>
              <div class="text-sm text-slate-500">车型种类</div>
            </div>
          </div>

          <!-- Map View -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">咪錶停车位分布地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图显示筛选后的咪錶停车位标记</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <!-- Filters -->
          <div class="mb-6">
            <!-- 地点搜索框 -->
            <div class="mb-4 relative">
              <div
                class="flex items-center gap-2 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200">
                <i class="fa fa-map-marker-alt text-blue-500"></i>
                <div class="flex-1 relative">
                  <input ref="searchInputRef" v-model="locationSearchQuery" @input="onLocationSearchInput"
                    @focus="showSuggestions" @blur="hideLocationSuggestions" placeholder="搜索地点（显示周围2公里内的咪錶停车位）..."
                    class="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <button v-if="selectedLocation" @click="clearLocationSearch"
                  class="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                  清除
                </button>
              </div>

              <!-- 选中地点信息 -->
              <div v-if="selectedLocation" class="mt-2 p-2 bg-blue-50 rounded-lg">
                <div class="text-sm text-blue-700">
                  <i class="fa fa-location-arrow mr-2"></i>
                  正在显示 <span class="font-medium">{{ locationSearchQuery }}</span> 周围 2 公里内的 {{
                    nearbyMeteredSpaces.length
                  }} 个咪錶停车位
                </div>
              </div>
            </div>

            <!-- 搜索建议下拉框 -->
            <Teleport to="body">
              <div v-if="showLocationSuggestions && locationSuggestions.length > 0" :style="suggestionBoxStyle"
                class="bg-white rounded-lg shadow-lg border border-slate-200 max-h-60 overflow-y-auto"
                style="position: absolute; z-index: 9999;">
                <div v-for="(suggestion, index) in locationSuggestions" :key="index"
                  @mousedown="selectLocationSuggestion(suggestion)"
                  class="p-3 cursor-pointer hover:bg-blue-50 border-b border-slate-100 last:border-b-0">
                  <div class="font-medium text-slate-900">{{ suggestion.name }}</div>
                  <div class="text-sm text-slate-600">{{ suggestion.address }}</div>
                  <div class="text-xs text-slate-500">{{ suggestion.district }} {{ suggestion.city }}</div>
                </div>
              </div>
            </Teleport>

            <!-- 原有筛选器 -->
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <n-input v-model:value="searchQuery" clearable placeholder="搜索街道名称或地址..." />
              </div>
              <div class="w-full sm:w-56">
                <n-select v-model:value="selectedRegion" :options="regionOptions" clearable placeholder="全部地区" />
              </div>
              <div class="w-full sm:w-56">
                <n-select v-model:value="selectedDistrict" :options="districtOptions" clearable placeholder="全部区域" />
              </div>
              <div class="w-full sm:w-56">
                <n-select v-model:value="selectedVehicleType" :options="vehicleTypeOptions" clearable
                  placeholder="全部车型" />
              </div>
            </div>
          </div>

          <!-- Metered Parking List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="space in nearbyMeteredSpaces" :key="space.ParkingSpaceId"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">

              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ space.Street_tc || space.Street }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ space.SectionOfStreet_tc || space.SectionOfStreet }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ space.SubDistrict_tc || space.SubDistrict }} - {{ space.District_tc || space.District
                      }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span
                      class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-1">
                      {{ getVehicleTypeLabel(space.VehicleType) }}
                    </span>
                    <div class="text-xs text-slate-500">{{ space.Region_tc || space.Region }}</div>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-lg font-semibold text-green-600">{{ space.PoleId }}</div>
                    <div class="text-xs text-slate-500">咪錶编号</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-blue-600">{{ space.LPP }}</div>
                    <div class="text-xs text-slate-500">最长停车(分钟)</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-purple-600">HK${{ space.PaymentUnit }}</div>
                    <div class="text-xs text-slate-500">计费周期价格</div>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      停车位: {{ space.ParkingSpaceId }}
                    </span>
                    <span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md font-medium">
                      计费周期: {{ space.TimeUnit }}分钟
                    </span>
                    <span class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-medium">
                      {{ getOperatingPeriodLabel(space.OperatingPeriod) }}
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <button @click="viewOnMap(space)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <i class="fa fa-map mr-2"></i>
                      地图查看
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="nearbyMeteredSpaces.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">
              {{ selectedLocation ? '该地点周围2公里内未找到咪錶停车位' : '未找到匹配的咪錶停车位' }}
            </h3>
            <p class="text-slate-600 mb-6">
              {{ selectedLocation ? '请尝试搜索其他地点或调整筛选器' : '请尝试调整搜索条件或筛选器' }}
            </p>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import Navbar from '@/components/Navbar.vue'
import GoogleMap from '@/components/GoogleMap.vue'
import AMapLoader from '@amap/amap-jsapi-loader'

// 高德地图配置
const amapKey = '7dce621dfd925b38d31e0f421cc39740'
const securityJsCode = '62b0ed3ad14b522b670ddc9ec88a1f32'
const AMap = ref(null)
const placeSearch = ref(null)

// 地点搜索相关状态
const locationSearchQuery = ref('')
const showLocationSuggestions = ref(false)
const locationSuggestions = ref([])
const searchTimeout = ref(null)
const selectedLocation = ref(null)
const searchRadius = 2000 // 2公里搜索半径
const searchInputRef = ref(null)

// 搜索建议框位置计算
const suggestionBoxStyle = computed(() => {
  if (!searchInputRef.value || !showLocationSuggestions.value || !locationSuggestions.value.length) {
    return { display: 'none' }
  }

  try {
    const rect = searchInputRef.value.getBoundingClientRect()
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop

    return {
      top: `${rect.bottom + scrollY + 4}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
      minWidth: '280px'
    }
  } catch (e) {
    console.warn('Error calculating suggestion box position:', e)
    return { display: 'none' }
  }
})

const loading = ref(true)
const error = ref('')
const meteredParkingSpaces = ref([])
const searchQuery = ref('')
const selectedRegion = ref('')
const selectedDistrict = ref('')
const selectedVehicleType = ref('')

// 数据加载函数
const loadMeteredParkingData = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/metered-packing.json')
    if (!response.ok) {
      throw new Error('Failed to load metered parking data')
    }
    const data = await response.json()
    meteredParkingSpaces.value = data
  } catch (err) {
    error.value = '加载咪錶停车位数据失败，请稍后重试'
    console.error('Error loading metered parking data:', err)
  } finally {
    loading.value = false
  }
}

// 车型标签映射
const getVehicleTypeLabel = (type) => {
  const typeMap = {
    'A': '一般车辆 (私家车等)',
    'C': '旅游巴 (Coaches)',
    'G': '货车 (Goods Vehicles)'
  }
  return typeMap[type] || type
}

// 运营期间标签映射
const getOperatingPeriodLabel = (period) => {
  const periodMap = {
    'A': '周一至周六 08:00-24:00',
    'B': '周一至周六 08:00-20:00',
    'D': '周一至周六 08:00-24:00；周日假期 10:00-22:00',
    'E': '每日 07:00-20:00',
    'F': '每日 08:00-21:00',
    'H': '每日 08:00-20:00',
    'J': '每日 08:00-24:00',
    'N': '每日 19:00-24:00',
    'P': '周一至周六 08:00-20:00',
    'Q': '周一至周六 08:00-20:00；周日假期 10:00-22:00',
    'S': '复杂时段（详见说明）'
  }
  return periodMap[period] || period
}

// 统计数据
const totalSpaces = computed(() => meteredParkingSpaces.value.length)

const totalPoles = computed(() => {
  return new Set(meteredParkingSpaces.value.map(space => space.PoleId)).size
})

const regionCount = computed(() => {
  return new Set(meteredParkingSpaces.value.map(space => space.Region_tc || space.Region)).size
})

const districtCount = computed(() => {
  return new Set(meteredParkingSpaces.value.map(space => space.District_tc || space.District)).size
})

const regions = computed(() => {
  return [...new Set(meteredParkingSpaces.value.map(space => space.Region_tc || space.Region))].sort()
})

const districts = computed(() => {
  return [...new Set(meteredParkingSpaces.value.map(space => space.District_tc || space.District))].sort()
})

const vehicleTypes = computed(() => {
  return [...new Set(meteredParkingSpaces.value.map(space => space.VehicleType))].sort()
})

const regionOptions = computed(() => regions.value.map(r => ({ label: r, value: r })))
const districtOptions = computed(() => districts.value.map(d => ({ label: d, value: d })))
const vehicleTypeOptions = computed(() => vehicleTypes.value.map(v => ({
  label: getVehicleTypeLabel(v),
  value: v
})))

// 更新地图中心点和标记
const mapCenter = computed(() => {
  if (selectedLocation.value) {
    return selectedLocation.value
  }
  const first = nearbyMeteredSpaces.value[0]
  if (first && first.Latitude && first.Longitude) {
    return { lat: Number(first.Latitude), lng: Number(first.Longitude) }
  }
  return { lat: 22.3027, lng: 114.1772 } // 香港中心点
})

const mapMarkers = computed(() => {
  const markers = nearbyMeteredSpaces.value
    .filter(s => s.Latitude && s.Longitude)
    .map(s => ({
      lat: Number(s.Latitude),
      lng: Number(s.Longitude),
      title: `${s.Street_tc || s.Street} - ${s.ParkingSpaceId}`,
      // 咪錶停车位使用橙色停车标记
      icon: 'https://maps.google.com/mapfiles/ms/icons/parking_lot_maps.png'
    }))

  // 如果有选中的地点，添加醒目的红色图钉标记
  if (selectedLocation.value) {
    markers.push({
      lat: selectedLocation.value.lat,
      lng: selectedLocation.value.lng,
      title: `📍 搜索地点: ${locationSearchQuery.value}`,
      // 使用红色图钉标记突出显示搜索地点
      icon: 'https://maps.google.com/mapfiles/ms/icons/red-pushpin.png'
    })
  }

  return markers
})

// 计算指定位置周围的咪錶停车位
const nearbyMeteredSpaces = computed(() => {
  // 先应用原有的筛选条件
  let filtered = meteredParkingSpaces.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(space =>
      (space.Street_tc || space.Street || '').toLowerCase().includes(query) ||
      (space.SectionOfStreet_tc || space.SectionOfStreet || '').toLowerCase().includes(query) ||
      (space.SubDistrict_tc || space.SubDistrict || '').toLowerCase().includes(query)
    )
  }

  if (selectedRegion.value) {
    filtered = filtered.filter(space =>
      (space.Region_tc || space.Region) === selectedRegion.value
    )
  }

  if (selectedDistrict.value) {
    filtered = filtered.filter(space =>
      (space.District_tc || space.District) === selectedDistrict.value
    )
  }

  if (selectedVehicleType.value) {
    filtered = filtered.filter(space => space.VehicleType === selectedVehicleType.value)
  }

  // 如果没有选中地点，返回所有筛选后的结果
  if (!selectedLocation.value) {
    return filtered
  }

  // 如果有选中地点，再按距离筛选
  const { lat: targetLat, lng: targetLng } = selectedLocation.value

  return filtered.filter(space => {
    const spaceLat = Number(space.Latitude)
    const spaceLng = Number(space.Longitude)

    if (!spaceLat || !spaceLng) return false

    const distance = calculateDistance(targetLat, targetLng, spaceLat, spaceLng)
    return distance <= searchRadius
  })
})

// 距离计算函数（使用Haversine公式）
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3 // 地球半径（米）
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // 返回米
}

// 初始化高德地图API
async function initAMap() {
  try {
    window._AMapSecurityConfig = {
      securityJsCode: securityJsCode,
    }

    AMap.value = await AMapLoader.load({
      key: amapKey,
      version: '2.0',
      plugins: ['AMap.PlaceSearch']
    })

    // 初始化地点搜索服务
    placeSearch.value = new AMap.value.PlaceSearch({
      city: '香港',
      citylimit: true,
      pageSize: 10,
      extensions: 'all'
    })

    console.log('高德地图API初始化成功')
  } catch (error) {
    console.error('高德地图API初始化失败:', error)
  }
}

// 地点搜索输入处理
function onLocationSearchInput() {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  if (!locationSearchQuery.value.trim()) {
    locationSuggestions.value = []
    showLocationSuggestions.value = false
    return
  }

  // 延迟搜索，避免频繁调用
  searchTimeout.value = setTimeout(() => {
    searchPlaces(locationSearchQuery.value)
  }, 300)
}

// 显示搜索建议
async function showSuggestions() {
  showLocationSuggestions.value = true
  // 等待DOM更新后重新计算位置
  await nextTick()
  // 触发重新计算位置
  if (locationSearchQuery.value.trim() && locationSuggestions.value.length === 0) {
    onLocationSearchInput()
  }
}

// 搜索地点
async function searchPlaces(keyword) {
  if (!placeSearch.value) return

  placeSearch.value.search(keyword, async (status, result) => {
    if (status === 'complete' && result.poiList && result.poiList.pois) {
      locationSuggestions.value = result.poiList.pois.map(poi => ({
        name: poi.name,
        address: Array.isArray(poi.address) ? poi.address.join(';') : poi.address,
        district: poi.adname || poi.adcode || '',
        city: poi.cityname || poi.citycode || '',
        location: {
          lat: poi.location.lat,
          lng: poi.location.lng
        }
      }))
      showLocationSuggestions.value = true
      // 等待DOM更新后重新计算位置
      await nextTick()
    } else {
      locationSuggestions.value = []
      showLocationSuggestions.value = false
    }
  })
}

// 选择地点建议
function selectLocationSuggestion(suggestion) {
  locationSearchQuery.value = suggestion.name
  selectedLocation.value = suggestion.location
  locationSuggestions.value = []
  showLocationSuggestions.value = false

  console.log('选中地点:', suggestion.name, suggestion.location)
}

// 隐藏建议列表
function hideLocationSuggestions() {
  setTimeout(() => {
    showLocationSuggestions.value = false
  }, 200)
}

// 清除地点选择
function clearLocationSearch() {
  locationSearchQuery.value = ''
  selectedLocation.value = null
  locationSuggestions.value = []
  showLocationSuggestions.value = false
}

const viewOnMap = (space) => {
  const lat = Number(space.Latitude)
  const lng = Number(space.Longitude)
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  window.open(url, '_blank')
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedRegion.value = ''
  selectedDistrict.value = ''
  selectedVehicleType.value = ''
  locationSearchQuery.value = ''
  selectedLocation.value = null
}

// 生命周期
onMounted(async () => {
  await loadMeteredParkingData()
  await initAMap()
})
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
