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
              香港饮水机位置信息
            </span>
          </h1>
          <p class="text-lg text-slate-600 mb-6">查看香港各区饮水机分布情况</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载饮水机数据...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadWaterDispenserData"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Statistics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ totalDispensers }}</div>
              <div class="text-sm text-slate-500">饮水机总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-green-600">{{ lcsdCount }}</div>
              <div class="text-sm text-slate-500">康文署</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-purple-600">{{ fehdCount }}</div>
              <div class="text-sm text-slate-500">食环署</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-orange-600">{{ wsdCount }}</div>
              <div class="text-sm text-slate-500">水务署</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-sky-600">{{ cadCount }}</div>
              <div class="text-sm text-slate-500">民航处</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-emerald-600">{{ afcdCountryCount }}</div>
              <div class="text-sm text-slate-500">郊野公园</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-xl font-bold text-teal-600">{{ afcdMarineCount }}</div>
              <div class="text-sm text-slate-500">海岸公园</div>
            </div>
          </div>

          <!-- Map View (Google Maps) -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">饮水机分布地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图显示筛选后的饮水机标记</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <!-- Filters (Naive UI) -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索设施名称或地址..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedCategory" :options="categoryOptions" clearable placeholder="全部分类" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedRegion" :options="regionOptions" clearable placeholder="全部地区" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedType" :options="typeOptions" clearable placeholder="全部类型" />
            </div>
          </div>

          <!-- Water Dispensers List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="dispenser in filteredDispensers" :key="dispenser.id"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">

              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ dispenser.name }}</h3>
                    <p class="text-sm text-slate-600 mb-2">{{ dispenser.address }}</p>
                    <div class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ dispenser.district }} - {{ dispenser.region }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span
                      class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-1">
                      {{ dispenser.category }}
                    </span>
                    <div class="text-xs text-slate-500">{{ dispenser.source }}</div>
                  </div>
                </div>

                <div class="mb-4">
                  <p class="text-sm text-slate-600 mb-2">
                    <i class="fa fa-location-arrow mr-2"></i>
                    {{ dispenser.location }}
                  </p>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-4">
                  <div class="text-center">
                    <div class="text-lg font-semibold text-green-600">{{ dispenser.count }}</div>
                    <div class="text-xs text-slate-500">饮水机数量</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-blue-600">{{ parseFloat(dispenser.latitude).toFixed(4) }}
                    </div>
                    <div class="text-xs text-slate-500">纬度</div>
                  </div>
                  <div class="text-center">
                    <div class="text-lg font-semibold text-purple-600">{{ parseFloat(dispenser.longitude).toFixed(4) }}
                    </div>
                    <div class="text-xs text-slate-500">经度</div>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                      {{ dispenser.type }}
                    </span>
                    <span v-if="dispenser.temperature"
                      class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md font-medium">
                      {{ dispenser.temperature }}
                    </span>
                    <span v-if="dispenser.location_type"
                      class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-medium">
                      {{ dispenser.location_type }}
                    </span>
                    <span v-if="dispenser.service_hours"
                      class="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-md font-medium">
                      {{ dispenser.service_hours }}
                    </span>
                    <span v-if="dispenser.service_exception"
                      class="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-md font-medium">
                      {{ dispenser.service_exception }}
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <button @click="viewOnMap(dispenser)"
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
          <div v-if="filteredDispensers.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的饮水机</h3>
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
const waterDispensers = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedRegion = ref('')
const selectedType = ref('')

// 数据加载函数
const loadWaterDispenserData = async () => {
  loading.value = true
  error.value = ''

  try {
    const [lcsdData, fehdData, wsdData, cadData, afcdCountryData, afcdMarineData] = await Promise.all([
      fetchLCSDData(),
      fetchFEHDData(),
      fetchWSDData(),
      fetchCADData(),
      fetchAFCDCountryData(),
      fetchAFCDMarineData()
    ])

    waterDispensers.value = [...lcsdData, ...fehdData, ...wsdData, ...cadData, ...afcdCountryData, ...afcdMarineData]
  } catch (err) {
    error.value = '加载饮水机数据失败，请稍后重试'
    console.error('Error loading water dispenser data:', err)
  } finally {
    loading.value = false
  }
}

// 康乐及文化事务署数据获取
const fetchLCSDData = async () => {
  try {
    const url = 'https://portal.csdi.gov.hk/server/services/common/lcsd_rcd_1671530248519_33416/MapServer/WFSServer?service=wfs&request=GetFeature&typenames=geotagging&outputFormat=geojson'
    const response = await fetch(url)
    const data = await response.json()

    return data.features.map(feature => ({
      id: `lcsd_${feature.properties.GmlID}`,
      source: '康乐及文化事务署',
      category: '康文署',
      name: feature.properties.Name_of_Building_or_Facility_TC || feature.properties.Name_of_Building_or_Facility_EN,
      address: feature.properties.Street_TC || feature.properties.Street_EN,
      district: feature.properties.District_TC || feature.properties.District_EN,
      region: feature.properties.Region_TC || feature.properties.Region_EN,
      location: feature.properties.Location_TC || feature.properties.Location_EN,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      count: parseInt(feature.properties.Number_of_Water_Dispenser) || 1,
      type: feature.properties.Type_of_Water_Dispenser_TC || feature.properties.Type_of_Water_Dispenser_EN,
      temperature: feature.properties.Water_Temperature_TC || feature.properties.Water_Temperature_EN,
      location_type: feature.properties.Indoor_Outdoor_TC || feature.properties.Indoor_Outdoor_EN,
      service_hours: `${feature.properties.Service_Hours_From}-${feature.properties.Service_Hours_To}`
    }))
  } catch (err) {
    console.error('Error fetching LCSD data:', err)
    return []
  }
}

// 食物环境卫生署数据获取
const fetchFEHDData = async () => {
  try {
    const url = 'https://portal.csdi.gov.hk/server/services/common/fehd_rcd_1629969846020_11292/MapServer/WFSServer?service=wfs&request=GetFeature&typenames=FEHD_WDPM&outputFormat=geojson'
    const response = await fetch(url)
    const data = await response.json()

    return data.features.map(feature => ({
      id: `fehd_${feature.properties.GmlID}`,
      source: '食物环境卫生署',
      category: '食环署',
      name: feature.properties.NAME_TC || feature.properties.NAME_EN,
      address: feature.properties.ADDRESS_TC || feature.properties.ADDRESS_EN,
      district: feature.properties.SEARCH02_TC || feature.properties.SEARCH02_EN,
      region: feature.properties.SEARCH01_TC || feature.properties.SEARCH01_EN,
      location: feature.properties.NSEARCH01_TC || feature.properties.NSEARCH01_EN,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      count: parseInt(feature.properties.NSEARCH02_TC) || 1,
      type: feature.properties.SEARCH03_TC || feature.properties.SEARCH03_EN,
      temperature: '常温',
      location_type: '室内',
      service_hours: `${feature.properties.NSEARCH03_TC || '06:00'}-${feature.properties.NSEARCH04_TC || '20:00'}`
    }))
  } catch (err) {
    console.error('Error fetching FEHD data:', err)
    return []
  }
}

// 水务署数据获取
const fetchWSDData = async () => {
  try {
    const url = 'https://portal.csdi.gov.hk/server/services/common/wsd_rcd_1665992255383_47502/MapServer/WFSServer?service=wfs&request=GetFeature&typenames=Water_Dispensers_in_WSD_Venues&outputFormat=geojson'
    const response = await fetch(url)
    const data = await response.json()

    return data.features.map(feature => ({
      id: `wsd_${feature.properties.GmlID}`,
      source: '水务署',
      category: '水务署',
      name: feature.properties.NAME_CHINESE || feature.properties.NAME,
      address: feature.properties.ADDRESS_C || feature.properties.ADDRESS_E,
      district: feature.properties.DISTRICT?.split(' / ')[1] || feature.properties.DISTRICT?.split(' / ')[0],
      region: feature.properties.REGION === 'NT' ? '新界' : feature.properties.REGION === 'HK' ? '香港岛' : '九龙',
      location: feature.properties.LOCATION_C || feature.properties.LOCATION_E,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      count: parseInt(feature.properties.NO_WD) || 1,
      type: feature.properties.TYPE_DISPENSER === 'NF' ? '直饮式' : '其他',
      temperature: feature.properties.WATER_TEMP === 'A' ? '常温' : '冷水',
      location_type: feature.properties.PLACE === 'IN' ? '室内' : '室外',
      service_hours: `${feature.properties.HR_FROM} - ${feature.properties.HR_TO}`
    }))
  } catch (err) {
    console.error('Error fetching WSD data:', err)
    return []
  }
}

// 民航处数据获取
const fetchCADData = async () => {
  try {
    const url = 'https://portal.csdi.gov.hk/server/services/common/cad_rcd_1669714722848_98043/MapServer/WFSServer?service=wfs&request=GetFeature&typenames=geotagging&outputFormat=geojson'
    const response = await fetch(url)
    const data = await response.json()

    return data.features.map(feature => ({
      id: `cad_${feature.properties.GmlID}`,
      source: '民航处',
      category: '民航处',
      name: feature.properties.Name_of_Building_TC || feature.properties.Name_of_Building_EN,
      address: feature.properties.Address_Street_TC || feature.properties.Address_Street_EN,
      district: feature.properties.Address_District_TC || feature.properties.Address_District_EN,
      region: feature.properties.Address_Region_TC || feature.properties.Address_Region_EN,
      location: feature.properties.Location_of_water_dispenser_TC || feature.properties.Location_of_water_dispenser_EN,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      count: parseInt(feature.properties.Number_of_water_dispenser_TC) || 1,
      type: feature.properties.Type_of_water_dispenser_TC || feature.properties.Type_of_water_dispenser_EN,
      temperature: feature.properties.Water_temperature_TC || feature.properties.Water_temperature_EN,
      location_type: feature.properties.Indoor_outdoor_TC || feature.properties.Indoor_outdoor_EN,
      service_hours: `${feature.properties.Service_hours_from_TC} - ${feature.properties.Service_hours_to_TC}`,
      service_exception: feature.properties.Service_hours_exception_TC || feature.properties.Service_hours_exception_EN
    }))
  } catch (err) {
    console.error('Error fetching CAD data:', err)
    return []
  }
}

// 郊野公园数据获取
const fetchAFCDCountryData = async () => {
  try {
    const url = 'https://portal.csdi.gov.hk/server/services/common/afcd_rcd_1635133835075_48993/MapServer/WFSServer?service=wfs&request=GetFeature&typenames=CPWDL&outputFormat=geojson'
    const response = await fetch(url)
    const data = await response.json()

    return data.features.map(feature => ({
      id: `afcd_country_${feature.properties.GmlID}`,
      source: '渔农自然护理署',
      category: '郊野公园',
      name: feature.properties.FACILITY_NAME_TC || feature.properties.FACILITY_NAME_EN,
      address: feature.properties.ADDRESS_TC || feature.properties.ADDRESS_EN,
      district: feature.properties.COUNTRY_PARK_TC || feature.properties.COUNTRY_PARK_EN,
      region: '新界',
      location: feature.properties.ADDRESS_TC || feature.properties.ADDRESS_EN,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      count: 1,
      type: feature.properties.TYPE_OF_WATER_DISPENSER_TC || feature.properties.TYPE_OF_WATER_DISPENSER_EN,
      temperature: feature.properties.WATER_TEMPERATURE_TC || feature.properties.WATER_TEMPERATURE_EN,
      location_type: feature.properties.TYPE_OF_VENUE_TC || feature.properties.TYPE_OF_VENUE_EN,
      service_hours: feature.properties.SERVICE_HOUR_TC || feature.properties.SERVICE_HOUR_EN
    }))
  } catch (err) {
    console.error('Error fetching AFCD Country data:', err)
    return []
  }
}

// 海岸公园数据获取
const fetchAFCDMarineData = async () => {
  try {
    const url = 'https://portal.csdi.gov.hk/server/services/common/afcd_rcd_1635134016841_24336/MapServer/WFSServer?service=wfs&request=GetFeature&typenames=geotagging&outputFormat=geojson'
    const response = await fetch(url)
    const data = await response.json()

    return data.features.map(feature => ({
      id: `afcd_marine_${feature.properties.GmlID}`,
      source: '渔农自然护理署',
      category: '海岸公园',
      name: feature.properties.NAME_OF_FACILITY_CHI || feature.properties.NAME_OF_FACILITY_EN,
      address: feature.properties.ADDRESS_OF_FACILITY_CHI || feature.properties.ADDRESS_OF_FACILITY_EN,
      district: feature.properties.ADDRESS_OF_FACILITY_DISTRICT_CHI || feature.properties.ADDRESS_OF_FACILITY_DISTRICT_EN,
      region: feature.properties.ADDRESS_OF_FACILITY_REGION_CHI || feature.properties.ADDRESS_OF_FACILITY_REGION_EN,
      location: feature.properties.LOCATION_OF_FACILITY_CHI || feature.properties.LOCATION_OF_FACILITY_EN,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      count: 1,
      type: '加水站',
      temperature: '常温',
      location_type: '室外',
      service_hours: '24小时开放'
    }))
  } catch (err) {
    console.error('Error fetching AFCD Marine data:', err)
    return []
  }
}

// 计算属性
const filteredDispensers = computed(() => {
  let filtered = waterDispensers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(dispenser =>
      dispenser.name.toLowerCase().includes(query) ||
      dispenser.address.toLowerCase().includes(query) ||
      dispenser.location.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(dispenser => dispenser.category === selectedCategory.value)
  }

  if (selectedRegion.value) {
    filtered = filtered.filter(dispenser => dispenser.region === selectedRegion.value)
  }

  if (selectedType.value) {
    filtered = filtered.filter(dispenser => dispenser.type === selectedType.value)
  }

  return filtered
})

const categories = computed(() => {
  return [...new Set(waterDispensers.value.map(dispenser => dispenser.category))].sort()
})

const regions = computed(() => {
  return [...new Set(waterDispensers.value.map(dispenser => dispenser.region))].sort()
})

const types = computed(() => {
  return [...new Set(waterDispensers.value.map(dispenser => dispenser.type))].sort()
})

const categoryOptions = computed(() => categories.value.map(c => ({ label: c, value: c })))
const regionOptions = computed(() => regions.value.map(r => ({ label: r, value: r })))
const typeOptions = computed(() => types.value.map(t => ({ label: t, value: t })))

// 统计数据
const totalDispensers = computed(() => {
  return waterDispensers.value.reduce((sum, dispenser) => sum + dispenser.count, 0)
})

const lcsdCount = computed(() => {
  return waterDispensers.value
    .filter(dispenser => dispenser.category === '康文署')
    .reduce((sum, dispenser) => sum + dispenser.count, 0)
})

const fehdCount = computed(() => {
  return waterDispensers.value
    .filter(dispenser => dispenser.category === '食环署')
    .reduce((sum, dispenser) => sum + dispenser.count, 0)
})

const wsdCount = computed(() => {
  return waterDispensers.value
    .filter(dispenser => dispenser.category === '水务署')
    .reduce((sum, dispenser) => sum + dispenser.count, 0)
})

const cadCount = computed(() => {
  return waterDispensers.value
    .filter(dispenser => dispenser.category === '民航处')
    .reduce((sum, dispenser) => sum + dispenser.count, 0)
})

const afcdCountryCount = computed(() => {
  return waterDispensers.value
    .filter(dispenser => dispenser.category === '郊野公园')
    .reduce((sum, dispenser) => sum + dispenser.count, 0)
})

const afcdMarineCount = computed(() => {
  return waterDispensers.value
    .filter(dispenser => dispenser.category === '海岸公园')
    .reduce((sum, dispenser) => sum + dispenser.count, 0)
})

// 地图相关
const mapCenter = computed(() => {
  const first = filteredDispensers.value[0]
  if (first && first.latitude && first.longitude) {
    return { lat: Number(first.latitude), lng: Number(first.longitude) }
  }
  return { lat: 22.3027, lng: 114.1772 } // 香港中心点
})

const mapMarkers = computed(() =>
  filteredDispensers.value
    .filter(d => d.latitude && d.longitude)
    .map(d => ({
      lat: Number(d.latitude),
      lng: Number(d.longitude),
      title: `${d.name} (${d.count}个饮水机)`
    }))
)

// 功能函数
const viewOnMap = (dispenser) => {
  const lat = Number(dispenser.latitude)
  const lng = Number(dispenser.longitude)
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  window.open(url, '_blank')
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedRegion.value = ''
  selectedType.value = ''
}

// 生命周期
onMounted(() => {
  loadWaterDispenserData()
})
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>