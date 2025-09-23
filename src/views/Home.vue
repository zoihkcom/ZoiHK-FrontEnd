<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <section class="pt-50 mb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="pt-20 pb-32 grid lg:grid-cols-2 gap-20 items-center">
          <!-- Hero Text -->
          <div class="text-center lg:text-left space-y-4">
            <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">SmartHK Home</p>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              SmartHK
              <br>
              <span class="whitespace-nowrap">让香港生活更加智能便捷</span>
            </h1>
            <p class="mt-6 text-xl text-slate-600 max-w-xl leading-relaxed">
              香港智能生活助手，提供实时交通、天气、生活设施等信息，让您的香港生活更便捷
              <br>
              <span class="text-lg font-medium text-blue-600 mt-2 block">在香港，一个"Smart HK"就够了！</span>
            </p>
            <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                class="group inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                <span>开始智能生活</span>
                <svg class="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                class="group inline-flex items-center justify-center px-8 py-4 bg-slate-100 text-blue-600 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200">
                <svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10,8 16,12 10,16" fill="currentColor" />
                </svg>
                <span>观看演示</span>
              </button>
            </div>
          </div>

          <!-- Hero Visual -->
          <div class="flex justify-center lg:justify-end">
            <div class="relative">
              <!-- Floating Elements -->
              <div class="absolute -top-4 -left-4 w-20 h-20 bg-blue-100 rounded-2xl rotate-12 opacity-60 animate-pulse">
              </div>
              <div class="absolute -bottom-6 -right-6 w-16 h-16 bg-purple-100 rounded-full opacity-40 animate-bounce"
                style="animation-delay: 1s;"></div>
              <div class="absolute top-1/2 -left-8 w-12 h-12 bg-pink-100 rounded-lg rotate-45 opacity-50 animate-pulse"
                style="animation-delay: 2s;"></div>

              <!-- Main Phone Mockup -->
              <div
                class="relative z-10 w-80 h-[700px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-[2.5rem] p-2 shadow-2xl">
                <!-- Phone Frame Highlights -->
                <div class="absolute inset-2 rounded-[2rem] bg-gradient-to-b from-slate-700 to-slate-900 opacity-30">
                </div>

                <!-- Screen -->
                <div class="relative w-full h-full bg-white rounded-[2rem] p-6 pt-12 overflow-hidden">
                  <!-- Status Bar -->
                  <div class="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-slate-300 rounded-full">
                  </div>

                  <!-- App Header -->
                  <div class="flex items-center justify-between mb-6 mt-2">
                    <div class="flex items-center space-x-2">
                      <img src="../assets/logo.png" alt="SmartHK" class="w-8 h-8 object-contain">
                      <span class="text-lg font-semibold text-slate-900">SmartHK</span>
                    </div>
                    <div class="flex space-x-1">
                      <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
                      <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
                    </div>
                  </div>

                  <!-- Chat Messages -->
                  <div class="space-y-3 mb-6 h-[420px] overflow-y-hidden pb-4">
                    <!-- Welcome Message -->
                    <div class="flex items-start space-x-3 animate-fadeInUp">
                      <div
                        class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm text-white font-bold">
                        AI
                      </div>
                      <div
                        class="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl rounded-tl-md px-3 py-2 max-w-xs shadow-sm">
                        <p class="text-sm text-slate-700">🎉 欢迎使用SmartHK助手！</p>
                        <p class="text-sm text-slate-700 mt-1">我可以帮你查询香港生活信息 🏙️</p>
                      </div>
                    </div>

                    <!-- User Query -->
                    <div class="flex items-start justify-end space-x-3 animate-fadeInUp animation-delay-300">
                      <div
                        class="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-md px-3 py-2 max-w-xs shadow-lg">
                        <p class="text-sm">请帮我查询从中环到尖沙咀的地铁路线和实时到站时间</p>
                      </div>
                      <div
                        class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-sm">
                        👤
                      </div>
                    </div>

                    <!-- AI Thinking -->
                    <div class="flex items-start space-x-3 animate-fadeInUp animation-delay-600">
                      <div
                        class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm text-white font-bold">
                        AI
                      </div>
                      <div
                        class="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl rounded-tl-md px-3 py-2 max-w-xs shadow-sm">
                        <div class="flex items-center space-x-2">
                          <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s;">
                            </div>
                            <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s;">
                            </div>
                          </div>
                          <span class="text-xs text-slate-500">正在分析您的需求...</span>
                        </div>
                      </div>
                    </div>

                    <!-- AI Response -->
                    <div class="flex items-start space-x-3 animate-fadeInUp animation-delay-900">
                      <div
                        class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm text-white font-bold">
                        AI
                      </div>
                      <div
                        class="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl rounded-tl-md px-3 py-2 max-w-xs shadow-sm">
                        <p class="text-sm text-slate-700 mb-2">🚇 为您找到最佳路线：</p>
                        <div class="space-y-1 text-xs text-slate-600">
                          <div class="flex items-center space-x-1">
                            <span>🚊</span>
                            <span>荃湾线：中环→金钟→尖沙咀</span>
                          </div>
                          <div class="flex items-center space-x-1">
                            <span>⏱️</span>
                            <span>预计时间：8分钟</span>
                          </div>
                          <div class="flex items-center space-x-1">
                            <span>🚇</span>
                            <span>下班车：2分钟后到达</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="flex items-start space-x-3 animate-fadeInUp animation-delay-1200">
                      <div
                        class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm text-white font-bold">
                        AI
                      </div>
                      <div class="space-y-1">
                        <div
                          class="bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer shadow-sm">
                          🗺️ 查看地铁地图
                        </div>
                        <div
                          class="bg-white border border-green-200 rounded-lg px-3 py-2 text-xs text-green-600 hover:bg-green-50 transition-colors cursor-pointer shadow-sm">
                          🚌 查看巴士路线
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Input Area -->
                  <div class="absolute bottom-6 left-4 right-4">
                    <div class="bg-slate-50 rounded-full px-4 py-3 flex items-center space-x-3 shadow-inner">
                      <div class="flex-1 flex items-center space-x-2">
                        <span class="text-xs text-slate-400">继续对话...</span>
                        <div class="w-1 h-4 bg-blue-500 animate-pulse rounded"></div>
                      </div>
                      <div
                        class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Phone Reflection -->
                <div
                  class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[2.5rem] pointer-events-none">
                </div>
              </div>

              <!-- Floating Info Cards -->
              <div
                class="absolute -right-46 top-20 bg-white rounded-xl p-4 shadow-lg border border-slate-100 animate-fadeInUp animation-delay-1500 hidden xl:block">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-slate-900">实时数据</div>
                    <div class="text-xs text-slate-500">99.9% 准确率</div>
                  </div>
                </div>
              </div>

              <div
                class="absolute -left-38 top-64 bg-white rounded-xl p-4 shadow-lg border border-slate-100 animate-fadeInUp animation-delay-1800 hidden xl:block">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-slate-900">AI智能</div>
                    <div class="text-xs text-slate-500">秒级响应</div>
                  </div>
                </div>
              </div>

              <div
                class="absolute -right-30 -bottom-16 bg-white rounded-xl p-4 shadow-lg border border-slate-100 animate-fadeInUp animation-delay-2100 hidden xl:block">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-slate-900">个性化</div>
                    <div class="text-xs text-slate-500">定制专属</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-32 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-4xl font-bold text-slate-900 tracking-tight">为什么选择SmartHK</h2>
          <p class="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            整合香港政府开放数据，提供最全面的智能生活服务
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div
            class="feature-card bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <div class="text-5xl mb-6">🧠</div>
            <h3 class="text-xl font-semibold text-slate-900 mb-3">AI智能助手</h3>
            <p class="text-slate-600 leading-relaxed">自然语言查询香港生活信息，智能理解您的需求</p>
          </div>

          <div
            class="feature-card bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <div class="text-5xl mb-6">🚇</div>
            <h3 class="text-xl font-semibold text-slate-900 mb-3">地铁路线图</h3>
            <p class="text-slate-600 leading-relaxed">香港地铁交互式线路图，站点查询，路径规划一键搞定</p>
          </div>

          <div
            class="feature-card bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <div class="text-5xl mb-6">🗺️</div>
            <h3 class="text-xl font-semibold text-slate-900 mb-3">生活信息</h3>
            <p class="text-slate-600 leading-relaxed">天气、空气质量、生活设施等全方位信息服务</p>
          </div>

          <div
            class="feature-card bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <div class="text-5xl mb-6">💰</div>
            <h3 class="text-xl font-semibold text-slate-900 mb-3">交通出行</h3>
            <p class="text-slate-600 leading-relaxed">地铁、巴士实时信息，最优路线规划</p>
          </div>

          <div
            class="feature-card bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <div class="text-5xl mb-6">🌐</div>
            <h3 class="text-xl font-semibold text-slate-900 mb-3">政府数据</h3>
            <p class="text-slate-600 leading-relaxed">整合香港政府开放数据，确保信息权威准确</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="py-32 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-4xl font-bold text-slate-900 tracking-tight">简单三步，智能生活</h2>
        </div>

        <div class="space-y-16">
          <div class="step flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div
              class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              1
            </div>
            <div class="text-center lg:text-left">
              <h3 class="text-2xl font-semibold text-slate-900 mb-3">提出问题</h3>
              <p class="text-lg text-slate-600 leading-relaxed">询问交通路线、天气情况、生活设施等任何香港生活问题</p>
            </div>
          </div>

          <div class="step flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div
              class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              2
            </div>
            <div class="text-center lg:text-left">
              <h3 class="text-2xl font-semibold text-slate-900 mb-3">智能查询</h3>
              <p class="text-lg text-slate-600 leading-relaxed">AI助手智能理解您的问题，从政府数据库中查找准确信息</p>
            </div>
          </div>

          <div class="step flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div
              class="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              3
            </div>
            <div class="text-center lg:text-left">
              <h3 class="text-2xl font-semibold text-slate-900 mb-3">获得答案</h3>
              <p class="text-lg text-slate-600 leading-relaxed">获得准确实时的信息回复，让您的香港生活更便捷</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-32 bg-gradient-to-r from-slate-900 to-slate-800 text-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-6 tracking-tight">开始您的智能香港生活</h2>
        <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">让SmartHK助手为您提供便捷的香港生活服务</p>
        <button
          class="group inline-flex items-center justify-center px-10 py-5 bg-blue-600 text-white font-semibold text-lg rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
          立即体验
          <svg class="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

onMounted(() => {
  // 添加滚动动画观察器
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, observerOptions)

  // 观察需要动画的元素
  document.querySelectorAll('.feature-card, .step').forEach(el => {
    observer.observe(el)
  })
})
</script>

<style scoped>
/* 自定义动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animation-delay-300 {
  animation-delay: 300ms;
  opacity: 0;
}

.animation-delay-600 {
  animation-delay: 600ms;
  opacity: 0;
}

/* 滚动触发动画 */
.feature-card,
.step {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.feature-card.animate-in,
.step.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 悬停效果增强 */
.feature-card:hover {
  transform: translateY(-8px) !important;
}
</style>
