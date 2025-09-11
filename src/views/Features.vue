<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-5xl font-bold text-slate-900 mb-6">
          强大的
          <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI功能
          </span>
        </h1>
        <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          我们的TripGenie助手集成了最先进的AI技术和丰富的数据源，为你提供全方位的旅行规划服务
        </p>
      </div>
    </section>

    <!-- Core Features -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div class="text-6xl mb-6">🧠</div>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">智能对话理解</h2>
            <p class="text-lg text-slate-600 mb-6 leading-relaxed">
              基于先进的自然语言处理技术，我们的TripGenie助手能够准确理解你的旅行需求，识别目的地、时间、预算、偏好等关键信息。
            </p>
            <ul class="space-y-3">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                多轮对话上下文记忆
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                智能意图识别与提取
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                个性化推荐算法
              </li>
            </ul>
          </div>
          <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
            <div class="space-y-4">
              <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                    👤
                  </div>
                  <span class="font-medium">用户</span>
                </div>
                <p class="text-sm">"我想和朋友去日本旅行，预算1万，喜欢美食和文化"</p>
              </div>
              <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                    🤖
                  </div>
                  <span class="font-medium">AI助手</span>
                </div>
                <p class="text-sm">"太好了！根据你的需求，我推荐京都-大阪-东京的7日游路线，重点安排传统文化体验和美食探索..."</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div class="order-2 lg:order-1">
            <div class="bg-slate-900 rounded-3xl p-8 text-white">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-600 rounded-xl p-4 text-center">
                  <div class="text-2xl font-bold">50+</div>
                  <div class="text-sm opacity-80">API接口</div>
                </div>
                <div class="bg-purple-600 rounded-xl p-4 text-center">
                  <div class="text-2xl font-bold">1000+</div>
                  <div class="text-sm opacity-80">城市数据</div>
                </div>
                <div class="bg-green-600 rounded-xl p-4 text-center">
                  <div class="text-2xl font-bold">24/7</div>
                  <div class="text-sm opacity-80">实时更新</div>
                </div>
                <div class="bg-orange-600 rounded-xl p-4 text-center">
                  <div class="text-2xl font-bold">99.9%</div>
                  <div class="text-sm opacity-80">准确率</div>
                </div>
              </div>
            </div>
          </div>
          <div class="order-1 lg:order-2">
            <div class="text-6xl mb-6">🌐</div>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">多源数据整合</h2>
            <p class="text-lg text-slate-600 mb-6 leading-relaxed">
              整合天气、地图、住宿、景点、交通等多个数据源，确保为你提供最准确、最新的旅行信息。
            </p>
            <ul class="space-y-3">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                实时天气与气候数据
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                全球住宿价格比较
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                交通路线智能规划
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Advanced Features Grid -->
    <section class="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-slate-900 mb-4">高级功能特性</h2>
          <p class="text-xl text-slate-600">让你的旅行规划更智能、更贴心</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">交互式地铁图</h3>
            <p class="text-slate-600">提供香港地铁完整线路图，支持站点详情查询、换乘路径规划，实时展示票价和时长信息</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">预算智能分析</h3>
            <p class="text-slate-600">自动计算交通、住宿、餐饮、门票等各项费用，提供最优性价比方案</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">时间优化规划</h3>
            <p class="text-slate-600">基于地理位置和开放时间，智能安排行程顺序，最大化游玩效率</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">天气适应建议</h3>
            <p class="text-slate-600">根据目的地天气情况，推荐合适的活动和必备物品清单</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">群组旅行支持</h3>
            <p class="text-slate-600">支持多人旅行规划，考虑不同成员的需求和偏好，制定平衡方案</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">风险预警系统</h3>
            <p class="text-slate-600">实时监控目的地安全状况、自然灾害等风险因素，确保旅行安全</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">攻略导出分享</h3>
            <p class="text-slate-600">支持PDF导出、微信分享、在线协作编辑等多种方式分享你的旅行计划</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-6">体验最智能的旅行规划</h2>
        <p class="text-xl text-blue-100 mb-8">现在就开始与我们的AI助手对话，获取你的专属旅游攻略</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
            免费体验
          </button>
          <button
            class="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors">
            查看定价
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>
