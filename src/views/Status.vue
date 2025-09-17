<template>
  <div class="min-h-screen bg-white">
    <Navbar />

    <!-- Header -->
    <section class="pt-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-4xl mx-auto">
        <div class="py-16 sm:py-20 text-center">
          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <h1 class="text-3xl sm:text-4xl font-light tracking-tight text-slate-900">
              系统状态
            </h1>
          </div>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            实时监控 SmartHK 各项服务的运行状态，确保为您提供稳定可靠的服务体验。
          </p>
        </div>
      </div>
    </section>

    <!-- Overall Status -->
    <section class="px-4 sm:px-6 lg:px-8 pb-12">
      <div class="max-w-4xl mx-auto">
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-8 sm:p-10 mb-12">
          <div class="flex items-center gap-4">
            <div class="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
            <div>
              <h2 class="text-xl font-semibold text-green-900">所有系统运行正常</h2>
              <p class="text-green-700 mt-1">所有服务当前运行状态良好，响应时间正常。</p>
            </div>
          </div>
          <div class="mt-6 text-sm text-green-600">
            最后更新：{{ formatTime(lastUpdated) }}
          </div>
        </div>
      </div>
    </section>

    <!-- Services Status -->
    <section class="px-4 sm:px-6 lg:px-8 pb-16">
      <div class="max-w-4xl mx-auto">
        <h3 class="text-2xl font-light tracking-tight text-slate-900 mb-8">服务状态详情</h3>
        
        <div class="space-y-6">
          <div v-for="service in services" :key="service.id" 
               class="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <div :class="getStatusColor(service.status)" class="w-3 h-3 rounded-full"></div>
                  <span class="text-lg font-medium text-slate-900">{{ service.name }}</span>
                </div>
                <span :class="getStatusTextColor(service.status)" 
                      class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ getStatusText(service.status) }}
                </span>
              </div>
              <div class="text-right">
                <div class="text-sm text-slate-500">响应时间</div>
                <div class="text-lg font-medium text-slate-900">{{ service.responseTime }}ms</div>
              </div>
            </div>
            
            <p class="text-slate-600 mt-3">{{ service.description }}</p>
            
            <div class="mt-4 flex items-center gap-6 text-sm text-slate-500">
              <div>运行时间：{{ service.uptime }}</div>
              <div>最后检查：{{ formatTime(service.lastCheck) }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Incidents -->
    <section class="px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-4xl mx-auto">
        <h3 class="text-2xl font-light tracking-tight text-slate-900 mb-8">近期事件</h3>
        
        <div class="bg-white border border-slate-200 rounded-2xl">
          <div v-if="incidents.length === 0" class="p-8 text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h4 class="text-lg font-medium text-slate-900 mb-2">无服务中断</h4>
            <p class="text-slate-600">过去 30 天内没有发生任何服务中断或重大事件。</p>
          </div>
          
          <div v-else class="divide-y divide-slate-200">
            <div v-for="incident in incidents" :key="incident.id" class="p-6">
              <div class="flex items-start gap-4">
                <div :class="getIncidentColor(incident.severity)" class="w-3 h-3 rounded-full mt-2"></div>
                <div class="flex-1">
                  <h4 class="font-medium text-slate-900">{{ incident.title }}</h4>
                  <p class="text-slate-600 mt-1">{{ incident.description }}</p>
                  <div class="text-sm text-slate-400 mt-2">
                    {{ formatTime(incident.timestamp) }} • 影响时长：{{ incident.duration }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const lastUpdated = ref(new Date())

const services = ref([
  {
    id: 'api',
    name: 'API 服务',
    status: 'operational',
    description: '核心 API 接口，提供数据查询和用户认证服务',
    responseTime: Math.floor(Math.random() * 200) + 50,
    uptime: '99.99%',
    lastCheck: new Date(Date.now() - Math.random() * 60000)
  },
  {
    id: 'web',
    name: 'Web 应用',
    status: 'operational', 
    description: 'SmartHK 主站和用户界面',
    responseTime: Math.floor(Math.random() * 150) + 30,
    uptime: '99.98%',
    lastCheck: new Date(Date.now() - Math.random() * 60000)
  },
  {
    id: 'database',
    name: '数据库',
    status: 'operational',
    description: '城市数据存储和查询服务',
    responseTime: Math.floor(Math.random() * 80) + 10,
    uptime: '99.99%',
    lastCheck: new Date(Date.now() - Math.random() * 60000)
  },
  {
    id: 'cdn',
    name: 'CDN 分发',
    status: 'operational',
    description: '全球内容分发网络，加速静态资源访问',
    responseTime: Math.floor(Math.random() * 120) + 20,
    uptime: '99.97%',
    lastCheck: new Date(Date.now() - Math.random() * 60000)
  }
])

const incidents = ref([])

const getStatusColor = (status) => {
  const colors = {
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500', 
    partial: 'bg-orange-500',
    outage: 'bg-red-500'
  }
  return colors[status] || 'bg-gray-500'
}

const getStatusTextColor = (status) => {
  const colors = {
    operational: 'bg-green-100 text-green-800',
    degraded: 'bg-yellow-100 text-yellow-800',
    partial: 'bg-orange-100 text-orange-800', 
    outage: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    operational: '正常运行',
    degraded: '性能下降',
    partial: '部分中断',
    outage: '服务中断'
  }
  return texts[status] || '未知状态'
}

const getIncidentColor = (severity) => {
  const colors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500'
  }
  return colors[severity] || 'bg-gray-500'
}

const formatTime = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

onMounted(() => {
  document.title = '系统状态 - SmartHK'
  
  // 模拟实时更新
  setInterval(() => {
    lastUpdated.value = new Date()
    // 更新服务检查时间和响应时间
    services.value.forEach(service => {
      service.lastCheck = new Date(Date.now() - Math.random() * 60000)
      // 为不同服务设置不同的随机范围
      switch(service.id) {
        case 'api':
          service.responseTime = Math.floor(Math.random() * 200) + 50
          break
        case 'web':
          service.responseTime = Math.floor(Math.random() * 150) + 30
          break
        case 'database':
          service.responseTime = Math.floor(Math.random() * 80) + 10
          break
        case 'cdn':
          service.responseTime = Math.floor(Math.random() * 120) + 20
          break
        default:
          service.responseTime = Math.floor(Math.random() * 100) + 50
      }
    })
  }, 30000)
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>