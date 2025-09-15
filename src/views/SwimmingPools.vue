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
              香港泳池信息
            </span>
          </h1>
          <p class="text-lg text-slate-600 mb-6">查看康文署泳池位置与开放信息</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载泳池数据...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadPools"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Statistics -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ pools.length }}</div>
              <div class="text-sm text-slate-500">泳池总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ districts.length }}</div>
              <div class="text-sm text-slate-500">覆盖地区</div>
            </div>
          </div>

          <!-- Map View (Google Maps) -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">泳池分布地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图显示筛选后的泳池标记</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <!-- Filters (Naive UI) -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索泳池名称或地址..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedDistrict" :options="districtOptions" clearable placeholder="全部地区" />
            </div>
          </div>

          <!-- Pools List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="pool in filteredPools" :key="pool.id"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">

              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ pool.nameTC || pool.nameEN }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ pool.nameEN }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ pool.districtTC }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">
                      {{ pool.facilityTypeTC || '泳池' }}
                    </span>
                  </div>
                </div>

                <div class="mb-4">
                  <p class="text-sm text-slate-600 mb-2">
                    <i class="fa fa-home mr-2"></i>
                    {{ pool.addressTC || pool.addressEN }}
                  </p>
                  <div v-if="pool.telephone" class="text-sm text-slate-600 mb-1">
                    <i class="fa fa-phone mr-2"></i>
                    {{ pool.telephone }}
                  </div>
                  <div v-if="pool.website" class="text-sm text-slate-600">
                    <i class="fa fa-globe mr-2"></i>
                    <a :href="pool.website" target="_blank" class="text-blue-600 hover:text-blue-800">{{ pool.website }}</a>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-lg font-semibold text-blue-600">{{ formatCoord(pool.lat) }}</div>
                    <div class="text-xs text-slate-500">纬度</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-purple-600">{{ formatCoord(pool.lng) }}</div>
                    <div class="text-xs text-slate-500">经度</div>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span v-if="pool.openingHours" class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-medium">
                      开放时间：{{ pool.openingHours }}
                    </span>
                    <span v-if="pool.lastUpdate" class="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-md font-medium">
                      更新：{{ pool.lastUpdate }}
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <button @click="viewOnMap(pool)"
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
          <div v-if="filteredPools.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的泳池</h3>
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

const loading = ref(true)
const error = ref('')
const pools = ref([])
const searchQuery = ref('')
const selectedDistrict = ref('')

const ENDPOINT = 'https://portal.csdi.gov.hk/server/services/common/lcsd_rcd_1634540558875_77434/MapServer/WFSServer?service=wfs&request=GetFeature&typenames=SP&outputFormat=geojson'

const loadPools = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(ENDPOINT)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const feats = Array.isArray(data.features) ? data.features : []

    pools.value = feats.map((f, idx) => {
      const p = f.properties || {}
      const coords = f.geometry?.coordinates || []
      // coordinates are [lng, lat]
      const lng = Number(coords[0])
      const lat = Number(coords[1])
      const tel = normalizeNA(p.TelephoneTC) || normalizeNA(p.TelephoneEN)
      const site = normalizeNA(p.WebsiteTC) || normalizeNA(p.WebsiteEN)
      const opening = normalizeNA(p.OpeningHoursTC) || normalizeNA(p.OpeningHoursEN)

      return {
        id: p.GmlID || idx,
        nameEN: p.NameEN || '',
        nameTC: p.NameTC || '',
        addressEN: p.AddressEN || '',
        addressTC: p.AddressTC || '',
        districtEN: p.DistrictEN || '',
        districtTC: p.DistrictTC || '',
        facilityTypeEN: p.FacilityTypeEN || '',
        facilityTypeTC: p.FacilityTypeTC || '',
        openingHours: opening || '',
        telephone: tel || '',
        website: site || '',
        lastUpdate: p.LASTUPDATE || '',
        lat: isFinite(lat) ? lat : Number(p.LATITUDE),
        lng: isFinite(lng) ? lng : Number(p.LONGITUDE)
      }
    }).filter(item => item.lat && item.lng && (item.nameTC || item.nameEN))
  } catch (err) {
    console.error('Error loading swimming pools:', err)
    error.value = '加载泳池数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const normalizeNA = (v) => {
  if (!v) return ''
  const s = String(v).trim()
  if (!s || s.toUpperCase() === 'N.A.' || s.toUpperCase() === 'NA') return ''
  return s
}

const filteredPools = computed(() => {
  let list = pools.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      (p.nameTC || '').toLowerCase().includes(q) ||
      (p.nameEN || '').toLowerCase().includes(q) ||
      (p.addressTC || '').toLowerCase().includes(q) ||
      (p.addressEN || '').toLowerCase().includes(q)
    )
  }

  if (selectedDistrict.value) {
    list = list.filter(p => p.districtTC === selectedDistrict.value)
  }
  return list
})

const districts = computed(() => {
  return [...new Set(pools.value.map(p => p.districtTC).filter(Boolean))].sort()
})
const districtOptions = computed(() => districts.value.map(d => ({ label: d, value: d })))

const viewOnMap = (pool) => {
  const lat = Number(pool.lat)
  const lng = Number(pool.lng)
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  window.open(url, '_blank')
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDistrict.value = ''
}

onMounted(() => {
  loadPools()
})

// Map helpers
const mapCenter = computed(() => {
  const first = filteredPools.value[0]
  if (first && first.lat && first.lng) {
    return { lat: Number(first.lat), lng: Number(first.lng) }
  }
  return { lat: 22.3027, lng: 114.1772 }
})

const mapMarkers = computed(() =>
  filteredPools.value
    .filter(p => p.lat && p.lng)
    .map(p => ({ lat: Number(p.lat), lng: Number(p.lng), title: p.nameTC || p.nameEN }))
)

const formatCoord = (v) => {
  if (typeof v !== 'number' && typeof v !== 'string') return '—'
  const n = Number(v)
  if (!isFinite(n)) return '—'
  return n.toFixed(4)
}
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>

