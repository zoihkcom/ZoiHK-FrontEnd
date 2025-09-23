<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Main Content -->
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center space-y-3 mb-8">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Events</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">香港政府活动</h1>
          <p class="text-base sm:text-lg text-slate-600">查看香港政府举办的各类活动信息</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-4 text-slate-600">正在加载活动数据...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <button @click="loadEvents"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Statistics -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-blue-600">{{ events.length }}</div>
              <div class="text-sm text-slate-500">活动总数</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-green-600">{{ activeEvents }}</div>
              <div class="text-sm text-slate-500">进行中活动</div>
            </div>
            <div class="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div class="text-2xl font-bold text-purple-600">{{ organizations.length }}</div>
              <div class="text-sm text-slate-500">参与机构</div>
            </div>
          </div>

          <!-- Filters (Naive UI) -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <n-input v-model:value="searchQuery" clearable placeholder="搜索活动名称、机构或地点..." />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedCategory" :options="categoryOptions" @update:value="loadEvents" />
            </div>
            <div class="w-full sm:w-56">
              <n-select v-model:value="selectedStatus" :options="statusOptions" clearable placeholder="全部状态" />
            </div>
          </div>

          <!-- Events List -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="event in filteredEvents" :key="event.event_id"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100">

              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ event.event_summary }}</h3>
                    <div class="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <i class="fa fa-building"></i>
                      <span>{{ event.event_org }}</span>
                    </div>
                    <div v-if="event.event_location" class="flex items-center gap-2 text-sm text-slate-500">
                      <i class="fa fa-map-marker"></i>
                      <span>{{ event.event_location }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="inline-block px-3 py-1 text-xs font-medium rounded-full"
                      :class="getStatusClass(event.event_status)">
                      {{ getStatusText(event.event_status) }}
                    </span>
                  </div>
                </div>

                <div class="mb-4">
                  <div class="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <i class="fa fa-calendar text-blue-500"></i>
                    <span>{{ formatDateRange(event.event_start_date, event.event_end_date) }}</span>
                  </div>
                  <div v-if="event.event_duration" class="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <i class="fa fa-clock-o text-green-500"></i>
                    <span>{{ event.event_duration }}</span>
                  </div>
                </div>

                <!-- Event Description -->
                <div v-if="event.event_desc" class="mb-4 p-3 bg-slate-50 rounded-lg">
                  <p class="text-sm text-slate-700 leading-relaxed">{{ event.event_desc }}</p>
                </div>

                <!-- Event Date Details -->
                <div v-if="event.event_date" class="mb-4">
                  <h4 class="text-sm font-medium text-slate-900 mb-2">活动时间详情</h4>
                  <div class="p-3 bg-slate-50 rounded-lg max-h-32 overflow-y-auto">
                    <pre class="text-xs text-slate-600 whitespace-pre-line">{{ event.event_date }}</pre>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-md font-medium">
                      {{ getCategoryName(selectedCategory) }}
                    </span>
                    <span class="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-md font-medium">
                      <i class="fa fa-calendar mr-1"></i>
                      活动编号: {{ event.event_id }}
                    </span>
                  </div>

                  <div class="flex gap-2">
                    <button v-if="event.event_url" @click="openEventUrl(event.event_url)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <i class="fa fa-external-link mr-2"></i>
                      查看详情
                    </button>
                    <button v-if="event.event_ics" @click="downloadICS(event.event_ics)"
                      class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                      <i class="fa fa-calendar-plus-o"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredEvents.length === 0" class="text-center py-16">
            <div class="mb-6">
              <i class="fa fa-search text-6xl text-slate-300"></i>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">未找到匹配的活动</h3>
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
import request from '@/api/request.js'

const loading = ref(true)
const error = ref('')
const events = ref([])
const searchQuery = ref('')
const selectedCategory = ref('1')
const selectedStatus = ref('')

// 分类名称映射
const categoryNames = {
  '1': '节庆及嘉年华',
  '2': '表演及娱乐',
  '3': '康乐及体育',
  '4': '图书馆及博物馆',
  '5': '社区活动',
  '6': '展览及参观',
  '7': '研讨会及工作坊',
  '8': '其他',
  '10': '慈善筹款'
}

const categoryOptions = [
  { label: '节庆及嘉年华', value: '1' },
  { label: '表演及娱乐', value: '2' },
  { label: '康乐及体育', value: '3' },
  { label: '图书馆及博物馆', value: '4' },
  { label: '社区活动', value: '5' },
  { label: '展览及参观', value: '6' },
  { label: '研讨会及工作坊', value: '7' },
  { label: '其他', value: '8' },
  { label: '慈善筹款', value: '10' }
]

const statusOptions = [
  { label: '即将开始', value: 'A' },
  { label: '进行中', value: 'B' },
  { label: '已结束', value: 'C' }
]

const loadEvents = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await request.get('/events', {
      params: {
        category: selectedCategory.value,
        lang: 'sc'
      }
    })
    events.value = response.data || []
  } catch (err) {
    error.value = '加载活动数据失败，请稍后重试'
    console.error('Error loading events:', err)
  } finally {
    loading.value = false
  }
}

const filteredEvents = computed(() => {
  let filtered = events.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(event =>
      event.event_summary?.toLowerCase().includes(query) ||
      event.event_org?.toLowerCase().includes(query) ||
      event.event_location?.toLowerCase().includes(query) ||
      event.event_desc?.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(event => event.event_status === selectedStatus.value)
  }

  return filtered
})

const activeEvents = computed(() => {
  return events.value.filter(event => event.event_status === 'B').length
})

const organizations = computed(() => {
  return [...new Set(events.value.map(event => event.event_org).filter(Boolean))]
})

const getCategoryName = (categoryId) => {
  return categoryNames[categoryId] || '未知分类'
}

const getStatusClass = (status) => {
  switch (status) {
    case 'A': return 'bg-yellow-100 text-yellow-800'
    case 'B': return 'bg-green-100 text-green-800'
    case 'C': return 'bg-gray-100 text-gray-800'
    default: return 'bg-blue-100 text-blue-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'A': return '即将开始'
    case 'B': return '进行中'
    case 'C': return '已结束'
    default: return '未知状态'
  }
}

const formatDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return '时间待定'

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  if (startDate === endDate) {
    return formatDate(startDate)
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

const openEventUrl = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const downloadICS = (icsUrl) => {
  if (icsUrl) {
    window.open(icsUrl, '_blank')
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
}

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
