<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Main Content -->
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              香港公共单车泊位信息
            </span>
          </h1>
          <p class="text-lg text-slate-600 mb-2">查看香港各区公共单车泊位分布情况</p>
          <p class="text-sm text-slate-500 mb-6">数据来源：康乐及文化事务署辖下场地内公共单车泊位</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载公共单车泊位数据...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadBikeParkingData"
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
              <div class="text-sm text-slate-500">泊位总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-green-600">{{ totalLocations }}</div>
              <div class="text-sm text-slate-500">地点总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-purple-600">{{ districtCount }}</div>
              <div class="text-sm text-slate-500">覆盖地区</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-orange-600">{{ Math.round(averageSpaces) }}</div>
              <div class="text-sm text-slate-500">平均泊位数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-sky-600">{{ largestLocation.spaces }}</div>
              <div class="text-sm text-slate-500">最大泊位数</div>
            </div>
          </div>

          <!-- Map View -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">公共单车泊位分布地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图显示筛选后的单车泊位标记</p>
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
                    @focus="showSuggestions" @blur="hideLocationSuggestions" placeholder="搜索地点（显示周围2公里内的单车泊位）..."
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
                  正在显示 <span class="font-medium">{{ locationSearchQuery }}</span> 周围 2 公里内的 {{ nearbyBikeParkings.length
                  }} 个单车泊位
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
                <n-input v-model:value="searchQuery" clearable placeholder="搜索地点名称或地址..." />
              </div>
              <div class="w-full sm:w-56">
                <n-select v-model:value="selectedDistrict" :options="districtOptions" clearable placeholder="全部地区" />
              </div>
            </div>
          </div>

          <!-- Bike Parking List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="parking in nearbyBikeParkings" :key="parking.GmlID"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">

              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ parking.Name_cn || parking.Name_en }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ parking.Address_cn || parking.Address_en }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ parking.District_cn || parking.District_en }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span
                      class="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-1">
                      {{ parking.No_of_parking_spaces_cn || parking.No_of_parking_spaces_en }} 个泊位
                    </span>
                    <div class="text-xs text-slate-500">康乐署管理</div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-2xl font-semibold text-blue-600">{{ parking.No_of_parking_spaces_cn || parking.No_of_parking_spaces_en }}</div>
                    <div class="text-xs text-slate-500">停车泊位</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-green-600">
                      {{ parking.Name_cn && parking.Name_cn.includes('繳費') || 
                           parking.Name_en && parking.Name_en.includes('charge') ? '收费' : '免费' }}
                    </div>
                    <div class="text-xs text-slate-500">泊位类型</div>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      ID: {{ parking.GmlID.split('.')[1] }}
                    </span>
                    <span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md font-medium">
                      公共单车停放
                    </span>
                    <span v-if="parking.Name_cn && parking.Name_cn.includes('繳費')" 
                      class="px-2 py-1 bg-amber-100 text-amber-600 text-xs rounded-md font-medium">
                      收费泊位
                    </span>
                    <span v-else class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-medium">
                      免费泊位
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <button @click="viewOnMap(parking)"
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
          <div v-if="nearbyBikeParkings.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-bicycle text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">
              {{ selectedLocation ? '该地点周围2公里内未找到单车泊位' : '未找到匹配的单车泊位' }}
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
const bikeParkings = ref([])
const searchQuery = ref('')
const selectedDistrict = ref('')

// 数据加载函数
const loadBikeParkingData = async () => {
  loading.value = true
  error.value = ''

  try {
    const url = 'https://portal.csdi.gov.hk/server/services/common/lcsd_rcd_1700484367321_53237/MapServer/WFSServer?service=wfs&request=GetFeature&typenames=geotagging&outputFormat=geojson'
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to load bike parking data')
    }
    const data = await response.json()
    bikeParkings.value = data.features.map(feature => ({
      ...feature.properties,
      coordinates: feature.geometry.coordinates
    }))
  } catch (err) {
    error.value = '加载公共单车泊位数据失败，请稍后重试'
    console.error('Error loading bike parking data:', err)
  } finally {
    loading.value = false
  }
}

// 统计数据
const totalSpaces = computed(() => {
  return bikeParkings.value.reduce((sum, parking) => {
    return sum + parseInt(parking.No_of_parking_spaces_cn || parking.No_of_parking_spaces_en || 0)
  }, 0)
})

const totalLocations = computed(() => bikeParkings.value.length)

const districtCount = computed(() => {
  return new Set(bikeParkings.value.map(parking => parking.District_cn || parking.District_en)).size
})

const averageSpaces = computed(() => {
  if (bikeParkings.value.length === 0) return 0
  return totalSpaces.value / bikeParkings.value.length
})

const largestLocation = computed(() => {
  if (bikeParkings.value.length === 0) return { spaces: 0, name: '' }
  const largest = bikeParkings.value.reduce((max, parking) => {
    const spaces = parseInt(parking.No_of_parking_spaces_cn || parking.No_of_parking_spaces_en || 0)
    return spaces > max.spaces ? { spaces, name: parking.Name_cn || parking.Name_en } : max
  }, { spaces: 0, name: '' })
  return largest
})

const districts = computed(() => {
  return [...new Set(bikeParkings.value.map(parking => parking.District_cn || parking.District_en))].sort()
})

const districtOptions = computed(() => districts.value.map(d => ({ label: d, value: d })))

// 更新地图中心点和标记
const mapCenter = computed(() => {
  if (selectedLocation.value) {
    return selectedLocation.value
  }
  const first = nearbyBikeParkings.value[0]
  if (first && first.Latitude && first.Longitude) {
    return { lat: Number(first.Latitude), lng: Number(first.Longitude) }
  }
  return { lat: 22.3027, lng: 114.1772 } // 香港中心点
})

const mapMarkers = computed(() => {
  const markers = nearbyBikeParkings.value
    .filter(p => p.Latitude && p.Longitude)
    .map(p => ({
      lat: Number(p.Latitude),
      lng: Number(p.Longitude),
      title: `${p.Name_cn || p.Name_en} - ${p.No_of_parking_spaces_cn || p.No_of_parking_spaces_en}个泊位`,
      // 单车泊位使用绿色单车图标
      icon: 'https://maps.google.com/mapfiles/ms/icons/cycling.png'
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

// 计算指定位置周围的单车泊位
const nearbyBikeParkings = computed(() => {
  // 先应用原有的筛选条件
  let filtered = bikeParkings.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(parking =>
      (parking.Name_cn || parking.Name_en || '').toLowerCase().includes(query) ||
      (parking.Address_cn || parking.Address_en || '').toLowerCase().includes(query)
    )
  }

  if (selectedDistrict.value) {
    filtered = filtered.filter(parking => 
      (parking.District_cn || parking.District_en) === selectedDistrict.value
    )
  }

  // 如果没有选中地点，返回所有筛选后的结果
  if (!selectedLocation.value) {
    return filtered
  }

  // 如果有选中地点，再按距离筛选
  const { lat: targetLat, lng: targetLng } = selectedLocation.value

  return filtered.filter(parking => {
    const parkingLat = Number(parking.Latitude)
    const parkingLng = Number(parking.Longitude)

    if (!parkingLat || !parkingLng) return false

    const distance = calculateDistance(targetLat, targetLng, parkingLat, parkingLng)
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

const viewOnMap = (parking) => {
  const lat = Number(parking.Latitude)
  const lng = Number(parking.Longitude)
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  window.open(url, '_blank')
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDistrict.value = ''
  locationSearchQuery.value = ''
  selectedLocation.value = null
}

// 生命周期
onMounted(async () => {
  await loadBikeParkingData()
  await initAMap()
})
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>