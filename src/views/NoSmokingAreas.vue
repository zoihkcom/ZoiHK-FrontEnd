<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    <div class="pt-24 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-3 mb-8">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong No Smoking</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">公共交通设施/巴士转乘站法定禁烟区</h1>
          <p class="text-base sm:text-lg text-slate-600">Public Transport Facilities / Bus Interchanges - Statutory No Smoking Areas</p>
          <p class="text-sm text-slate-500">数据来源：卫生署控烟酒办公室 (Tobacco and Alcohol Control Office, Department of Health)</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span class="ml-3 text-lg text-gray-600">载入禁烟区数据...</span>
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
          <button @click="loadNoSmokingAreas"
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            重新载入
          </button>
        </div>

        <!-- Main Content -->
        <div v-if="!loading && !error">
          <!-- Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-red-50 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-red-600">{{ totalAreas }}</div>
              <div class="text-gray-600 mt-1">禁烟区域总数</div>
            </div>
            <div class="bg-blue-50 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-blue-600">{{ uniqueDistricts.length }}</div>
              <div class="text-gray-600 mt-1">覆盖区域</div>
            </div>
            <div class="bg-green-50 rounded-lg p-6 text-center">
              <div class="text-3xl font-bold text-green-600">{{ transportFacilities }}</div>
              <div class="text-gray-600 mt-1">公共运输设施</div>
            </div>
          </div>

          <!-- Controls -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">搜索区域</label>
                <input v-model="searchQuery" type="text" placeholder="按名称或地区搜索..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">地区筛选</label>
                <select v-model="selectedDistrict" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">所有地区</option>
                  <option v-for="district in uniqueDistricts" :key="district" :value="district">
                    {{ district }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">设施类型</label>
                <select v-model="selectedUsageType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">所有类型</option>
                  <option v-for="type in uniqueUsageTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Map Container -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div class="px-6 py-4 bg-red-50 border-b">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold text-gray-900">禁烟区域地图</h2>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center text-sm text-gray-600">
                    <div class="w-4 h-4 bg-red-500 rounded mr-2 opacity-70"></div>
                    禁烟区域
                  </div>
                  <button @click="resetMapView"
                    class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                    重置视图
                  </button>
                </div>
              </div>
            </div>
            <div class="relative">
              <GoogleMap
                :center="mapCenter"
                :zoom="mapZoom"
                :polygons="mapPolygons"
                :fit-polygons-bounds="true"
                @polygon-click="onPolygonClick"
                @ready="onMapReady"
                @error="onMapError"
                class="h-96 md:h-[600px]"
              />
            </div>
          </div>

          <!-- Areas List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="area in filteredAreas" :key="area.properties.OBJECTID" 
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 cursor-pointer"
              @click="focusOnArea(area)">
              
              <div class="p-6">
                <!-- Card Header -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ area.properties.CNAME }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ area.properties.ENAME }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ area.properties.DISTRICT_C }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      禁烟区域
                    </span>
                  </div>
                </div>

                <!-- Address and Details -->
                <div class="mb-4">
                  <div class="text-sm text-slate-600 mb-2">
                    <i class="fa fa-building mr-2"></i>
                    {{ area.properties.USAGETYPE_C }}
                  </div>
                  <div v-if="area.properties.STRUCTURETYPE_C" class="text-sm text-slate-600 mb-1">
                    <i class="fa fa-cube mr-2"></i>
                    {{ area.properties.STRUCTURETYPE_C }}
                  </div>
                  <div v-if="area.properties.NSA_ID" class="text-sm text-slate-600">
                    <i class="fa fa-tag mr-2"></i>
                    {{ area.properties.NSA_ID }}
                  </div>
                </div>

                <!-- Remarks -->
                <div v-if="area.properties.REMARKS_C" class="mb-4">
                  <div class="bg-yellow-50 rounded-lg p-3">
                    <div class="flex items-start">
                      <i class="fa fa-info-circle text-yellow-500 text-sm mr-2 mt-0.5"></i>
                      <span class="text-sm text-yellow-800">{{ area.properties.REMARKS_C }}</span>
                    </div>
                  </div>
                </div>

                <!-- Statistics -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-lg font-semibold text-red-600">{{ Math.round(area.properties.SHAPE__Area || 0) }}</div>
                    <div class="text-xs text-slate-500">面积 (m²)</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-blue-600">{{ Math.round(area.properties.SHAPE__Length || 0) }}</div>
                    <div class="text-xs text-slate-500">周长 (m)</div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="border-t border-slate-100 pt-4">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      {{ area.properties.DISTRICT_C }}
                    </span>
                    <span class="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-md font-medium">
                      <i class="fa fa-ban mr-1"></i>
                      禁烟区域
                    </span>
                    <span v-if="area.properties.USAGETYPE_C && area.properties.USAGETYPE_C.includes('公共運輸設施')" 
                      class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md font-medium">
                      <i class="fa fa-bus mr-1"></i>
                      公共运输
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <button @click.stop="focusOnArea(area)"
                      class="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                      <i class="fa fa-search mr-2"></i>
                      地图定位
                    </button>
                    <button @click.stop="viewOnGoogleMaps(area)" 
                      class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <i class="fa fa-external-link mr-2"></i>
                      Google Maps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredAreas.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的禁烟区域</h3>
            <p class="text-slate-600 mb-6">请尝试调整搜索条件或筛选器</p>
            <button @click="resetFilters"
              class="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors">
              重置筛选器
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 信息弹窗 -->
    <div v-if="selectedArea" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeAreaInfo">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6" @click.stop>
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-900">禁烟区域详情</h3>
          <button @click="closeAreaInfo" class="text-gray-400 hover:text-gray-600">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="space-y-3">
          <div>
            <h4 class="text-lg font-medium text-gray-900">{{ selectedArea.properties.CNAME }}</h4>
            <p class="text-gray-600 text-sm">{{ selectedArea.properties.ENAME }}</p>
          </div>
          <div class="grid grid-cols-1 gap-3">
            <div>
              <span class="text-sm font-medium text-gray-700">地区:</span>
              <span class="text-sm text-gray-600 ml-2">{{ selectedArea.properties.DISTRICT_C }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-700">设施类型:</span>
              <span class="text-sm text-gray-600 ml-2">{{ selectedArea.properties.USAGETYPE_C }}</span>
            </div>
            <div v-if="selectedArea.properties.STRUCTURETYPE_C">
              <span class="text-sm font-medium text-gray-700">结构类型:</span>
              <span class="text-sm text-gray-600 ml-2">{{ selectedArea.properties.STRUCTURETYPE_C }}</span>
            </div>
            <div v-if="selectedArea.properties.REMARKS_C">
              <span class="text-sm font-medium text-gray-700">备注:</span>
              <span class="text-sm text-gray-600 ml-2">{{ selectedArea.properties.REMARKS_C }}</span>
            </div>
            <div v-if="selectedArea.properties.NSA_ID">
              <span class="text-sm font-medium text-gray-700">编号:</span>
              <span class="text-sm text-gray-600 ml-2">{{ selectedArea.properties.NSA_ID }}</span>
            </div>
          </div>
          <div class="pt-4 border-t">
            <button @click="viewOnGoogleMaps(selectedArea)" 
              class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              <i class="fa fa-external-link mr-2"></i>
              在 Google Maps 中查看
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import GoogleMap from '@/components/GoogleMap.vue'

// 响应式数据
const loading = ref(false)
const error = ref(null)
const noSmokingAreas = ref([])
const searchQuery = ref('')
const selectedDistrict = ref('')
const selectedUsageType = ref('')
const selectedArea = ref(null)

// 地图相关
const mapCenter = ref({ lat: 22.3193, lng: 114.1694 }) // 香港中心
const mapZoom = ref(11)

// 计算属性
const totalAreas = computed(() => noSmokingAreas.value.length)

const uniqueDistricts = computed(() => {
  const districts = noSmokingAreas.value.map(area => area.properties.DISTRICT_C).filter(Boolean)
  return [...new Set(districts)].sort()
})

const uniqueUsageTypes = computed(() => {
  const types = noSmokingAreas.value.map(area => area.properties.USAGETYPE_C).filter(Boolean)
  return [...new Set(types)].sort()
})

const transportFacilities = computed(() => {
  return noSmokingAreas.value.filter(area => 
    area.properties.USAGETYPE_C && area.properties.USAGETYPE_C.includes('公共運輸設施')
  ).length
})

const filteredAreas = computed(() => {
  let filtered = noSmokingAreas.value

  // 按地区筛选
  if (selectedDistrict.value) {
    filtered = filtered.filter(area => area.properties.DISTRICT_C === selectedDistrict.value)
  }

  // 按设施类型筛选
  if (selectedUsageType.value) {
    filtered = filtered.filter(area => area.properties.USAGETYPE_C === selectedUsageType.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(area => 
      area.properties.CNAME?.toLowerCase().includes(query) ||
      area.properties.ENAME?.toLowerCase().includes(query) ||
      area.properties.DISTRICT_C?.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 地图多边形数据
const mapPolygons = computed(() => {
  return filteredAreas.value.map(area => {
    const geometry = area.geometry
    let paths = []

    if (geometry.type === 'Polygon') {
      paths = geometry.coordinates.map(ring => 
        ring.map(coord => ({ lat: coord[1], lng: coord[0] }))
      )
    } else if (geometry.type === 'MultiPolygon') {
      // 对于MultiPolygon，合并所有多边形的坐标
      paths = []
      geometry.coordinates.forEach(polygonCoords => {
        polygonCoords.forEach(ring => {
          paths.push(ring.map(coord => ({ lat: coord[1], lng: coord[0] })))
        })
      })
    }

    return {
      id: area.properties.OBJECTID,
      paths: paths,
      strokeColor: '#DC2626', // red-600
      fillColor: '#DC2626',
      fillOpacity: 0.3,
      strokeWeight: 2,
      strokeOpacity: 0.8,
      data: area
    }
  })
})

// 方法
const loadNoSmokingAreas = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('https://services3.arcgis.com/6j1KwZfY2fZrfNMR/arcgis/rest/services/Public_Transport_Facilities_and_Bus_Interchanges_Designated_as_No_Smoking_Areas_in_HK/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson')
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
      noSmokingAreas.value = data.features
    } else {
      throw new Error('接口返回的数据格式不正确')
    }
  } catch (err) {
    console.error('获取禁烟区数据失败:', err)
    error.value = err.message || '网络连接失败'
  } finally {
    loading.value = false
  }
}

const focusOnArea = (area) => {
  const geometry = area.geometry
  let latSum = 0, lngSum = 0, count = 0

  if (geometry.type === 'Polygon') {
    geometry.coordinates[0].forEach(coord => {
      latSum += coord[1]
      lngSum += coord[0]
      count++
    })
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach(polygon => {
      polygon[0].forEach(coord => {
        latSum += coord[1]
        lngSum += coord[0]
        count++
      })
    })
  }

  if (count > 0) {
    mapCenter.value = {
      lat: latSum / count,
      lng: lngSum / count
    }
    mapZoom.value = 16
  }
}

const getGoogleMapsUrl = (area) => {
  const geometry = area.geometry
  let lat, lng

  if (geometry.type === 'Polygon') {
    const coords = geometry.coordinates[0]
    lat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length
    lng = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length
  } else if (geometry.type === 'MultiPolygon') {
    const coords = geometry.coordinates[0][0]
    lat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length
    lng = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length
  }

  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

const viewOnGoogleMaps = (area) => {
  const url = getGoogleMapsUrl(area)
  window.open(url, '_blank')
}

const resetMapView = () => {
  mapCenter.value = { lat: 22.3193, lng: 114.1694 }
  mapZoom.value = 11
}

const onPolygonClick = (event) => {
  if (event.data) {
    selectedArea.value = event.data
  }
}

const closeAreaInfo = () => {
  selectedArea.value = null
}

const onMapReady = () => {
  console.log('地图已准备就绪')
}

const onMapError = (error) => {
  console.error('地图加载失败:', error)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDistrict.value = ''
  selectedUsageType.value = ''
}

// 生命周期
onMounted(() => {
  loadNoSmokingAreas()
})
</script>

<style scoped>
/* 毛玻璃效果 */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* 文本截断样式 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 卡片hover效果优化 */
.group:hover .group-hover\:text-red-600 {
  color: #dc2626;
}

/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
