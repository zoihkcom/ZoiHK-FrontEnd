<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />

    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center space-y-3 mb-8">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Libraries</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">香港图书馆信息</h1>
          <p class="text-base sm:text-lg text-slate-600">探索康文署辖下固定、流动及自助图书馆分布</p>
          <p v-if="latestUpdate" class="text-sm text-slate-500">数据更新：{{ latestUpdate }}</p>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载图书馆数据...</span>
        </div>

        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadLibraries"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ libraries.length }}</div>
              <div class="text-sm text-slate-500">图书馆总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-emerald-600">{{ districts.length }}</div>
              <div class="text-sm text-slate-500">覆盖地区</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ libraryTypes.length }}</div>
              <div class="text-sm text-slate-500">馆舍类型</div>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">图书馆分布地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图显示筛选后的馆舍位置</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索图书馆名称或地址..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedDistrict" :options="districtOptions" clearable placeholder="全部地区" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedType" :options="typeOptions" clearable placeholder="全部类型" />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="library in filteredLibraries" :key="library.id"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ library.nameTC || library.nameEN }}</h3>
                    <p v-if="library.nameEN" class="text-sm text-slate-600 mb-2">{{ library.nameEN }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ library.districtTC || library.districtEN }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {{ library.typeTC || library.typeEN || '图书馆' }}
                    </span>
                  </div>
                </div>

                <div class="mb-4">
                  <p v-if="library.addressTC || library.addressEN" class="text-sm text-slate-600 mb-2">
                    <i class="fa fa-home mr-2"></i>
                    {{ library.addressTC || library.addressEN }}
                  </p>
                  <div v-if="library.telephone" class="text-sm text-slate-600 mb-1">
                    <i class="fa fa-phone mr-2"></i>
                    {{ library.telephone }}
                  </div>
                  <div v-if="library.email" class="text-sm text-slate-600 mb-1">
                    <i class="fa fa-envelope mr-2"></i>
                    {{ library.email }}
                  </div>
                  <div v-if="library.website" class="text-sm text-slate-600">
                    <i class="fa fa-globe mr-2"></i>
                    <a :href="library.website" target="_blank" rel="noopener"
                      class="text-blue-600 hover:text-blue-800">访问网站</a>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-lg font-semibold text-blue-600">{{ formatCoord(library.lat) }}</div>
                    <div class="text-xs text-slate-500">纬度</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-purple-600">{{ formatCoord(library.lng) }}</div>
                    <div class="text-xs text-slate-500">经度</div>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span v-if="library.openingHours"
                      class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-medium">
                      开放时间：{{ library.openingHours }}
                    </span>
                    <span v-if="library.fax"
                      class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      传真：{{ library.fax }}
                    </span>
                    <span v-if="library.lastUpdate"
                      class="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-md font-medium">
                      更新：{{ library.lastUpdate }}
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <button @click="viewOnMap(library)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <i class="fa fa-map mr-2"></i>
                      地图查看
                    </button>
                    <button v-if="library.telephone" @click="call(library.telephone)"
                      class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                      <i class="fa fa-phone"></i>
                    </button>
                    <button v-if="library.email" @click="email(library.email)"
                      class="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                      <i class="fa fa-envelope"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredLibraries.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的图书馆</h3>
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

const ENDPOINT = 'https://portal.csdi.gov.hk/server/services/common/lcsd_rcd_1629267205214_44807/MapServer/WFSServer?service=wfs&request=GetFeature&typenames=LIBRARY&outputFormat=geojson'

const loading = ref(true)
const error = ref('')
const libraries = ref([])
const searchQuery = ref('')
const selectedDistrict = ref('')
const selectedType = ref('')

const loadLibraries = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(ENDPOINT)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const features = Array.isArray(data.features) ? data.features : []

    libraries.value = features.map((feature, index) => {
      const props = feature.properties || {}
      const coords = feature.geometry?.coordinates || []
      const lng = toNumber(coords[0]) ?? toNumber(props.LONGITUDE)
      const lat = toNumber(coords[1]) ?? toNumber(props.LATITUDE)

      const opening = normalizeValue(props.OpeningHoursTC) || normalizeValue(props.OpeningHoursEN)
      const tel = normalizeValue(props.TelephoneTC) || normalizeValue(props.TelephoneEN)
      const fax = normalizeValue(props.FaxNumberTC) || normalizeValue(props.FaxNumberEN)
      const mail = normalizeValue(props.EmailAddressTC) || normalizeValue(props.EmailAddressEN)
      const site = normalizeUrl(props.WebsiteTC) || normalizeUrl(props.WebsiteEN)

      return {
        id: props.GmlID || props.OBJECTID || index,
        nameEN: props.NameEN || '',
        nameTC: props.NameTC || '',
        addressEN: props.AddressEN || '',
        addressTC: props.AddressTC || '',
        districtEN: props.DistrictEN || '',
        districtTC: props.DistrictTC || '',
        typeEN: props.LibraryTypeEN || '',
        typeTC: props.LibraryTypeTC || '',
        openingHours: opening,
        telephone: tel,
        fax,
        email: mail,
        website: site,
        lastUpdate: props.LASTUPDATE || '',
        lat,
        lng
      }
    }).filter(item => item.lat && item.lng && (item.nameTC || item.nameEN))
  } catch (err) {
    console.error('Error loading library data:', err)
    error.value = '加载图书馆数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const normalizeValue = (value) => {
  if (value === null || value === undefined) return ''
  const str = String(value).trim()
  if (!str) return ''
  const upper = str.toUpperCase()
  if (upper === 'N.A.' || upper === 'N.A' || upper === 'NA' || upper === 'N/A' || upper === 'N\A' || upper === '-') {
    return ''
  }
  return str
}

const normalizeUrl = (value) => {
  const normalized = normalizeValue(value)
  if (!normalized) return ''
  if (/^https?:\/\//i.test(normalized)) return normalized
  return `https://${normalized}`
}

const toNumber = (value) => {
  if (value === null || value === undefined) return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

const filteredLibraries = computed(() => {
  let list = libraries.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(item =>
      (item.nameTC || '').toLowerCase().includes(q) ||
      (item.nameEN || '').toLowerCase().includes(q) ||
      (item.addressTC || '').toLowerCase().includes(q) ||
      (item.addressEN || '').toLowerCase().includes(q)
    )
  }

  if (selectedDistrict.value) {
    list = list.filter(item => item.districtTC === selectedDistrict.value || item.districtEN === selectedDistrict.value)
  }

  if (selectedType.value) {
    list = list.filter(item => item.typeTC === selectedType.value || item.typeEN === selectedType.value)
  }

  return list
})

const districts = computed(() => {
  const set = new Set()
  libraries.value.forEach(item => {
    if (item.districtTC) set.add(item.districtTC)
    else if (item.districtEN) set.add(item.districtEN)
  })
  return Array.from(set).sort()
})

const libraryTypes = computed(() => {
  const set = new Set()
  libraries.value.forEach(item => {
    if (item.typeTC) set.add(item.typeTC)
    else if (item.typeEN) set.add(item.typeEN)
  })
  return Array.from(set).sort()
})

const districtOptions = computed(() => districts.value.map(d => ({ label: d, value: d })))
const typeOptions = computed(() => libraryTypes.value.map(t => ({ label: t, value: t })))

const latestUpdate = computed(() => {
  const validDates = libraries.value
    .map(item => ({ raw: item.lastUpdate, date: item.lastUpdate ? new Date(item.lastUpdate) : null }))
    .filter(entry => entry.date instanceof Date && !Number.isNaN(entry.date.valueOf()))

  if (!validDates.length) return ''

  const latest = validDates.reduce((acc, curr) => (curr.date > acc.date ? curr : acc))
  return latest.date.toLocaleString('zh-HK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const viewOnMap = (library) => {
  const lat = Number(library.lat)
  const lng = Number(library.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  window.open(url, '_blank')
}

const call = (phone) => {
  window.open(`tel:${phone}`)
}

const email = (address) => {
  window.open(`mailto:${address}`)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDistrict.value = ''
  selectedType.value = ''
}

onMounted(() => {
  loadLibraries()
})

const mapCenter = computed(() => {
  return { lat: 22.3027, lng: 114.1772 }
})

const mapMarkers = computed(() =>
  filteredLibraries.value
    .filter(item => item.lat && item.lng)
    .map(item => ({ lat: Number(item.lat), lng: Number(item.lng), title: item.nameTC || item.nameEN }))
)

const formatCoord = (value) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return '—'
  return num.toFixed(4)
}
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
