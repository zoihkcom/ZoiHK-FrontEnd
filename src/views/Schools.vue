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
              香港学校信息
            </span>
          </h1>
          <p class="text-lg text-slate-600 mb-6">查看香港各区学校分布情况</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载学校数据...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadSchoolData"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Statistics -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ schools.length }}</div>
              <div class="text-sm text-slate-500">学校总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ districts.length }}</div>
              <div class="text-sm text-slate-500">覆盖地区</div>
            </div>
          </div>

          <!-- Map View (Google Maps) -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">学校分布地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图显示筛选后的学校标记</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <!-- Filters (Naive UI) -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索学校名称或地址..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedDistrict" :options="districtOptions" clearable placeholder="全部地区" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedType" :options="venueTypeOptions" clearable placeholder="全部类型" />
            </div>
          </div>

          <!-- Schools List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="school in filteredSchools" :key="school['SCHOOL NO.']"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">
              
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ school['中文名稱'] }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ school['ENGLISH NAME'] }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ school['分區'] }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {{ school['中文類別'] }}
                    </span>
                  </div>
                </div>

                <div class="mb-4">
                  <p class="text-sm text-slate-600 mb-2">
                    <i class="fa fa-home mr-2"></i>
                    {{ school['中文地址'] }}
                  </p>
                  <div v-if="school.TELEPHONE" class="text-sm text-slate-600 mb-1">
                    <i class="fa fa-phone mr-2"></i>
                    {{ school.TELEPHONE }}
                  </div>
                  <div v-if="school.WEBSITE" class="text-sm text-slate-600">
                    <i class="fa fa-globe mr-2"></i>
                    <a :href="school.WEBSITE" target="_blank" class="text-blue-600 hover:text-blue-800">{{ school.WEBSITE }}</a>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-lg font-semibold text-blue-600">{{ parseFloat(school.LATITUDE).toFixed(4) }}</div>
                    <div class="text-xs text-slate-500">纬度</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-purple-600">{{ parseFloat(school.LONGITUDE).toFixed(4) }}</div>
                    <div class="text-xs text-slate-500">经度</div>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      {{ school['學校類型'] || school['SCHOOL LEVEL'] }}
                    </span>
                    <span v-if="school['就讀學生性別']" class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-medium">
                      {{ school['就讀學生性別'] }}
                    </span>
                    <span v-if="school['學校授課時間']" class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md font-medium">
                      {{ school['學校授課時間'] }}
                    </span>
                    <span v-if="school['宗教']" class="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-md font-medium">
                      {{ school['宗教'] }}
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <button @click="viewOnMap(school)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <i class="fa fa-map mr-2"></i>
                      地图查看
                    </button>
                    <button v-if="school.TELEPHONE" @click="callSupport(school.TELEPHONE)"
                      class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                      <i class="fa fa-phone"></i>
                    </button>
                    <button v-if="school.WEBSITE" @click="openWebsite(school.WEBSITE)"
                      class="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
                      <i class="fa fa-globe"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredSchools.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的学校</h3>
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
// 本地加载数据，无需后端代理

const loading = ref(true)
const error = ref('')
const schools = ref([])
const searchQuery = ref('')
const selectedDistrict = ref('')
const selectedType = ref('')

const loadSchoolData = async () => {
  loading.value = true
  error.value = ''

  try {
    // 从 public 目录加载静态 JSON（不走后端代理）
    const res = await fetch('/schools.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    schools.value = data.filter(item =>
      item['ENGLISH NAME'] && item['中文名稱'] && item.LONGITUDE && item.LATITUDE
    )
  } catch (err) {
    error.value = '加载学校数据失败，请稍后重试'
    console.error('Error loading school data:', err)
  } finally {
    loading.value = false
  }
}

const filteredSchools = computed(() => {
  let filtered = schools.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(school =>
      school['中文名稱'].toLowerCase().includes(query) ||
      school['ENGLISH NAME'].toLowerCase().includes(query) ||
      school['中文地址'].toLowerCase().includes(query) ||
      school['ENGLISH ADDRESS'].toLowerCase().includes(query)
    )
  }

  if (selectedDistrict.value) {
    filtered = filtered.filter(school => school['分區'] === selectedDistrict.value)
  }

  if (selectedType.value) {
    filtered = filtered.filter(school => school['中文類別'] === selectedType.value)
  }

  return filtered
})

const districts = computed(() => {
  return [...new Set(schools.value.map(school => school['分區']))].sort()
})

const venueTypes = computed(() => {
  return [...new Set(schools.value.map(school => school['中文類別']))].sort()
})

const districtOptions = computed(() => districts.value.map(d => ({ label: d, value: d })))
const venueTypeOptions = computed(() => venueTypes.value.map(t => ({ label: t, value: t })))

const universityCount = computed(() => {
  return schools.value.filter(school => 
    school['中文類別'] && (school['中文類別'].includes('大學') || school['中文類別'].includes('專上'))
  ).length
})

const totalHotspots = computed(() => {
  return schools.value.reduce((sum, school) => sum + parseInt(school.NumberOfHotspots || 0), 0)
})

const viewOnMap = (school) => {
  const lat = Number(school.LATITUDE)
  const lng = Number(school.LONGITUDE)
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  window.open(url, '_blank')
}

const callSupport = (phone) => {
  window.open(`tel:${phone}`)
}

const openWebsite = (website) => {
  if (website && website.startsWith('http')) {
    window.open(website, '_blank')
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDistrict.value = ''
  selectedType.value = ''
}

onMounted(() => {
  loadSchoolData()
})

// Map data derived from filtered schools
const mapCenter = computed(() => {
  const first = filteredSchools.value[0]
  if (first && first.LATITUDE && first.LONGITUDE) {
    return { lat: Number(first.LATITUDE), lng: Number(first.LONGITUDE) }
  }
  return { lat: 22.3027, lng: 114.1772 }
})

const mapMarkers = computed(() =>
  filteredSchools.value
    .filter(s => s.LATITUDE && s.LONGITUDE)
    .map(s => ({
      lat: Number(s.LATITUDE),
      lng: Number(s.LONGITUDE),
      title: s['中文名稱'] || s['ENGLISH NAME']
    }))
)
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
