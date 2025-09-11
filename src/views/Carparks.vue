<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />

    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              香港停车场信息
            </span>
          </h1>
          <p class="text-lg text-slate-600">来自政府开放数据的停车场位置与车位信息</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载停车场数据...</span>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadParks"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">重试</button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ parks.length }}</div>
              <div class="text-sm text-slate-500">停车场总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ filteredParks.length }}</div>
              <div class="text-sm text-slate-500">当前筛选</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-green-600">{{ districts.length }}</div>
              <div class="text-sm text-slate-500">覆盖地区</div>
            </div>
          </div>

          <!-- Controls (Naive UI) -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索名称或地址..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedType" :options="vehicleTypeOptions" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedDistrict" clearable placeholder="全部地区" :options="districtOptions" />
            </div>
          </div>

          <!-- Map (Google Maps) -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-slate-100 mb-8">
            <div class="p-4 border-b border-slate-100">
              <h2 class="text-lg font-semibold text-slate-900">停车场分布地图</h2>
              <p class="text-sm text-slate-600">使用 Google 地图显示筛选后的停车场</p>
            </div>
            <div class="p-2">
              <GoogleMap :center="mapCenter" :zoom="12" :markers="mapMarkers" />
            </div>
          </div>

          <!-- List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="p in filteredParks" :key="p.park_Id"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">
              <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ p.name }}</h3>
                    <div class="text-sm text-slate-600">{{ p.displayAddress || p.addressLine }}</div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                      {{ p.district || p.address?.dcDistrict || '—' }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 text-sm text-slate-700 mb-3">
                  <div>
                    <div class="text-slate-500 text-xs">车型</div>
                    <div class="font-medium">{{ vehicleTypeLabel(selectedType) }}</div>
                  </div>
                  <div>
                    <div class="text-slate-500 text-xs">车位</div>
                    <div class="font-medium">{{ p.capacity ?? '未知' }}</div>
                  </div>
                  <div>
                    <div class="text-slate-500 text-xs">开放</div>
                    <div class="font-medium">{{ p.opening_status || '—' }}</div>
                  </div>
                  <div>
                    <div class="text-slate-500 text-xs">高度限制</div>
                    <div class="font-medium">{{ p.heightLimit ? p.heightLimit + ' m' : '—' }}</div>
                  </div>
                </div>

                <!-- Pricing summary -->
                <div class="flex flex-wrap gap-2 mb-3">
                  <span v-if="p.pricing?.hourlyMin != null"
                    class="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-md font-medium">
                    时租: ${{ p.pricing.hourlyMin }} 起
                  </span>
                  <span v-if="p.pricing?.monthlyMin != null"
                    class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-md font-medium">
                    月票: ${{ p.pricing.monthlyMin }} 起
                  </span>
                  <span v-if="p.pricing?.nightMin != null"
                    class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md font-medium">
                    夜泊: ${{ p.pricing.nightMin }} 起
                  </span>
                </div>

                <div class="flex flex-wrap gap-2 mb-3">
                  <span v-for="f in (p.facilities || [])" :key="f"
                    class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">{{ facilityLabel(f)
                    }}</span>
                  <span v-for="pm in (p.paymentMethods || [])" :key="pm"
                    class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-medium">{{ pm.toUpperCase()
                    }}</span>
                </div>

                <div class="flex gap-2">
                  <button @click="viewOnMap(p)"
                    class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <i class="fa fa-map mr-2"></i>地图查看
                  </button>
                  <button v-if="p.website" @click="openWebsite(p.website)"
                    class="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                    <i class="fa fa-globe"></i>
                  </button>
                  <button v-if="p.contactNo" @click="callSupport(p.contactNo)"
                    class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                    <i class="fa fa-phone"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredParks.length === 0" class="text-center py-16 text-slate-600">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import parkSample from '@/data/park.json'
import GoogleMap from '@/components/GoogleMap.vue'

const loading = ref(true)
const error = ref('')
const parks = ref([])
const selectedType = ref('privateCar')
const selectedDistrict = ref('')
const searchQuery = ref('')
// removed iframe integration

const vehicleTypeOptions = [
  { value: 'privateCar', label: '私家车' },
  { value: 'LGV', label: '轻型货车' },
  { value: 'HGV', label: '重型货车' },
  { value: 'CV', label: '货柜车' },
  { value: 'coach', label: '旅游巴' },
  { value: 'motorCycle', label: '电单车' },
]
const vehicleTypeLabel = (v) => (vehicleTypeOptions.find(o => o.value === v)?.label || v)

const normalize = (raw) => {
  // important info only + computed fields for the selectedType when used
  return raw.results.map(r => ({
    park_Id: r.park_Id,
    name: r.name,
    district: r.district || r.address?.dcDistrict,
    address: r.address,
    addressLine: r.displayAddress || [r.address?.region, r.address?.subDistrict, r.address?.streetName, r.address?.buildingNo, r.address?.buildingName, r.address?.floor].filter(Boolean).join(' '),
    displayAddress: r.displayAddress,
    latitude: r.latitude,
    longitude: r.longitude,
    opening_status: r.opening_status,
    openingHours: r.openingHours,
    facilities: r.facilities,
    paymentMethods: r.paymentMethods,
    contactNo: r.contactNo,
    website: r.website,
    nature: r.nature,
    carpark_Type: r.carpark_Type,
    heightLimit: Array.isArray(r.heightLimits) && r.heightLimits.length ? r.heightLimits[0].height : null,
    // capacities per vehicle types
    capacities: {
      privateCar: (r.privateCar?.vacancy ?? r.privateCar?.space) ?? null,
      LGV: (r.LGV?.vacancy ?? r.LGV?.space) ?? null,
      HGV: (r.HGV?.vacancy ?? r.HGV?.space) ?? null,
      CV: (r.CV?.vacancy ?? r.CV?.space) ?? null,
      coach: (r.coach?.vacancy ?? r.coach?.space) ?? null,
      motorCycle: (r.motorCycle?.vacancy ?? r.motorCycle?.space) ?? null,
    },
    // keep raw sections for pricing extraction
    sections: {
      privateCar: r.privateCar || {},
      LGV: r.LGV || {},
      HGV: r.HGV || {},
      CV: r.CV || {},
      coach: r.coach || {},
      motorCycle: r.motorCycle || {},
    }
  })).filter(p => p.latitude && p.longitude)
}

const loadParks = async () => {
  loading.value = true
  error.value = ''
  try {
    const url = `https://api.data.gov.hk/v1/carpark-info-vacancy?vehicleTypes=${encodeURIComponent(selectedType.value)}&lang=zh_CN`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    parks.value = normalize(data)
  } catch (e) {
    console.warn('Carpark API failed, fallback to sample:', e)
    parks.value = normalize(parkSample)
  } finally {
    loading.value = false
    scheduleMapSends()
  }
}

const pricingFromSection = (sec = {}) => {
  const pickMin = (arr, key = 'price') => Array.isArray(arr) && arr.length
    ? Math.min(...arr.map(x => Number(x?.[key])).filter(n => isFinite(n)))
    : null
  const hourlyMin = pickMin(sec.hourlyCharges)
  const monthlyMin = pickMin(sec.monthlyCharges)
  const nightMin = pickMin(sec.dayNightParks)
  return { hourlyMin, monthlyMin, nightMin }
}

const filteredParks = computed(() => {
  const q = (searchQuery.value || '').toLowerCase()
  let list = parks.value.map(p => ({
    ...p,
    capacity: p.capacities[selectedType.value],
    pricing: pricingFromSection(p.sections?.[selectedType.value])
  }))
  if (selectedDistrict.value) list = list.filter(p => p.district === selectedDistrict.value)
  if (q) list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.addressLine || '').toLowerCase().includes(q))
  return list
})

const districts = computed(() => {
  return [...new Set(parks.value.map(p => p.district).filter(Boolean))].sort()
})

const districtOptions = computed(() => districts.value.map(d => ({ label: d, value: d })))

const facilityLabel = (code) => {
  const map = { evCharger: '充电', disabilities: '无障碍', unloading: '卸货', washing: '洗车' }
  return map[code] || code
}

const viewOnMap = (p) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`
  window.open(url, '_blank')
}
const openWebsite = (u) => { if (u) window.open(u, '_blank') }
const callSupport = (phone) => { if (phone) window.open(`tel:${phone}`) }

onMounted(() => {
  loadParks()
})

watch(selectedType, () => {
  loadParks()
})

// map updates via computed markers

// Map data for GoogleMap component
const mapCenter = computed(() => {
  const first = filteredParks.value[0]
  if (first && first.latitude && first.longitude) {
    return { lat: Number(first.latitude), lng: Number(first.longitude) }
  }
  return { lat: 22.3027, lng: 114.1772 }
})

const mapMarkers = computed(() =>
  filteredParks.value
    .filter(p => p.latitude && p.longitude)
    .map(p => ({ lat: Number(p.latitude), lng: Number(p.longitude), title: p.name }))
)
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.h-180 {
  height: 45rem;
}
</style>
