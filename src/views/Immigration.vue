<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />
    
    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center space-y-3 mb-12">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Immigration</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">香港出入境繁忙度</h1>
          <p class="text-base sm:text-lg text-slate-600">
            实时查看各口岸繁忙程度 - 
            <span :class="currentView === 'visitor' ? 'text-blue-600' : 'text-green-600'">
              {{ currentView === 'visitor' ? '访客数据' : '居民数据' }}
            </span>
          </p>
          
          <!-- Last Update Time -->
          <div class="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
            <i class="fa fa-clock-o"></i>
            <span>最后更新: {{ lastUpdateTime }}</span>
            <button @click="refreshData" :disabled="isLoading" 
              class="ml-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <i :class="['fa', isLoading ? 'fa-spinner fa-spin' : 'fa-refresh']"></i>
              {{ isLoading ? '刷新中' : '刷新' }}
            </button>
          </div>

          <!-- View Switcher -->
          <div class="flex items-center justify-center gap-2 mb-4">
            <span class="text-sm text-slate-600 mr-2">数据类型:</span>
            <button @click="switchView('visitor')" :class="[
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              currentView === 'visitor' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            ]">
              访客数据
            </button>
            <button @click="switchView('resident')" :class="[
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              currentView === 'resident' 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            ]">
              居民数据
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && !queueData" class="flex items-center justify-center py-20">
          <div class="text-center">
            <i class="fa fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
            <p class="text-slate-600">正在加载出入境数据...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="mb-6">
            <i class="fa fa-exclamation-triangle text-6xl text-red-300"></i>
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">加载失败</h3>
          <p class="text-slate-600 mb-6">{{ error }}</p>
          <button @click="refreshData"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            重试
          </button>
        </div>

        <!-- Data Display -->
        <div v-else-if="queueData" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="(data, port) in queueData" :key="port"
            class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200 p-6">
            <!-- Port Header -->
            <div class="flex items-center gap-3 mb-6">
              <div :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl',
                getPortStatusColor(Math.max(data.arrQueue, data.depQueue))
              ]">
                <i class="fa fa-plane"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900">
                  {{ getPortName(port) }}
                </h3>
                <p class="text-sm text-slate-500">{{ port }}</p>
              </div>
            </div>

            <!-- Queue Status -->
            <div class="space-y-4">
              <!-- Arrival Queue -->
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div class="flex items-center gap-3">
                  <i class="fa fa-arrow-down text-green-600"></i>
                  <div>
                    <p class="font-medium text-slate-900">入境</p>
                    <p class="text-sm text-slate-500">Arrival</p>
                  </div>
                </div>
                <div class="text-right">
                  <div :class="[
                    'text-lg font-bold',
                    getStatusTextColor(data.arrQueue)
                  ]">
                    {{ getStatusText(data.arrQueue) }}
                  </div>
                  <div class="text-sm text-slate-500">
                    {{ getWaitingTime(data.arrQueue, currentView === 'visitor' ? 'visitor' : 'resident') }}
                  </div>
                </div>
              </div>

              <!-- Departure Queue -->
              <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div class="flex items-center gap-3">
                  <i class="fa fa-arrow-up text-blue-600"></i>
                  <div>
                    <p class="font-medium text-slate-900">出境</p>
                    <p class="text-sm text-slate-500">Departure</p>
                  </div>
                </div>
                <div class="text-right">
                  <div :class="[
                    'text-lg font-bold',
                    getStatusTextColor(data.depQueue)
                  ]">
                    {{ getStatusText(data.depQueue) }}
                  </div>
                  <div class="text-sm text-slate-500">
                    {{ getWaitingTime(data.depQueue, currentView === 'visitor' ? 'visitor' : 'resident') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Info -->
            <div v-if="currentView === 'visitor'" class="mt-4 p-3 bg-blue-50 rounded-lg">
              <p class="text-xs text-blue-700 font-medium mb-1">访客等候时间 (当前数据)</p>
              <div class="flex justify-between text-xs text-blue-600">
                <span>入境: {{ getWaitingTime(data.arrQueue, 'visitor') }}</span>
                <span>出境: {{ getWaitingTime(data.depQueue, 'visitor') }}</span>
              </div>
            </div>
            <div v-else class="mt-4 p-3 bg-green-50 rounded-lg">
              <p class="text-xs text-green-700 font-medium mb-1">居民等候时间 (当前数据)</p>
              <div class="flex justify-between text-xs text-green-600">
                <span>入境: {{ getWaitingTime(data.arrQueue, 'resident') }}</span>
                <span>出境: {{ getWaitingTime(data.depQueue, 'resident') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div v-if="queueData" class="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-100">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">状态说明</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <p class="font-medium text-slate-900">正常</p>
                <p class="text-sm text-slate-500">居民 &lt;15分钟 / 访客 &lt;30分钟</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div>
                <p class="font-medium text-slate-900">繁忙</p>
                <p class="text-sm text-slate-500">居民 &lt;30分钟 / 访客 &lt;45分钟</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <p class="font-medium text-slate-900">非常繁忙</p>
                <p class="text-sm text-slate-500">居民 ≥30分钟 / 访客 ≥45分钟</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-slate-400 rounded-full"></div>
              <div>
                <p class="font-medium text-slate-900">非服务时间</p>
                <p class="text-sm text-slate-500">暂停服务或维护中</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { 
  getImmigrationQueueTime,
  getPortName,
  getStatusText,
  getStatusTextColor,
  getPortStatusColor,
  getWaitingTime,
  formatUpdateTime
} from '@/api/immigration.js'

const queueData = ref(null)
const visitorData = ref(null)
const residentData = ref(null)
const isLoading = ref(false)
const error = ref(null)
const lastUpdateTime = ref('')
const currentView = ref('both') // 'visitor', 'resident', 'both'
let refreshInterval = null

// 获取出入境数据
const fetchQueueData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await getImmigrationQueueTime()
    visitorData.value = response.data.visitor
    residentData.value = response.data.resident
    
    // 为了兼容现有模板，合并数据到queueData
    queueData.value = currentView.value === 'visitor' ? response.data.visitor : 
                     currentView.value === 'resident' ? response.data.resident : 
                     response.data.visitor // 默认显示访客数据
    
    lastUpdateTime.value = formatUpdateTime()
    
  } catch (err) {
    console.error('获取出入境数据失败:', err)
    error.value = '无法获取出入境数据，请检查网络连接'
  } finally {
    isLoading.value = false
  }
}

// 手动刷新数据
const refreshData = () => {
  fetchQueueData()
}

// 切换视图
const switchView = (view) => {
  currentView.value = view
  if (visitorData.value && residentData.value) {
    queueData.value = view === 'visitor' ? visitorData.value : 
                     view === 'resident' ? residentData.value : 
                     visitorData.value // 默认显示访客数据
  }
}

// 组件挂载时获取数据并设置自动刷新
onMounted(() => {
  fetchQueueData()
  // 每30秒自动刷新一次
  refreshInterval = setInterval(fetchQueueData, 30000)
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
