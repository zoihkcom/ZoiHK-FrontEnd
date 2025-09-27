<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <Navbar />

    <div class="pt-20 px-4 sm:px-6 lg:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center space-y-3 mb-12">
          <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">Hong Kong Government News</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">香港特区政府新闻公报</h1>
          <p class="text-base sm:text-lg text-slate-600">获取最新的政府公告和政策信息</p>

          <div class="flex flex-col items-center gap-4">
            <button @click="refreshData" :disabled="loading"
              class="group inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl gap-2">
              <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                <path fill="currentColor" class="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.293 9.293a1 1 0 011.414 0L8 13.586V10a1 1 0 012 0v3.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
              <span>{{ loading ? '刷新中...' : '刷新新闻' }}</span>
            </button>

            <div v-if="newsData && newsData.length > 0" class="text-sm text-slate-500">
              最后更新：{{ formatUpdateTime(newsData[0].publishedAt) }}
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-center gap-4">
          <i class="fa fa-warning text-red-500 text-2xl"></i>
          <div class="flex-1">
            <h3 class="text-red-800 font-semibold text-lg mb-1">数据加载失败</h3>
            <p class="text-red-600 text-sm mb-3">{{ error }}</p>
            <button @click="refreshData"
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
              重试
            </button>
          </div>
        </div>

        <div v-else-if="loading && !newsData" class="flex flex-col items-center justify-center py-20">
          <div class="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
            <div class="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin">
            </div>
            <p class="text-slate-600 text-lg">正在获取新闻数据...</p>
          </div>
        </div>

        <div v-else-if="newsData && newsData.length > 0" class="space-y-6">
          <!-- 统计信息 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-lg p-6 text-center">
              <div class="flex items-center justify-center gap-3 mb-3">
                <i class="fa fa-newspaper-o text-3xl text-blue-500"></i>
                <h3 class="text-lg font-semibold text-slate-900">新闻总数</h3>
              </div>
              <div class="text-3xl font-bold text-blue-600">{{ newsData.length }}</div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6 text-center">
              <div class="flex items-center justify-center gap-3 mb-3">
                <i class="fa fa-clock-o text-3xl text-green-500"></i>
                <h3 class="text-lg font-semibold text-slate-900">今日新闻</h3>
              </div>
              <div class="text-3xl font-bold text-green-600">{{ todayNewsCount }}</div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6 text-center">
              <div class="flex items-center justify-center gap-3 mb-3">
                <i class="fa fa-calendar text-3xl text-purple-500"></i>
                <h3 class="text-lg font-semibold text-slate-900">本周新闻</h3>
              </div>
              <div class="text-3xl font-bold text-purple-600">{{ weekNewsCount }}</div>
            </div>
          </div>

          <!-- 新闻列表 -->
          <div class="space-y-4">
            <div v-for="news in filteredNews" :key="news.id"
              class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="p-6">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <i class="fa fa-newspaper-o text-blue-600 text-xl"></i>
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-3 mb-3">
                      <h3 class="text-base font-semibold text-slate-900 leading-tight hover:text-blue-600 transition-colors cursor-pointer flex-1 min-w-0 pr-2"
                        @click="openNewsModal(news)"
                        :title="news.title">
                        <span class="line-clamp-2">{{ news.title }}</span>
                      </h3>
                      <span class="flex-shrink-0 text-xs text-gray-500 whitespace-nowrap">
                        {{ formatDate(news.publishedAt) }}
                      </span>
                    </div>
                    
                    <p class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3" :title="news.description">
                      {{ news.description }}
                    </p>
                    
                    <div class="flex items-center justify-between flex-wrap gap-2">
                      <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-500">
                          {{ formatRelativeTime(news.publishedAt) }}
                        </span>
                      </div>
                      
                      <button @click="openNewsModal(news)"
                        class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
                        <span>查看详情</span>
                        <i class="fa fa-eye text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 无数据提示 -->
          <div v-if="filteredNews.length === 0" class="text-center py-12">
            <i class="fa fa-newspaper-o text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-500 mb-2">暂无新闻数据</h3>
            <p class="text-gray-400">当前筛选条件下没有找到相关新闻</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 新闻详情弹窗 -->
    <div v-if="selectedNews" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" @click.self="closeNewsModal">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 z-0 bg-white/40 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

        <!-- 弹窗容器 -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <!-- 弹窗内容 -->
        <div class="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full" @click.stop>
          <!-- 弹窗头部 -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ selectedNews.title }}
                </h3>
                <div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span class="flex items-center gap-1">
                    <i class="fa fa-calendar"></i>
                    {{ formatDate(selectedNews.publishedAt) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="fa fa-clock-o"></i>
                    {{ formatRelativeTime(selectedNews.publishedAt) }}
                  </span>
                </div>
              </div>
              <button type="button" @click="closeNewsModal" 
                class="ml-3 bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span class="sr-only">关闭</span>
                <i class="fa fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- 弹窗内容 -->
          <div class="bg-gray-50 px-4 py-5 sm:p-6">
            <div class="bg-white rounded-lg p-4">
              <h4 class="text-base font-medium text-gray-900 mb-3">新闻内容</h4>
              <div class="max-h-96 overflow-y-auto">
                <div class="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {{ selectedNews.description || '暂无详细内容' }}
                </div>
              </div>
            </div>
          </div>

          <!-- 弹窗底部 -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 sm:flex sm:flex-row-reverse sm:gap-3">
            <button type="button" @click="openOriginalLink(selectedNews.link)"
              class="w-full inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto transition-colors">
              <i class="fa fa-external-link"></i>
              查看原文
            </button>
            <button type="button" @click="closeNewsModal"
              class="mt-3 w-full inline-flex justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto transition-colors">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { fetchGovernmentNews, parseRSSData } from '@/api/government-news.js'

const newsData = ref(null)
const loading = ref(false)
const error = ref('')
const selectedNews = ref(null)
let refreshInterval = null

const fetchNewsData = async () => {
  try {
    loading.value = true
    error.value = ''

    // 调用后端接口获取RSS XML数据
    const rssData = await fetchGovernmentNews()
    
    // 前端解析RSS数据
    const parsedData = parseRSSData(rssData)
    
    newsData.value = Array.isArray(parsedData) ? parsedData : []

  } catch (err) {
    error.value = `获取新闻数据失败: ${err.message}`
    // 异常时不再使用模拟数据
    newsData.value = []
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchNewsData()
}

const formatUpdateTime = (date) => {
  try {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '未知时间'
  }
}

const formatDate = (date) => {
  try {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return '未知日期'
  }
}

const formatRelativeTime = (date) => {
  try {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`
    
    return formatDate(date)
  } catch {
    return '未知时间'
  }
}

const todayNewsCount = computed(() => {
  if (!newsData.value) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return newsData.value.filter(news => news.publishedAt >= today).length
})

const weekNewsCount = computed(() => {
  if (!newsData.value) return 0
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return newsData.value.filter(news => news.publishedAt >= weekAgo).length
})

const filteredNews = computed(() => {
  if (!newsData.value) return []
  return newsData.value
})

// 打开新闻详情弹窗
const openNewsModal = (news) => {
  selectedNews.value = news
  // 防止背景滚动
  document.body.style.overflow = 'hidden'
}

// 关闭新闻详情弹窗
const closeNewsModal = () => {
  selectedNews.value = null
  // 恢复背景滚动
  document.body.style.overflow = 'auto'
}

// 跳转到原文链接
const openOriginalLink = (link) => {
  window.open(link, '_blank', 'noopener,noreferrer')
}

onMounted(() => {
  fetchNewsData()
  refreshInterval = setInterval(() => {
    fetchNewsData()
  }, 10 * 60 * 1000) // 10 minutes
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

/* 确保flex布局中的文字溢出处理 */
.flex-1.min-w-0 {
  flex: 1;
  min-width: 0;
}

/* 新闻卡片布局优化 */
@media (max-width: 640px) {
  .flex.items-start.justify-between.gap-3 {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .flex.items-start.justify-between.gap-3 span {
    align-self: flex-start;
  }
}

/* 弹窗内容样式 */
.prose {
  max-width: none;
}

.prose p {
  margin: 0;
  line-height: 1.6;
}

/* 弹窗动画 */
.fixed.inset-0.z-50 {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.inline-block.align-bottom {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
