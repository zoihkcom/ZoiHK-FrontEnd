<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center space-y-3">
        <p class="text-sm font-medium text-blue-600 uppercase tracking-[0.3em]">About TripGenie</p>
        <h1 class="text-4xl sm:text-5xl font-bold text-slate-900">关于 TripGenie</h1>
        <p class="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
          我们致力于用AI技术重新定义旅行规划体验，让每一次旅行都成为完美的回忆
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-3xl font-bold text-slate-900 mb-6">我们的使命</h2>
            <p class="text-lg text-slate-600 mb-6 leading-relaxed">
              在这个信息爆炸的时代，规划一次完美的旅行变得越来越复杂。我们相信，通过人工智能的力量，可以让旅行规划变得简单、智能、个性化。
            </p>
            <p class="text-lg text-slate-600 leading-relaxed">
              TripGenie不仅仅是一个工具，更是你的专属旅行顾问。我们整合了全球最新的旅游数据，运用先进的AI技术，为每一位用户量身定制最适合的旅行方案。
            </p>
          </div>
          <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
            <div class="grid grid-cols-2 gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold mb-2">500K+</div>
                <div class="text-blue-100">用户信赖</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold mb-2">1M+</div>
                <div class="text-blue-100">攻略生成</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold mb-2">200+</div>
                <div class="text-blue-100">覆盖国家</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold mb-2">4.8/5</div>
                <div class="text-blue-100">用户评分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-slate-900 mb-4">我们的价值观</h2>
          <p class="text-xl text-slate-600">指导我们前进的核心理念</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-3">创新驱动</h3>
            <p class="text-slate-600 leading-relaxed">
              持续探索AI技术的前沿应用，不断优化用户体验，让科技真正服务于美好旅行
            </p>
          </div>
          
          <div class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-3">用户至上</h3>
            <p class="text-slate-600 leading-relaxed">
              以用户需求为核心，倾听每一个反馈，致力于创造最贴心、最实用的旅行规划服务
            </p>
          </div>
          
          <div class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-3">品质保证</h3>
            <p class="text-slate-600 leading-relaxed">
              严格把控数据质量和服务标准，确保每一份攻略都经过精心核验，值得信赖
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-slate-900 mb-4">团队介绍</h2>
          <p class="text-xl text-slate-600">由行业专家组成的专业团队</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
              AI
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">AI技术团队</h3>
            <p class="text-slate-600 mb-4">来自顶尖科技公司的AI工程师，专注于自然语言处理和推荐算法优化</p>
            <div class="text-sm text-blue-600">深度学习 • NLP • 推荐系统</div>
          </div>
          
          <div class="text-center">
            <div class="w-32 h-32 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
              旅
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">旅游专家团队</h3>
            <p class="text-slate-600 mb-4">资深旅游行业专家，拥有丰富的全球旅游规划经验和深度文化理解</p>
            <div class="text-sm text-green-600">目的地专家 • 文化顾问 • 行程规划师</div>
          </div>
          
          <div class="text-center">
            <div class="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
              技
            </div>
            <h3 class="text-xl font-semibold text-slate-900 mb-2">技术开发团队</h3>
            <p class="text-slate-600 mb-4">经验丰富的全栈开发工程师，致力于打造稳定可靠的技术架构</p>
            <div class="text-sm text-orange-600">前端开发 • 后端架构 • 移动端</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-slate-900 mb-4">发展历程</h2>
          <p class="text-xl text-slate-600">从想法到现实的创新之路</p>
        </div>
        
        <div class="space-y-8">
          <div class="flex items-center">
            <div class="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-6">
              1
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm flex-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibold text-slate-900">项目启动</h3>
                <span class="text-sm text-slate-500">2023年1月</span>
              </div>
              <p class="text-slate-600">团队组建，确定产品方向，开始市场调研和技术预研</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-6">
              2
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm flex-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibold text-slate-900">MVP开发</h3>
                <span class="text-sm text-slate-500">2023年6月</span>
              </div>
              <p class="text-slate-600">完成最小可行产品开发，集成基础AI对话和攻略生成功能</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-6">
              3
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm flex-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibent text-slate-900">公测上线</h3>
                <span class="text-sm text-slate-500">2024年1月</span>
              </div>
              <p class="text-slate-600">正式对外公测，获得首批用户积极反馈，迭代优化产品功能</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="flex-shrink-0 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold mr-6">
              4
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm flex-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibold text-slate-900">地铁图功能上线</h3>
                <span class="text-sm text-slate-500">2024年8月</span>
              </div>
              <p class="text-slate-600">推出香港地铁交互式线路图功能，支持站点查询和路径规划，提升用户交通出行体验</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="flex-shrink-0 w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-6">
              5
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm flex-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibold text-slate-900">持续发展</h3>
                <span class="text-sm text-slate-500">现在</span>
              </div>
              <p class="text-slate-600">不断完善产品功能，扩大用户规模，致力于成为最智能的旅行规划平台</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-slate-900 mb-6">联系我们</h2>
        <p class="text-xl text-slate-600 mb-10">
          有任何问题或建议？我们很乐意听到你的声音
        </p>
        
        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-slate-900 mb-2">邮箱联系</h3>
            <p class="text-slate-600">contact@tripgenie.ai</p>
          </div>
          
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-slate-900 mb-2">办公地址</h3>
            <p class="text-slate-600">北京市朝阳区创新大厦</p>
          </div>
          
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-slate-900 mb-2">在线客服</h3>
            <p class="text-slate-600">7×24小时服务</p>
          </div>
        </div>
        
        <button class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
          开始智能旅行规划
        </button>
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
