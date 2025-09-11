<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl font-bold text-slate-900 mb-6">
          选择适合你的
          <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            服务方案
          </span>
        </h1>
        <p class="text-xl text-slate-600 leading-relaxed">
          无论是个人旅行还是商业用途，我们都有合适的方案满足你的需求
        </p>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
          
          <!-- 免费版 -->
          <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative">
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-slate-900 mb-2">免费体验</h3>
              <p class="text-slate-600 mb-6">适合偶尔旅行的个人用户</p>
              <div class="mb-6">
                <span class="text-4xl font-bold text-slate-900">¥0</span>
                <span class="text-slate-600">/月</span>
              </div>
              <button class="w-full py-3 px-6 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-colors">
                开始免费体验
              </button>
            </div>
            
            <ul class="space-y-4">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                每月5次AI对话
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                基础旅游攻略生成
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                天气信息查询
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                标准邮件支持
              </li>
              <li class="flex items-center text-slate-400">
                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                </svg>
                高级功能受限
              </li>
            </ul>
          </div>

          <!-- 专业版 -->
          <div class="bg-white rounded-3xl p-8 shadow-lg border-2 border-blue-500 relative transform scale-105">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                最受欢迎
              </span>
            </div>
            
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-slate-900 mb-2">专业版</h3>
              <p class="text-slate-600 mb-6">适合经常旅行的用户</p>
              <div class="mb-6">
                <span class="text-4xl font-bold text-blue-600">¥29</span>
                <span class="text-slate-600">/月</span>
              </div>
              <button class="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                选择专业版
              </button>
            </div>
            
            <ul class="space-y-4">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                无限AI对话次数
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                高级旅游攻略生成
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                实时价格比较
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                PDF攻略导出
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                优先客服支持
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                多平台同步
              </li>
            </ul>
          </div>

          <!-- 企业版 -->
          <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative">
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-slate-900 mb-2">企业定制</h3>
              <p class="text-slate-600 mb-6">适合旅行社和企业用户</p>
              <div class="mb-6">
                <span class="text-4xl font-bold text-slate-900">¥199</span>
                <span class="text-slate-600">/月</span>
              </div>
              <button class="w-full py-3 px-6 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors">
                联系销售
              </button>
            </div>
            
            <ul class="space-y-4">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                API接口访问
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                批量攻略生成
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                白标定制服务
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                数据分析报告
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                专属客户经理
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                SLA服务保障
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Comparison -->
    <section class="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">功能对比</h2>
          <p class="text-lg text-slate-600">详细了解各版本功能差异</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-6 py-4 text-left font-semibold text-slate-900">功能特性</th>
                  <th class="px-6 py-4 text-center font-semibold text-slate-900">免费版</th>
                  <th class="px-6 py-4 text-center font-semibold text-blue-600">专业版</th>
                  <th class="px-6 py-4 text-center font-semibold text-slate-900">企业版</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr>
                  <td class="px-6 py-4 font-medium">AI对话次数</td>
                  <td class="px-6 py-4 text-center">5次/月</td>
                  <td class="px-6 py-4 text-center text-blue-600 font-semibold">无限制</td>
                  <td class="px-6 py-4 text-center">无限制</td>
                </tr>
                <tr class="bg-slate-25">
                  <td class="px-6 py-4 font-medium">攻略生成质量</td>
                  <td class="px-6 py-4 text-center">基础</td>
                  <td class="px-6 py-4 text-center text-blue-600 font-semibold">高级</td>
                  <td class="px-6 py-4 text-center">企业级</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 font-medium">价格比较功能</td>
                  <td class="px-6 py-4 text-center">
                    <svg class="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                    </svg>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                  </td>
                </tr>
                <tr class="bg-slate-25">
                  <td class="px-6 py-4 font-medium">PDF导出</td>
                  <td class="px-6 py-4 text-center">
                    <svg class="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                    </svg>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td class="px-6 py-4 font-medium">API访问</td>
                  <td class="px-6 py-4 text-center">
                    <svg class="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                    </svg>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <svg class="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                    </svg>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <svg class="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                  </td>
                </tr>
                <tr class="bg-slate-25">
                  <td class="px-6 py-4 font-medium">客服支持</td>
                  <td class="px-6 py-4 text-center text-sm">邮件支持</td>
                  <td class="px-6 py-4 text-center text-sm">优先支持</td>
                  <td class="px-6 py-4 text-center text-sm">专属经理</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">常见问题</h2>
          <p class="text-lg text-slate-600">关于定价和功能的常见疑问解答</p>
        </div>
        
        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 class="font-semibold text-slate-900 mb-2">免费版有什么限制吗？</h3>
            <p class="text-slate-600">免费版每月限制5次AI对话，只能生成基础版旅游攻略，不支持价格比较和PDF导出功能。适合偶尔旅行的用户体验使用。</p>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 class="font-semibold text-slate-900 mb-2">可以随时升级或降级吗？</h3>
            <p class="text-slate-600">是的，你可以随时升级或降级你的套餐。升级立即生效，降级将在下个计费周期生效。未使用的费用会按比例退还。</p>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 class="font-semibold text-slate-900 mb-2">企业版提供哪些定制服务？</h3>
            <p class="text-slate-600">企业版提供API接口、白标定制、批量处理、数据分析等服务，还包括专属客户经理和SLA服务保障。具体需求请联系我们的销售团队。</p>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 class="font-semibold text-slate-900 mb-2">支付安全有保障吗？</h3>
            <p class="text-slate-600">我们使用业界标准的SSL加密和安全支付网关，支持支付宝、微信支付、信用卡等多种付款方式，确保你的支付信息安全。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-6">准备开始你的智能旅行了吗？</h2>
        <p class="text-xl text-slate-300 mb-10">选择适合你的方案，立即体验AI驱动的个性化旅游规划</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            免费开始体验
          </button>
          <button class="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-slate-900 transition-colors">
            联系销售咨询
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
