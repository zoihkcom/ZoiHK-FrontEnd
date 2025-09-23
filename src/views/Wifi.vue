<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Main Content -->
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center space-y-3 mb-8">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong WiFi</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">香港WiFi热点信息</h1>
          <p class="text-base sm:text-lg text-slate-600">查看香港各区WiFi热点分布情况</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载WiFi热点数据...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadWifiData"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Statistics -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ wifiHotspots.length }}</div>
              <div class="text-sm text-slate-500">热点总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-green-600">{{ totalHotspots }}</div>
              <div class="text-sm text-slate-500">WiFi热点数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ districts.length }}</div>
              <div class="text-sm text-slate-500">覆盖地区</div>
            </div>
          </div>

          <!-- Map View (Google Maps) -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">WiFi热点分布地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图显示筛选后的热点标记</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <!-- Filters (Naive UI) -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索机构名称或地址..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedDistrict" :options="districtOptions" clearable placeholder="全部地区" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedType" :options="venueTypeOptions" clearable placeholder="全部类型" />
            </div>
          </div>

          <!-- WiFi Hotspots List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="hotspot in filteredHotspots" :key="hotspot.LocationID"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">
              
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ hotspot.LocationNameTC }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ hotspot.LocationNameEN }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ hotspot.DistrictTC }}, {{ hotspot.AreaTC }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {{ hotspot.VenueTypeTC }}
                    </span>
                  </div>
                </div>

                <div class="mb-4">
                  <p class="text-sm text-slate-600 mb-2">
                    <i class="fa fa-home mr-2"></i>
                    {{ hotspot.AddressTC }}
                  </p>
                  <div v-if="hotspot.SupportHotline" class="text-sm text-slate-600 mb-1">
                    <i class="fa fa-phone mr-2"></i>
                    {{ hotspot.SupportHotline }}
                  </div>
                  <div v-if="hotspot.SupportEmail" class="text-sm text-slate-600">
                    <i class="fa fa-envelope mr-2"></i>
                    {{ hotspot.SupportEmail }}
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-lg font-semibold text-green-600">{{ hotspot.NumberOfHotspots }}</div>
                    <div class="text-xs text-slate-500">WiFi热点</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-blue-600">{{ parseFloat(hotspot.Latitude).toFixed(4) }}</div>
                    <div class="text-xs text-slate-500">纬度</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-purple-600">{{ parseFloat(hotspot.Longitude).toFixed(4) }}</div>
                    <div class="text-xs text-slate-500">经度</div>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      {{ hotspot.SSID }}
                    </span>
                    <span v-if="hotspot.SupportHotline" class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-medium">
                      <i class="fa fa-phone mr-1"></i>
                      支持热线
                    </span>
                    <span v-if="hotspot.SupportEmail" class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md font-medium">
                      <i class="fa fa-envelope mr-1"></i>
                      邮件支持
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <button @click="viewOnMap(hotspot)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <i class="fa fa-map mr-2"></i>
                      地图查看
                    </button>
                    <button v-if="hotspot.SupportHotline" @click="callSupport(hotspot.SupportHotline)"
                      class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                      <i class="fa fa-phone"></i>
                    </button>
                    <button v-if="hotspot.SupportEmail" @click="emailSupport(hotspot.SupportEmail)"
                      class="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                      <i class="fa fa-envelope"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredHotspots.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的WiFi热点</h3>
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
import GoogleMap from '@/components/GoogleMap.vue'
import request from '@/api/request.js'

const loading = ref(true)
const error = ref('')
const wifiHotspots = ref([])
const searchQuery = ref('')
const selectedDistrict = ref('')
const selectedType = ref('')

const loadWifiData = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await request.get('/wifi')
    const data = response.data
    wifiHotspots.value = data.filter(item => 
      item.LocationNameTC && item.Latitude && item.Longitude
    )
  } catch (err) {
    error.value = '加载WiFi热点数据失败，请稍后重试'
    console.error('Error loading WiFi data:', err)
  } finally {
    loading.value = false
  }
}

const filteredHotspots = computed(() => {
  let filtered = wifiHotspots.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(hotspot =>
      hotspot.LocationNameTC.toLowerCase().includes(query) ||
      hotspot.LocationNameEN.toLowerCase().includes(query) ||
      hotspot.AddressTC.toLowerCase().includes(query)
    )
  }

  if (selectedDistrict.value) {
    filtered = filtered.filter(hotspot => hotspot.DistrictTC === selectedDistrict.value)
  }

  if (selectedType.value) {
    filtered = filtered.filter(hotspot => hotspot.VenueTypeTC === selectedType.value)
  }

  return filtered
})

const districts = computed(() => {
  return [...new Set(wifiHotspots.value.map(hotspot => hotspot.DistrictTC))].sort()
})

const venueTypes = computed(() => {
  return [...new Set(wifiHotspots.value.map(hotspot => hotspot.VenueTypeTC))].sort()
})

const districtOptions = computed(() => districts.value.map(d => ({ label: d, value: d })))
const venueTypeOptions = computed(() => venueTypes.value.map(t => ({ label: t, value: t })))

const totalHotspots = computed(() => {
  return wifiHotspots.value.reduce((sum, hotspot) => sum + parseInt(hotspot.NumberOfHotspots || 0), 0)
})

const viewOnMap = (hotspot) => {
  const lat = Number(hotspot.Latitude)
  const lng = Number(hotspot.Longitude)
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  window.open(url, '_blank')
}

const callSupport = (phone) => {
  window.open(`tel:${phone}`)
}

const emailSupport = (email) => {
  window.open(`mailto:${email}`)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDistrict.value = ''
  selectedType.value = ''
}

onMounted(() => {
  loadWifiData()
})

// Map data
const mapCenter = computed(() => {
  const first = filteredHotspots.value[0]
  if (first && first.Latitude && first.Longitude) {
    return { lat: Number(first.Latitude), lng: Number(first.Longitude) }
  }
  return { lat: 22.3027, lng: 114.1772 }
})

const mapMarkers = computed(() =>
  filteredHotspots.value
    .filter(h => h.Latitude && h.Longitude)
    .map(h => ({ lat: Number(h.Latitude), lng: Number(h.Longitude), title: h.LocationNameTC || h.LocationNameEN }))
)
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
