<template>
  <nav class="fixed top-0 left-0 right-0 z-[1010] bg-white/80 backdrop-blur-md border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2 sm:space-x-3">
            <img src="../assets/logo.png" alt="SmartHK" class="h-8 sm:h-9 md:h-10 w-auto object-contain" />
            <span class="text-base sm:text-lg md:text-xl font-semibold text-gray-900 whitespace-nowrap">SmartHK</span>
          </router-link>
        </div>

        <!-- Desktop Navigation (Centered) -->
        <div class="hidden md:flex items-center space-x-10">
          <router-link to="/" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            <div class="flex flex-col items-center">
              <span>首页</span>
              <span class="text-xs text-gray-500">Home</span>
            </div>
          </router-link>
          <router-link to="/datahub" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            <div class="flex flex-col items-center">
              <span>信息中心</span>
              <span class="text-xs text-gray-500">Data Hub</span>
            </div>
          </router-link>

          <!-- City & Transit Dropdown -->
          <div class="relative">
            <button @click="toggleDropdown(cityTransitOpen ? '' : 'cityTransit')"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
              <div class="flex flex-col items-center">
                <span>城市与出行</span>
                <span class="text-xs text-gray-500">City & Transit</span>
              </div>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': cityTransitOpen }" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div v-show="cityTransitOpen"
              class="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200 z-[1001]">
              <div class="p-2">
                <router-link to="/weather"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-cloud w-4 text-blue-500"></i>
                  <div>
                    <div class="font-medium">天气与预警</div>
                    <div class="text-xs text-gray-500">HKO Open Data</div>
                  </div>
                </router-link>

                <router-link to="/air-quality"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-leaf w-4 text-green-500"></i>
                  <div>
                    <div class="font-medium">空气质量</div>
                    <div class="text-xs text-gray-500">AQHI</div>
                  </div>
                </router-link>

                <router-link to="/immigration"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-plane w-4 text-purple-500"></i>
                  <div>
                    <div class="font-medium">口岸等候</div>
                    <div class="text-xs text-gray-500">ImmD</div>
                  </div>
                </router-link>

                <div class="border-t border-gray-100 my-2"></div>

                <div class="px-3 py-1">
                  <div class="text-xs font-medium text-gray-500 mb-2">导航规划</div>
                </div>

                <router-link to="/route-planner"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-location-arrow w-4 text-green-500"></i>
                  <div>
                    <div class="font-medium">路线规划</div>
                    <div class="text-xs text-gray-500">高德地图导航</div>
                  </div>
                </router-link>

                <div class="border-t border-gray-100 my-2"></div>

                <div class="px-3 py-1">
                  <div class="text-xs font-medium text-gray-500 mb-2">公共交通</div>
                </div>

                <router-link to="/subway"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-subway w-4 text-red-500"></i>
                  <div>
                    <div class="font-medium">MTR地铁</div>
                    <div class="text-xs text-gray-500">实时到站</div>
                  </div>
                </router-link>

                <router-link to="/bus-routes"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-bus w-4 text-blue-500"></i>
                  <div>
                    <div class="font-medium">九龙巴士 KMB</div>
                    <div class="text-xs text-gray-500">路线与ETA</div>
                  </div>
                </router-link>

                <router-link to="/citybus-routes"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-bus w-4 text-orange-500"></i>
                  <div>
                    <div class="font-medium">城巴 Citybus</div>
                    <div class="text-xs text-gray-500">路线与ETA</div>
                  </div>
                </router-link>

                <router-link to="/minibus-routes"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-bus w-4 text-green-600"></i>
                  <div>
                    <div class="font-medium">专线小巴 Minibus</div>
                    <div class="text-xs text-gray-500">路线与站点</div>
                  </div>
                </router-link>

                <router-link to="/cctv"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-video-camera w-4 text-gray-500"></i>
                  <div>
                    <div class="font-medium">交通CCTV</div>
                    <div class="text-xs text-gray-500">实时监控</div>
                  </div>
                </router-link>

                <div class="border-t border-gray-100 my-2"></div>

                <router-link to="/flight"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-plane w-4 text-indigo-500"></i>
                  <div>
                    <div class="font-medium">航班信息</div>
                    <div class="text-xs text-gray-500">到港离港查询</div>
                  </div>
                </router-link>

                <router-link to="/uber"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-car w-4 text-yellow-500"></i>
                  <div>
                    <div class="font-medium">打车服务</div>
                    <div class="text-xs text-gray-500">Uber & 出租车</div>
                  </div>
                </router-link>

                <div class="border-t border-gray-100 my-2"></div>

                <div class="px-3 py-1">
                  <div class="text-xs font-medium text-gray-500 mb-2">停车服务</div>
                </div>

                <router-link to="/carparks"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-car w-4 text-purple-500"></i>
                  <div>
                    <div class="font-medium">停车场信息</div>
                    <div class="text-xs text-gray-500">车位与收费</div>
                  </div>
                </router-link>

                <router-link to="/metered-parking"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-clock-o w-4 text-amber-500"></i>
                  <div>
                    <div class="font-medium">咪錶停车位</div>
                    <div class="text-xs text-gray-500">街边计时停车</div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Facilities & Nearby Dropdown -->
          <div class="relative">
            <button @click="toggleDropdown(facilitiesOpen ? '' : 'facilities')"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
              <div class="flex flex-col items-center">
                <span>生活设施与附近</span>
                <span class="text-xs text-gray-500">Facilities & Nearby</span>
              </div>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': facilitiesOpen }" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div v-show="facilitiesOpen"
              class="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200 z-[1001]">
              <div class="p-2">
                <router-link to="/wifi"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-wifi w-4 text-blue-500"></i>
                  <div>
                    <div class="font-medium">WiFi热点</div>
                    <div class="text-xs text-gray-500">免费WiFi位置</div>
                  </div>
                </router-link>

                <router-link to="/ferry-piers"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-ship w-4 text-indigo-500"></i>
                  <div>
                    <div class="font-medium">渡轮码头</div>
                    <div class="text-xs text-gray-500">六大码头位置</div>
                  </div>
                </router-link>

                <router-link to="/schools"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-graduation-cap w-4 text-green-500"></i>
                  <div>
                    <div class="font-medium">学校信息</div>
                    <div class="text-xs text-gray-500">学校位置与详情</div>
                  </div>
                </router-link>

                <router-link to="/heritage/monuments"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-university w-4 text-rose-500"></i>
                  <div>
                    <div class="font-medium">法定古迹</div>
                    <div class="text-xs text-gray-500">Monuments</div>
                  </div>
                </router-link>

                <router-link to="/fehd"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-map-marker w-4 text-orange-500"></i>
                  <div>
                    <div class="font-medium">环境卫生设施</div>
                    <div class="text-xs text-gray-500">公厕、市场等</div>
                  </div>
                </router-link>

                <router-link to="/hospital"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-hospital-o w-4 text-red-500"></i>
                  <div>
                    <div class="font-medium">医院信息</div>
                    <div class="text-xs text-gray-500">医疗机构查询</div>
                  </div>
                </router-link>

                <router-link to="/water-dispensers"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-tint w-4 text-cyan-500"></i>
                  <div>
                    <div class="font-medium">饮水机位置</div>
                    <div class="text-xs text-gray-500">公共饮水设施</div>
                  </div>
                </router-link>

                <router-link to="/swimming-pools"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-life-ring w-4 text-sky-500"></i>
                  <div>
                    <div class="font-medium">泳池设施</div>
                    <div class="text-xs text-gray-500">Swimming Pools</div>
                  </div>
                </router-link>

                <router-link to="/aed"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-heartbeat w-4 text-red-500"></i>
                  <div>
                    <div class="font-medium">AED 急救设备</div>
                    <div class="text-xs text-gray-500">自动体外除颤器</div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Events & Tickets Dropdown -->
          <div class="relative">
            <button @click="toggleDropdown(eventsOpen ? '' : 'events')"
              class="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
              <div class="flex flex-col items-center">
                <span>活动与票务</span>
                <span class="text-xs text-gray-500">Events & Tickets</span>
              </div>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': eventsOpen }" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div v-show="eventsOpen"
              class="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200 z-[1001]">
              <div class="p-2">
                <router-link to="/tickets"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-ticket w-4 text-pink-500"></i>
                  <div>
                    <div class="font-medium">URBTIX 票务</div>
                    <div class="text-xs text-gray-500">按日期查询票务</div>
                  </div>
                </router-link>
                <!-- <router-link to="/events"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-calendar w-4 text-pink-500"></i>
                  <div>
                    <div class="font-medium">政府活动</div>
                    <div class="text-xs text-gray-500">节庆、表演、展览等</div>
                  </div>
                </router-link> -->

                <router-link to="/holidays"
                  class="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <i class="fa fa-calendar-check-o w-4 text-red-500"></i>
                  <div>
                    <div class="font-medium">活动日历</div>
                    <div class="text-xs text-gray-500">公共假期与活动</div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <router-link to="/chat" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            <div class="flex flex-col items-center">
              <span>AI</span>
              <span class="text-xs text-gray-500">Assistant</span>
            </div>
          </router-link>
        </div>

        <!-- Right side controls -->
        <div class="flex items-center space-x-3">
          <!-- Language Selector -->
          <div class="hidden md:block relative">
            <button @click="toggleDropdown(languageOpen ? '' : 'language')"
              class="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-gray-50">
              <i class="fa fa-globe w-4"></i>
              <span class="text-sm">中文</span>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': languageOpen }" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Language Dropdown -->
            <div v-show="languageOpen"
              class="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200 z-[1001]">
              <div class="p-2">
                <button
                  class="flex items-center w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left">
                  <div>
                    <div class="font-medium">中文简体</div>
                    <div class="text-xs text-gray-500">Simplified Chinese</div>
                  </div>
                </button>
                <button
                  class="flex items-center w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left">
                  <div>
                    <div class="font-medium">中文繁體</div>
                    <div class="text-xs text-gray-500">Traditional Chinese</div>
                  </div>
                </button>
                <button
                  class="flex items-center w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left">
                  <div>
                    <div class="font-medium">English</div>
                    <div class="text-xs text-gray-500">英语</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Login/Register Buttons -->
          <div class="hidden md:flex items-center space-x-2">
            <button
              class="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-gray-50 text-sm">
              登录
            </button>
            <button
              class="px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
              注册
            </button>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button @click="isOpen = !isOpen" class="text-gray-700 hover:text-blue-600 focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-show="isOpen" class="md:hidden bg-white border-t border-gray-200 max-h-[80vh] overflow-y-auto">
      <div class="px-4 pt-2 pb-4 space-y-2">
        <router-link to="/" @click="isOpen = false"
          class="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium transition-colors">
          首页
        </router-link>
        <router-link to="/datahub" @click="isOpen = false"
          class="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium transition-colors">
          信息中心
        </router-link>

        <!-- Mobile City & Transit Section -->
        <div class="border-t border-gray-100 pt-2 mt-2">
          <div class="px-3 py-2">
            <div class="text-sm font-semibold text-gray-900 mb-2">城市与出行 City & Transit</div>
          </div>

          <router-link to="/weather" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-cloud w-4 text-blue-500 mr-2"></i>天气与预警
          </router-link>
          <router-link to="/air-quality" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-leaf w-4 text-green-500 mr-2"></i>空气质量
          </router-link>
          <router-link to="/immigration" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-plane w-4 text-purple-500 mr-2"></i>口岸等候
          </router-link>

          <div class="px-6 py-1 mt-2">
            <div class="text-xs font-medium text-gray-500">导航规划</div>
          </div>
          <router-link to="/route-planner" @click="isOpen = false"
            class="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-location-arrow w-4 text-green-500 mr-2"></i>路线规划
          </router-link>

          <div class="px-6 py-1 mt-2">
            <div class="text-xs font-medium text-gray-500">公共交通</div>
          </div>
          <router-link to="/subway" @click="isOpen = false"
            class="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-subway w-4 text-red-500 mr-2"></i>MTR地铁
          </router-link>
          <router-link to="/bus-routes" @click="isOpen = false"
            class="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-bus w-4 text-blue-500 mr-2"></i>九龙巴士 KMB
          </router-link>
          <router-link to="/citybus-routes" @click="isOpen = false"
            class="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-bus w-4 text-orange-500 mr-2"></i>城巴 Citybus
          </router-link>
          <router-link to="/minibus-routes" @click="isOpen = false"
            class="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-bus w-4 text-green-600 mr-2"></i>专线小巴 Minibus
          </router-link>
          <router-link to="/cctv" @click="isOpen = false"
            class="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-video-camera w-4 text-gray-500 mr-2"></i>交通CCTV
          </router-link>

          <div class="px-6 py-1 mt-2">
            <div class="text-xs font-medium text-gray-500">航空出行</div>
          </div>
          <router-link to="/flight" @click="isOpen = false"
            class="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-plane w-4 text-indigo-500 mr-2"></i>航班信息
          </router-link>
          <router-link to="/uber" @click="isOpen = false"
            class="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-car w-4 text-yellow-500 mr-2"></i>打车服务
          </router-link>

          <div class="px-6 py-1 mt-2">
            <div class="text-xs font-medium text-gray-500">停车服务</div>
          </div>
          <router-link to="/carparks" @click="isOpen = false"
            class="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-car w-4 text-purple-500 mr-2"></i>停车场信息
          </router-link>
          <router-link to="/metered-parking" @click="isOpen = false"
            class="block px-8 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-clock-o w-4 text-amber-500 mr-2"></i>咪錶停车位
          </router-link>
        </div>

        <!-- Mobile Facilities & Nearby Section -->
        <div class="border-t border-gray-100 pt-2 mt-2">
          <div class="px-3 py-2">
            <div class="text-sm font-semibold text-gray-900 mb-2">生活设施与附近 Facilities & Nearby</div>
          </div>

          <router-link to="/wifi" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-wifi w-4 text-blue-500 mr-2"></i>WiFi热点
          </router-link>
          <router-link to="/ferry-piers" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-ship w-4 text-indigo-500 mr-2"></i>渡轮码头
          </router-link>
          <router-link to="/schools" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-graduation-cap w-4 text-green-500 mr-2"></i>学校信息
          </router-link>
          <router-link to="/fehd" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-map-marker w-4 text-orange-500 mr-2"></i>环境卫生设施
          </router-link>
          <router-link to="/heritage/monuments" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-university w-4 text-rose-500 mr-2"></i>法定古蹟
          </router-link>
          <router-link to="/hospital" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-hospital-o w-4 text-red-500 mr-2"></i>医院信息
          </router-link>
          <router-link to="/water-dispensers" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-tint w-4 text-cyan-500 mr-2"></i>饮水机位置
          </router-link>
          <router-link to="/swimming-pools" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-life-ring w-4 text-sky-500 mr-2"></i>泳池设施
          </router-link>
          <router-link to="/aed" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-heartbeat w-4 text-red-500 mr-2"></i>AED 急救设备
          </router-link>
        </div>

        <!-- Mobile Events & Tickets Section -->
        <div class="border-t border-gray-100 pt-2 mt-2">
          <div class="px-3 py-2">
            <div class="text-sm font-semibold text-gray-900 mb-2">活动与票务 Events & Tickets</div>
          </div>

          <router-link to="/tickets" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-ticket w-4 text-pink-500 mr-2"></i>URBTIX 票务
          </router-link>
          <router-link to="/events" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-calendar w-4 text-pink-500 mr-2"></i>政府活动
          </router-link>
          <router-link to="/holidays" @click="isOpen = false"
            class="block px-6 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            <i class="fa fa-calendar-check-o w-4 text-red-500 mr-2"></i>公共假期
          </router-link>
        </div>

        <div class="border-t border-gray-100 pt-2 mt-2">
          <router-link to="/chat" @click="isOpen = false"
            class="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium transition-colors">
            AI
          </router-link>
        </div>

        <!-- Mobile Language & Auth Section -->
        <div class="border-t border-gray-100 pt-4 mt-4">
          <!-- Language Selection -->
          <div class="px-3 py-2">
            <div class="text-sm font-semibold text-gray-900 mb-3">语言设置 Language</div>
            <div class="space-y-2">
              <button
                class="flex items-center w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-left">
                <span class="font-medium">中文简体</span>
              </button>
              <button
                class="flex items-center w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-left">
                <span class="font-medium">中文繁體</span>
              </button>
              <button
                class="flex items-center w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-left">
                <span class="font-medium">English</span>
              </button>
            </div>
          </div>

          <!-- Login/Register -->
          <div class="px-3 py-2 mt-4">
            <div class="text-sm font-semibold text-gray-900 mb-3">账户 Account</div>
            <div class="space-y-2">
              <button
                class="w-full px-4 py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-gray-50 border border-gray-200">
                登录
              </button>
              <button
                class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                注册
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const cityTransitOpen = ref(false)
const facilitiesOpen = ref(false)
const eventsOpen = ref(false)
const languageOpen = ref(false)

const toggleDropdown = (dropdownName) => {
  // 关闭所有下拉菜单
  cityTransitOpen.value = false
  facilitiesOpen.value = false
  eventsOpen.value = false
  languageOpen.value = false

  // 打开指定的下拉菜单
  switch (dropdownName) {
    case 'cityTransit':
      cityTransitOpen.value = true
      break
    case 'facilities':
      facilitiesOpen.value = true
      break
    case 'events':
      eventsOpen.value = true
      break
    case 'language':
      languageOpen.value = true
      break
  }
}

const closeAllDropdowns = () => {
  cityTransitOpen.value = false
  facilitiesOpen.value = false
  eventsOpen.value = false
  languageOpen.value = false
}

const handleClickOutside = (event) => {
  // 检查点击是否在导航栏外部
  const navbar = document.querySelector('nav')
  if (navbar && !navbar.contains(event.target)) {
    closeAllDropdowns()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
