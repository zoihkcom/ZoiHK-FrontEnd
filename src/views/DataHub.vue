<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Main Content -->
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              一站式信息服务中心
            </span>
          </h1>
          <p class="text-xl text-slate-600 mb-8">一站式获取香港各领域信息</p>

          <!-- Statistics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ availableModules }}</div>
              <div class="text-sm text-slate-500">可用信息</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-green-600">{{ activeModules }}</div>
              <div class="text-sm text-slate-500">活跃信息</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-orange-600">{{ lastUpdateTime }}</div>
              <div class="text-sm text-slate-500">最后更新</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">24/7</div>
              <div class="text-sm text-slate-500">服务时间</div>
            </div>
          </div>
        </div>

        <!-- Search and Filter (Naive UI) -->
        <div class="mb-8 flex flex-col sm:flex-row gap-4">
          <div class="flex-1 relative">
            <n-input v-model:value="searchQuery" clearable placeholder="搜索数据模块..." />
          </div>
          <div class="flex gap-2">
            <button v-for="category in categories" :key="category.id" @click="toggleCategory(category.id)" :class="[
              'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
              selectedCategories.includes(category.id)
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/80 text-slate-600 hover:bg-white shadow-sm'
            ]">
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- Modules Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="module in filteredModules" :key="module.id"
            class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-slate-200">
            <!-- Module Header -->
            <div class="p-6 pb-4">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl',
                    module.color
                  ]">
                    <i :class="module.icon"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {{ module.title }}
                    </h3>
                    <p class="text-sm text-slate-500">{{ module.department }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="[
                    'w-3 h-3 rounded-full',
                    module.status === 'active' ? 'bg-green-400' :
                      module.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                  ]"></span>
                  <span class="text-xs text-slate-500">
                    {{ getStatusText(module.status) }}
                  </span>
                </div>
              </div>

              <p class="text-sm text-slate-600 leading-relaxed mb-4">
                {{ module.description }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="tag in module.tags" :key="tag"
                  class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Module Actions -->
            <div class="p-6 pt-4 bg-slate-50/50 border-t border-slate-100">
              <div class="flex gap-2">
                <button @click="viewModule(module)" :disabled="module.status !== 'active'"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <i class="fa fa-eye mr-2"></i>
                  查看数据
                </button>
                <button @click="toggleFavorite(module.id)" :class="[
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  module.isFavorite
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                ]">
                  <i :class="module.isFavorite ? 'fa fa-heart' : 'fa fa-heart-o'"></i>
                </button>
                <button @click="openApiDocs(module)"
                  class="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                  <i class="fa fa-book mr-2"></i>
                  API
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredModules.length === 0" class="text-center py-16">
          <div class="mb-6">
            <i class="fa fa-search text-6xl text-slate-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的模块</h3>
          <p class="text-slate-600 mb-6">请尝试调整搜索条件或筛选器</p>
          <button @click="resetFilters"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重置筛选器
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const searchQuery = ref('')
const selectedCategories = ref([])

// 模块分类
const categories = [
  { id: 'all', name: '全部' },
  { id: 'transport', name: '交通出行' },
  { id: 'weather', name: '天气环境' },
  { id: 'health', name: '医疗健康' },
  { id: 'government', name: '政府服务' },
  { id: 'finance', name: '金融经济' },
  { id: 'education', name: '教育文化' }
]

// 数据模块配置
const modules = ref([
  {
    id: 'immigration',
    title: '出入境繁忙度',
    department: 'ImmD 入境事务处',
    description: '实时显示各口岸的繁忙程度，支持简体中文、繁体中文及英文数据格式',
    category: 'government',
    icon: 'fa fa-plane',
    color: 'bg-blue-500',
    status: 'active',
    tags: ['实时', '多语言', 'JSON'],
    isFavorite: false,
    route: '/immigration',
    apiDocs: 'https://data.gov.hk'
  },
  {
    id: 'weather',
    title: '天气预警',
    department: 'HKO 天文台',
    description: '提供详细的天气数据、预警信息和气象统计，支持简体中文参数',
    category: 'weather',
    icon: 'fa fa-cloud',
    color: 'bg-orange-500',
    status: 'active',
    tags: ['天气', '预警', '历史数据'],
    isFavorite: false,
    route: '/weather',
    apiDocs: 'https://data.weather.gov.hk'
  },
  {
    id: 'mtr',
    title: '地铁线路',
    department: 'MTR 港铁',
    description: '提供香港地铁线路图、站点信息和到站时间',
    category: 'transport',
    icon: 'fa fa-train',
    color: 'bg-red-500',
    status: 'active',
    tags: ['实时', '地铁', '到站时间'],
    isFavorite: false,
    route: '/subway',
    apiDocs: 'https://opendata.mtr.com.hk'
  },
  {
    id: 'bus-routes',
    title: '九巴线路',
    department: 'KMB 九巴',
    description: '提供香港巴士线路详细资讯，包含起点终点、方向、服务类型等完整线路数据',
    category: 'transport',
    icon: 'fa fa-bus',
    color: 'bg-indigo-500',
    status: 'active',
    tags: ['线路', '方向', '站点资讯'],
    isFavorite: false,
    route: '/bus-routes',
    apiDocs: 'https://data.etabus.gov.hk'
  },
  {
    id: 'citybus-routes',
    title: '城巴线路',
    department: 'CTB 城巴',
    description: '提供城巴线路详细资讯，包含起点终点、方向、实时到站时间等完整线路数据',
    category: 'transport',
    icon: 'fa fa-bus',
    color: 'bg-orange-500',
    status: 'active',
    tags: ['线路', '方向', '站点资讯', 'ETA'],
    isFavorite: false,
    route: '/citybus-routes',
    apiDocs: 'https://rt.data.gov.hk'
  },
  {
    id: 'carparks',
    title: '停车场信息',
    department: 'GovHK 开放数据',
    description: '香港停车场位置与车位信息，支持车型筛选与地图查看',
    category: 'transport',
    icon: 'fa fa-car',
    color: 'bg-violet-600',
    status: 'active',
    tags: ['停车场', '车位', '地图'],
    isFavorite: false,
    route: '/carparks',
    apiDocs: 'https://api.data.gov.hk/v1/carpark-info-vacancy'
  },
  {
    id: 'cctv',
    title: '交通CCTV监控',
    department: 'TD 运输署',
    description: '实时交通监控摄像头分布图，支持查看香港各区道路交通实况画面',
    category: 'transport',
    icon: 'fa fa-video-camera',
    color: 'bg-orange-500',
    status: 'active',
    tags: ['CCTV', '实时监控', '交通'],
    isFavorite: false,
    route: '/cctv',
    apiDocs: 'https://data.gov.hk'
  },
  {
    id: 'hospital',
    title: '急症轮候时间',
    department: 'HA 医管局',
    description: '各公立医院急症室的轮候时间，每15分钟更新一次',
    category: 'health',
    icon: 'fa fa-hospital-o',
    color: 'bg-red-600',
    status: 'active',
    tags: ['医疗', '急症', '轮候'],
    isFavorite: false,
    route: '/hospital',
    apiDocs: 'https://data.gov.hk'
  },
  {
    id: 'air-quality',
    title: '空气质量',
    department: 'EPD 环保署',
    description: '空气质量健康指数，包括当前数据、预报和历史记录',
    category: 'weather',
    icon: 'fa fa-leaf',
    color: 'bg-teal-500',
    status: 'active',
    tags: ['AQHI', '预报', '历史'],
    isFavorite: false,
    route: '/air-quality',
    apiDocs: 'https://data.gov.hk'
  },
  {
    id: 'flights',
    title: '航班信息',
    department: 'HKIA 香港机场',
    description: '机场到港和离港的航班数据，来自官方门户网站',
    category: 'transport',
    icon: 'fa fa-plane',
    color: 'bg-indigo-500',
    status: 'active',
    tags: ['航班', '到港', '离港'],
    isFavorite: false,
    route: '/flight',
    apiDocs: 'https://landsd.gov.hk'
  },
  {
    id: 'events',
    title: '政府活动',
    department: 'Gov.hk 政府网站',
    description: '香港政府举办的各类活动信息，包括节庆、表演、体育、展览等多种类型',
    category: 'government',
    icon: 'fa fa-calendar',
    color: 'bg-pink-500',
    status: 'active',
    tags: ['活动', '政府', '分类筛选'],
    isFavorite: false,
    route: '/events',
    apiDocs: 'https://ogcef.one.gov.hk'
  },
  {
    id: 'holidays',
    title: '公共假期',
    department: '1823 政府热线',
    description: '香港公共假期信息，支持JSON和iCal格式',
    category: 'government',
    icon: 'fa fa-sun-o',
    color: 'bg-yellow-500',
    status: 'active',
    tags: ['假期', 'iCal', '年度'],
    isFavorite: false,
    route: '/holidays',
    apiDocs: 'https://1823.gov.hk'
  },
  {
    id: 'wifi',
    title: 'WiFi热点',
    department: 'OGCIO 政府资讯科技总监办公室',
    description: 'Wi-Fi.HK和GovWiFi的热点位置信息',
    category: 'government',
    icon: 'fa fa-wifi',
    color: 'bg-cyan-500',
    status: 'active',
    tags: ['WiFi', '位置', '政府'],
    isFavorite: false,
    route: '/wifi',
    apiDocs: 'https://data.gov.hk'
  },
  {
    id: 'fehd',
    title: '环境卫生设施',
    department: 'FEHD 食物环境卫生署',
    description: '公厕、公众浴室、小贩市场、垃圾收集站等设施地图，默认展示公厕，可按类型筛选',
    category: 'government',
    icon: 'fa fa-map-marker',
    color: 'bg-blue-600',
    status: 'active',
    tags: ['地图', '设施', '公厕'],
    isFavorite: false,
    route: '/fehd',
    apiDocs: 'https://www.fehd.gov.hk'
  },
  {
    id: 'schools',
    title: '学校信息',
    department: 'EDB 教育局',
    description: '香港学校清单、坐标和校网信息',
    category: 'education',
    icon: 'fa fa-graduation-cap',
    color: 'bg-emerald-500',
    status: 'active',
    tags: ['学校', '坐标', '校网'],
    isFavorite: false,
    route: '/schools',
    apiDocs: 'https://data.gov.hk'
  },
  {
    id: 'minibus-routes',
    title: '专线小巴线路',
    department: 'TD 运输署',
    description: '香港专线小巴线路详细资讯，包含起点终点、方向、服务时间等完整线路数据',
    category: 'transport',
    icon: 'fa fa-bus',
    color: 'bg-green-600',
    status: 'active',
    tags: ['专线小巴', '线路', '方向', '站点资讯'],
    isFavorite: false,
    route: '/minibus-routes',
    apiDocs: 'https://data.gov.hk'
  },
  {
    id: 'water-dispensers',
    title: '饮水机位置',
    department: '多政府部门',
    description: '香港公共饮水机位置信息，包含康文署、食环署、水务署、民航处、郊野公园和海岸公园等多个来源',
    category: 'government',
    icon: 'fa fa-tint',
    color: 'bg-cyan-500',
    status: 'active',
    tags: ['饮水机', '位置', '公共设施', '多数据源'],
    isFavorite: false,
    route: '/water-dispensers',
    apiDocs: 'https://portal.csdi.gov.hk'
  }
])

// 计算属性
const filteredModules = computed(() => {
  let filtered = modules.value

  // 按分类筛选
  if (selectedCategories.value.length > 0 && !selectedCategories.value.includes('all')) {
    filtered = filtered.filter(module =>
      selectedCategories.value.includes(module.category)
    )
  }

  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(module =>
      module.title.toLowerCase().includes(query) ||
      module.description.toLowerCase().includes(query) ||
      module.department.toLowerCase().includes(query) ||
      module.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

const availableModules = computed(() => modules.value.length)
const activeModules = computed(() =>
  modules.value.filter(m => m.status === 'active').length
)
const lastUpdateTime = computed(() => {
  const now = new Date()
  return now.getHours().toString().padStart(2, '0') + ':' +
    now.getMinutes().toString().padStart(2, '0')
})

// 方法
const toggleCategory = (categoryId) => {
  if (categoryId === 'all') {
    selectedCategories.value = selectedCategories.value.includes('all') ? [] : ['all']
  } else {
    const index = selectedCategories.value.indexOf(categoryId)
    if (index > -1) {
      selectedCategories.value.splice(index, 1)
    } else {
      selectedCategories.value.push(categoryId)
      selectedCategories.value = selectedCategories.value.filter(c => c !== 'all')
    }
  }
}

const toggleFavorite = (moduleId) => {
  const module = modules.value.find(m => m.id === moduleId)
  if (module) {
    module.isFavorite = !module.isFavorite
  }
}

const viewModule = (module) => {
  if (module.status === 'active') {
    router.push(module.route)
  }
}

const openApiDocs = (module) => {
  window.open(module.apiDocs, '_blank')
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategories.value = []
}

const getStatusText = (status) => {
  switch (status) {
    case 'active': return '正常'
    case 'maintenance': return '维护中'
    case 'error': return '异常'
    default: return '未知'
  }
}

onMounted(() => {
  selectedCategories.value = ['all']
})
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
