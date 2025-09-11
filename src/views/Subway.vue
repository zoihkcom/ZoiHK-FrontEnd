<template>
  <div class="subway-page">
    <!-- Navigation Bar -->
    <Navbar />

    <!-- Main Content with proper spacing for navbar -->
    <div class="content-with-navbar">

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 遮罩层 -->
        <div v-if="searchExpanded" class="search-overlay" @click="collapseSearch"></div>

        <!-- 浮动搜索栏 -->
        <div class="floating-search-bar" :class="{ 'expanded': searchExpanded }">
          <div class="search-compact" v-if="!searchExpanded">
            <div class="search-input-group">
              <div class="search-input start-input" @click="expandSearch">
                <span class="input-icon"><i class="fa fa-subway"></i></span>
                <span class="input-text">{{ startStationName || '选择起点' }}</span>
              </div>
              <div class="arrow-divider">→</div>
              <div class="search-input end-input" @click="expandSearch">
                <span class="input-icon"><i class="fa fa-map-pin"></i></span>
                <span class="input-text">{{ endStationName || '选择终点' }}</span>
              </div>
              <button class="route-search-btn"
                :disabled="!selectedStartPoiid || !selectedEndPoiid || routeStatus === 'planning'" @click="planRoute">
                <svg v-if="routeStatus === 'planning'" class="loading-icon" width="16" height="16" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none"
                    stroke-dasharray="31.416" stroke-dashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416"
                      repeatCount="indefinite" />
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416"
                      repeatCount="indefinite" />
                  </circle>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="search-expanded" v-if="searchExpanded">
            <div class="expanded-header">
              <h3 class="expanded-title">路径规划</h3>
              <button @click="collapseSearch" class="collapse-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <div class="route-planning-content">
              <div class="route-section">
                <div class="section-header">
                  <span class="section-icon"><i class="fa fa-subway"></i></span>
                  <span class="section-label">起点</span>
                </div>
                <div class="selector-group">
                  <n-select v-model:value="selectedStartLine" :options="lineOptions" :disabled="!subwayData"
                    placeholder="选择线路" @update:value="onStartLineChange" />
                  <n-select v-model:value="selectedStartPoiid" :options="startStationOptions"
                    :disabled="!startLineStations.length" placeholder="选择站点"
                    @update:value="onStartStationChange" />
                </div>
              </div>

              <div class="swap-section">
                <button @click="swapStartEnd" class="swap-button" :disabled="!selectedStartPoiid || !selectedEndPoiid">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 6h8v2H4V6zm0 2h8v2H4V8z" />
                    <path d="M10 4l2 2-2 2V6H8V4h2zm0 6v2H8v-2h2l2 2-2 2z" />
                  </svg>
                </button>
              </div>

              <div class="route-section">
                <div class="section-header">
                  <span class="section-icon"><i class="fa fa-map-pin"></i></span>
                  <span class="section-label">终点</span>
                </div>
                <div class="selector-group">
                  <n-select v-model:value="selectedEndLine" :options="lineOptions" :disabled="!subwayData"
                    placeholder="选择线路" @update:value="onEndLineChange" />
                  <n-select v-model:value="selectedEndPoiid" :options="endStationOptions"
                    :disabled="!endLineStations.length" placeholder="选择站点"
                    @update:value="onEndStationChange" />
                </div>
              </div>

              <div class="action-section">
                <button @click="planRoute" class="route-button"
                  :disabled="!selectedStartPoiid || !selectedEndPoiid || routeStatus === 'planning'">
                  <span v-if="routeStatus === 'planning'" class="button-content">
                    <svg class="loading-spinner" width="16" height="16" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-dasharray="31.416" stroke-dashoffset="31.416">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416"
                          repeatCount="indefinite" />
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416"
                          repeatCount="indefinite" />
                      </circle>
                    </svg>
                    规划中...
                  </span>
                  <span v-else class="button-content">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" />
                    </svg>
                    开始规划
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- 站点详情弹窗 -->
        <div v-if="showStationDetail" class="station-detail-panel">
          <div class="panel-header">
            <h3 class="panel-title">站点详情</h3>
            <div class="header-buttons">
              <button @click="openAmapMarker" class="map-btn" title="在高德地图中查看">
                <i class="fa fa-map-marker"></i>
              </button>
              <button @click="closeStationDetail" class="close-btn">×</button>
            </div>
          </div>

          <div class="panel-content" v-if="currentStation || stationDetailLoading">
            <!-- 加载指示器 -->
            <div v-if="stationDetailLoading" class="loading-container">
              <div class="loading-spinner">
                <svg class="spinner" width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="3" fill="none"
                    stroke-dasharray="75.4" stroke-dashoffset="75.4">
                    <animate attributeName="stroke-dasharray" dur="1.5s" values="0 75.4;37.7 37.7;0 75.4"
                      repeatCount="indefinite" />
                    <animate attributeName="stroke-dashoffset" dur="1.5s" values="0;-18.85;-75.4"
                      repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
              <p class="loading-text">正在获取站点信息...</p>
            </div>

            <!-- 站点信息内容 -->
            <div v-if="!stationDetailLoading && currentStation">
              <!-- 站点基本信息 -->
              <div class="station-info-section">
                <h4 class="section-title">基本信息</h4>
                <div class="info-item">
                  <span class="info-label">站点名称：</span>
                  <span class="info-value">{{ currentStation.name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">站点类型：</span>
                  <span class="info-value">{{ currentStation.type }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">线路：</span>
                  <span class="info-value">{{ currentStation.address || '暂无' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">区域：</span>
                  <span class="info-value">{{ currentStation.adname }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">城市：</span>
                  <span class="info-value">{{ currentStation.cityname }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">坐标：</span>
                  <span class="info-value">{{ currentStation.location }}</span>
                </div>
              </div>

              <!-- 联系信息 -->
              <div class="station-info-section" v-if="currentStation.tel && currentStation.tel.length > 0">
                <h4 class="section-title">联系信息</h4>
                <div class="info-item">
                  <span class="info-label">电话：</span>
                  <span class="info-value">{{ currentStation.tel.join(', ') }}</span>
                </div>
              </div>

              <!-- 站点图片 -->
              <div class="station-info-section" v-if="currentStation.photos && currentStation.photos.length > 0">
                <h4 class="section-title">站点图片</h4>
                <div class="station-photos">
                  <img v-for="(photo, index) in currentStation.photos" :key="index" :src="photo.url"
                    :alt="photo.title || '站点图片'" class="station-photo" @error="handleImageError" />
                </div>
              </div>

              <!-- 其他信息 -->
              <div class="station-info-section">
                <h4 class="section-title">其他信息</h4>
                <div class="info-item">
                  <span class="info-label">站点ID：</span>
                  <span class="info-value">{{ currentStation.id }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">更新时间：</span>
                  <span class="info-value">{{ currentStation.timestamp }}</span>
                </div>
                <div class="info-item" v-if="currentStation.postcode && currentStation.postcode.length > 0">
                  <span class="info-label">邮编：</span>
                  <span class="info-value">{{ currentStation.postcode.join(', ') }}</span>
                </div>
              </div>

              <!-- 预计到站信息 -->
              <div class="station-info-section" v-if="arrivalInfo && arrivalInfo.length > 0">
                <h4 class="section-title">预计到站信息</h4>
                <div v-for="lineArrival in arrivalInfo" :key="lineArrival.line_code" class="line-arrival-section">
                  <h5 class="line-title">{{ lineArrival.line_name_zh }} ({{ lineArrival.line_name }})</h5>

                  <!-- 上行方向 -->
                  <div v-if="lineArrival.arrivals.UP && lineArrival.arrivals.UP.length > 0"
                    class="direction-section mt-2">
                    <h6 class="direction-title">上行 (往{{ getStationChineseName(lineArrival.line_code,
                      lineArrival.arrivals.UP[0].dest) }}方向)</h6>
                    <div class="arrival-list">
                      <div v-for="train in lineArrival.arrivals.UP.slice(0, 4)" :key="train.seq" class="arrival-item">
                        <span class="train-dest">前往 {{ getStationChineseName(lineArrival.line_code, train.dest)
                          }}</span>
                        <span class="train-time">{{ train.time.substring(11, 16) }}</span>
                        <span class="train-minutes" :class="{ 'arriving': parseInt(train.ttnt) <= 1 }">
                          {{ parseInt(train.ttnt) === 0 ? '正在到达' : `${train.ttnt}分钟后` }}
                        </span>
                        <span class="train-platform">{{ train.plat }}号站台</span>
                      </div>
                    </div>
                  </div>

                  <!-- 下行方向 -->
                  <div v-if="lineArrival.arrivals.DOWN && lineArrival.arrivals.DOWN.length > 0"
                    class="direction-section">
                    <h6 class="direction-title">下行 (往{{ getStationChineseName(lineArrival.line_code,
                      lineArrival.arrivals.DOWN[0].dest) }}方向)</h6>
                    <div class="arrival-list">
                      <div v-for="train in lineArrival.arrivals.DOWN.slice(0, 4)" :key="train.seq" class="arrival-item">
                        <span class="train-dest">前往 {{ getStationChineseName(lineArrival.line_code, train.dest)
                          }}</span>
                        <span class="train-time">{{ train.time.substring(11, 16) }}</span>
                        <span class="train-minutes" :class="{ 'arriving': parseInt(train.ttnt) <= 1 }">
                          {{ parseInt(train.ttnt) === 0 ? '正在到达' : `${train.ttnt}分钟后` }}
                        </span>
                        <span class="train-platform">{{ train.plat }}号站台</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="arrival-disclaimer">*数据来自香港地铁官方API，仅供参考</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 路径规划结果弹窗 -->
        <div v-if="showRouteResult" class="route-result-panel">
          <div class="panel-header">
            <h3 class="panel-title">{{ currentRouteResult.startname }} → {{ currentRouteResult.endname }}</h3>
            <button @click="closeRouteResult" class="close-btn">×</button>
          </div>

          <div class="panel-content" v-if="currentRouteResult">
            <!-- 线路标题 -->
            <div class="route-header">
              <h3 class="line-title">
                <template v-for="(segment, index) in currentRouteResult.segments" :key="index">
                  <span class="line-item">
                    <div class="line-indicator" :style="{ backgroundColor: '#' + segment.color }"></div>
                    {{ segment.bus_key_name }}
                  </span>
                  <span v-if="index < currentRouteResult.segments.length - 1" class="line-arrow"> → </span>
                </template>
              </h3>
            </div>

            <!-- 行程概要 -->
            <div class="trip-summary">
              约{{ Math.round(currentRouteResult.drivertime / 60) }}分钟 ·
              {{ currentRouteResult.totalStations || 0 }}站 ·
              换乘{{ currentRouteResult.transferCount || 0 }}次 ·
              {{ currentRouteResult.price }}元 ·
              {{ (currentRouteResult.driverlength / 1000).toFixed(1) }}公里
              <div class="data-disclaimer">*数据仅供参考</div>
            </div>

            <!-- 时间轴样式的站点信息 -->
            <div class="timeline-container">
              <!-- 循环显示每个路段 -->
              <template v-for="(segment, segmentIndex) in currentRouteResult.segments" :key="segmentIndex">

                <!-- 起点站（只在第一段显示） -->
                <div v-if="segmentIndex === 0" class="timeline-item start-station">
                  <div class="timeline-content">
                    <div class="station-label">起点</div>
                    <div class="station-circle" :style="{ backgroundColor: '#' + segment.color }">
                      {{ segment.bus_key_name.substring(0, 2) }}
                    </div>
                    <div class="station-info">
                      <div class="station-name">{{ segment.startname }}</div>
                      <div class="station-details">
                        <span class="direction-info">开往 {{ segment.directionName }}方向</span>
                        <div class="time-info">
                          <span class="time-tag first-train">首 {{ segment.stationStartTime }}</span>
                          <span class="time-tag last-train">末 {{ segment.stationEndTime }}</span>
                        </div>
                      </div>
                      <div class="departure-desc">{{ segment.interval_desc }}</div>
                    </div>
                  </div>
                  <div class="timeline-line" :style="{ backgroundColor: '#' + segment.color }"></div>
                </div>

                <!-- 当前路段的经过站点 -->
                <div v-if="segment.passdepotname"
                  v-for="(station, stationIndex) in segment.passdepotname.split(' ').filter(s => s.trim())"
                  :key="`${segmentIndex}-${stationIndex}`" class="timeline-item middle-station">
                  <div class="timeline-content">
                    <div class="station-circle-small" :style="{ backgroundColor: '#' + segment.color }"></div>
                    <div class="station-name-small">{{ station }}</div>
                  </div>
                  <div class="timeline-line" :style="{ backgroundColor: '#' + segment.color }"></div>
                </div>

                <!-- 换乘站（在路段之间显示） -->
                <div v-if="segmentIndex < currentRouteResult.segments.length - 1"
                  class="timeline-item transfer-station">
                  <div class="timeline-content">
                    <div class="station-label">换乘</div>
                    <div class="transfer-circle">
                      <div class="transfer-inner" :style="{ backgroundColor: '#' + segment.color }"></div>
                      <div class="transfer-inner"
                        :style="{ backgroundColor: '#' + currentRouteResult.segments[segmentIndex + 1].color }"></div>
                    </div>
                    <div class="station-info">
                      <div class="station-name">{{ segment.endname }}</div>
                      <div class="station-details">
                        <span class="direction-info">开往 {{ currentRouteResult.segments[segmentIndex + 1].directionName
                          }}方向</span>
                        <div class="time-info">
                          <span class="time-tag first-train">首 {{ currentRouteResult.segments[segmentIndex +
                            1].stationStartTime }}</span>
                          <span class="time-tag last-train">末 {{ currentRouteResult.segments[segmentIndex +
                            1].stationEndTime }}</span>
                        </div>
                      </div>
                      <div class="departure-desc">{{ currentRouteResult.segments[segmentIndex + 1].interval_desc }}
                      </div>
                      <div class="transfer-info">
                        <span class="from-line">{{ segment.bus_key_name }}</span>
                        <span class="transfer-arrow">→</span>
                        <span class="to-line">{{ currentRouteResult.segments[segmentIndex + 1].bus_key_name }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="timeline-line"
                    :style="{ backgroundColor: '#' + currentRouteResult.segments[segmentIndex + 1].color }"></div>
                </div>

              </template>

              <!-- 终点站 -->
              <div class="timeline-item end-station">
                <div class="timeline-content">
                  <div class="station-label">终点</div>
                  <div class="station-circle"
                    :style="{ backgroundColor: '#' + currentRouteResult.segments[currentRouteResult.segments.length - 1].color }">
                    {{ currentRouteResult.segments[currentRouteResult.segments.length - 1].bus_key_name.substring(0, 2)
                    }}
                  </div>
                  <div class="station-info">
                    <div class="station-name">{{ currentRouteResult.endname }}</div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        <!-- 地铁图iframe容器 -->
        <div class="subway-map-wrapper">
          <iframe src="/subway-map.html" class="subway-iframe" title="香港地铁线路图" loading="eager"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock" allow="accelerometer; gyroscope"
            @load="onIframeLoad" @error="onIframeError">
          </iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import '@/styles/subway.css'
import { HKMetroQuery } from '@/api/metro-data.js'

// 创建 HKMetroQuery 实例
const hkMetro = new HKMetroQuery()

const iframeLoaded = ref(false)
const iframeError = ref(false)
const routeData = ref(null)
const routeStatus = ref('idle') // idle, planning, complete, error

// 浮动搜索栏状态
const searchExpanded = ref(false)

// 站点详情弹窗相关状态
const showStationDetail = ref(false)
const currentStation = ref(null)
const arrivalInfo = ref(null)  // 预计到站信息
const stationDetailLoading = ref(false)  // 站点详情查询加载状态

// 路径规划结果弹窗相关状态
const showRouteResult = ref(false)
const currentRouteResult = ref(null)

// 地铁数据相关状态
const subwayData = ref(null)
const dataLoading = ref(false)
const dataError = ref(null)

// 线路站点选择相关状态
const selectedStartLine = ref('')
const selectedEndLine = ref('')
const selectedStartPoiid = ref('')
const selectedEndPoiid = ref('')

// 站点相关的计算属性
const startStationName = computed(() => {
  return getStationNameByPoiid(selectedStartPoiid.value, selectedStartLine.value)
})

const startStationId = computed(() => {
  return getStationIdByPoiid(selectedStartPoiid.value, selectedStartLine.value)
})

const endStationName = computed(() => {
  return getStationNameByPoiid(selectedEndPoiid.value, selectedEndLine.value)
})

const endStationId = computed(() => {
  return getStationIdByPoiid(selectedEndPoiid.value, selectedEndLine.value)
})

// 计算属性：获取指定线路的站点列表
const startLineStations = computed(() => {
  if (!subwayData.value || !selectedStartLine.value) return []
  const line = subwayData.value.l.find(l => l.ls === selectedStartLine.value)
  return line ? line.st : []
})

const endLineStations = computed(() => {
  if (!subwayData.value || !selectedEndLine.value) return []
  const line = subwayData.value.l.find(l => l.ls === selectedEndLine.value)
  return line ? line.st : []
})

// Naive UI select options
const lineOptions = computed(() => {
  const lines = subwayData.value?.l || []
  return lines.map(line => ({
    label: line.la ? `${line.ln} (${line.la})` : line.ln,
    value: line.ls
  }))
})

const startStationOptions = computed(() => {
  return startLineStations.value.map(st => ({
    label: st.sp ? `${st.n} (${st.sp})` : st.n,
    value: st.poiid
  }))
})

const endStationOptions = computed(() => {
  return endLineStations.value.map(st => ({
    label: st.sp ? `${st.n} (${st.sp})` : st.n,
    value: st.poiid
  }))
})

// 获取地铁数据
const fetchSubwayData = async () => {
  try {
    dataLoading.value = true
    dataError.value = null

    const response = await fetch('./xianggang_drw.json')

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    subwayData.value = data

  } catch (error) {
    dataError.value = error.message
  } finally {
    dataLoading.value = false
  }
}

// 线路选择变化处理
const onStartLineChange = () => {
  selectedStartPoiid.value = ''
  // 自动展开搜索栏以便继续选择
  if (!searchExpanded.value) {
    searchExpanded.value = true
  }
  // 选择线路后调用showLine方法
  if (selectedStartLine.value && iframeLoaded.value) {
    sendMessageToIframe('showLine', { lineId: selectedStartLine.value })

    // 选择线路后立即关闭搜索栏
    searchExpanded.value = false
  }
}

const onEndLineChange = () => {
  selectedEndPoiid.value = ''
  // 自动展开搜索栏以便继续选择
  if (!searchExpanded.value) {
    searchExpanded.value = true
  }
  // 选择线路后调用showLine方法
  if (selectedEndLine.value && iframeLoaded.value) {
    sendMessageToIframe('showLine', { lineId: selectedEndLine.value })

    // 选择线路后立即关闭搜索栏
    searchExpanded.value = false
  }
}

// 获取站点名称根据poiid
const getStationNameByPoiid = (poiid, lineId) => {
  if (!subwayData.value || !poiid || !lineId) return ''
  const line = subwayData.value.l.find(l => l.ls === lineId)
  if (!line) return ''
  const station = line.st.find(s => s.poiid === poiid)
  return station ? station.n : ''
}

// 根据poiid获取站点ID（si字段）
const getStationIdByPoiid = (poiid, lineId) => {
  if (!subwayData.value || !poiid || !lineId) return ''
  const line = subwayData.value.l.find(l => l.ls === lineId)
  if (!line) return ''
  const station = line.st.find(s => s.poiid === poiid)
  return station ? station.si : ''
}

// 为选中的站点显示详情弹窗
const showStationDetailForSelectedStation = (poiid) => {
  // 传递poiid给handleStationDetail处理
  handleStationDetail({ poiid: poiid })
}

// 站点选择变化处理（调用HTML中的setStart/setEnd方法）
const onStartStationChange = () => {
  if (selectedStartPoiid.value && iframeLoaded.value) {

    // 先清除线路高亮
    sendMessageToIframe('clearLine', {})

    sendMessageToIframe('setStart', {
      stationId: startStationId.value,
      poiid: selectedStartPoiid.value,
      stationName: startStationName.value
    })

    // 显示站点详情弹窗
    showStationDetailForSelectedStation(selectedStartPoiid.value)

    // 选择站点后立即关闭搜索栏
    searchExpanded.value = false
  }
}

const onEndStationChange = () => {
  if (selectedEndPoiid.value && iframeLoaded.value) {
    // 先清除线路高亮
    sendMessageToIframe('clearLine', {})

    sendMessageToIframe('setEnd', {
      stationId: endStationId.value,
      poiid: selectedEndPoiid.value,
      stationName: endStationName.value
    })

    // 显示站点详情弹窗
    showStationDetailForSelectedStation(selectedEndPoiid.value)

    // 选择站点后立即关闭搜索栏
    searchExpanded.value = false
  }
}

// 交换起点终点
const swapStartEnd = () => {
  const tempLine = selectedStartLine.value
  const tempPoiid = selectedStartPoiid.value

  selectedStartLine.value = selectedEndLine.value
  selectedStartPoiid.value = selectedEndPoiid.value
  selectedEndLine.value = tempLine
  selectedEndPoiid.value = tempPoiid

  // 发送交换后的起点终点到iframe
  if (selectedStartPoiid.value && iframeLoaded.value) {
    sendMessageToIframe('setStart', {
      stationId: startStationId.value,
      poiid: selectedStartPoiid.value,
      stationName: startStationName.value
    })
  }
  if (selectedEndPoiid.value && iframeLoaded.value) {
    sendMessageToIframe('setEnd', {
      stationId: endStationId.value,
      poiid: selectedEndPoiid.value,
      stationName: endStationName.value
    })
  }
}

// 发起路径规划
const planRoute = () => {
  if (selectedStartPoiid.value && selectedEndPoiid.value && iframeLoaded.value) {
    routeStatus.value = 'planning'

    sendMessageToIframe('planRoute', {
      startStationId: startStationId.value,
      endStationId: endStationId.value,
      startStationName: startStationName.value,
      endStationName: endStationName.value
    })
  }
}

// 向iframe发送消息
const sendMessageToIframe = (type, data) => {
  const iframe = document.querySelector('.subway-iframe')
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
      type,
      data
    }, window.location.origin)
  }
}

const onIframeLoad = () => {
  iframeLoaded.value = true
}

const onIframeError = () => {
  iframeError.value = true
}

// 关闭站点详情弹窗
const closeStationDetail = () => {
  showStationDetail.value = false
  currentStation.value = null
  arrivalInfo.value = null
  stationDetailLoading.value = false
}

// 浮动搜索栏控制方法
const expandSearch = () => {
  searchExpanded.value = true
}

const collapseSearch = () => {
  searchExpanded.value = false
}

// 键盘事件处理
const handleKeydown = (event) => {
  // 按ESC键关闭搜索栏
  if (event.key === 'Escape' && searchExpanded.value) {
    searchExpanded.value = false
  }
}

// 打开高德地图标记页面
const openAmapMarker = () => {
  if (currentStation.value && currentStation.value.id) {
    const url = `https://uri.amap.com/marker?poiid=${currentStation.value.id}`
    window.open(url, '_blank')
  }
}

// 关闭路径规划结果弹窗
const closeRouteResult = () => {
  showRouteResult.value = false
  currentRouteResult.value = null

  // 重置下拉框内容
  selectedStartLine.value = ''
  selectedEndLine.value = ''
  selectedStartPoiid.value = ''
  selectedEndPoiid.value = ''

  // 重新加载地铁图组件
  reloadSubwayMap()
}

// 重新加载地铁图组件
const reloadSubwayMap = () => {
  const iframe = document.querySelector('.subway-iframe')
  if (iframe) {
    // 重新加载iframe
    iframe.src = iframe.src
  }
}

// 处理图片加载错误
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// 处理来自iframe的消息
const handleMessage = (event) => {
  // 安全检查：确保消息来源正确
  if (event.origin !== window.location.origin) {
    return
  }

  const { type, data } = event.data

  switch (type) {
    case 'subway-route-start':
      routeStatus.value = 'planning'
      break

    case 'subway-route-complete':
      routeStatus.value = 'complete'
      routeData.value = data

      // 处理路径规划结果
      handleRouteComplete(data)
      break

    case 'subway-route-error':
      routeStatus.value = 'error'

      // 处理路径规划错误
      handleRouteError(data)
      break

    case 'subway-station-detail':

      // 处理站点详细信息
      handleStationDetail(data)
      break

    case 'subway-station-error':

      // 处理站点信息获取错误
      handleStationError(data)
      break

    default:
      // 忽略其他类型的消息
      break
  }
}

// 处理路径规划完成
const handleRouteComplete = (e) => {
  const { data } = e
  const segmentList = data.buslist[0].segmentlist

  // 路径规划完成后关闭站点详情弹窗和搜索栏
  if (showStationDetail.value) {
    closeStationDetail()
  }

  // 自动收起搜索栏
  searchExpanded.value = false

  // 处理路径数据，适配换乘情况
  const routeData = processRouteData(segmentList)

  // 显示路径规划结果弹窗
  currentRouteResult.value = routeData
  showRouteResult.value = true
}

// 处理路径数据，适配换乘情况
const processRouteData = (segmentList) => {
  // 计算总的行程信息
  let totalTime = 0
  let totalDistance = 0

  // 收集所有经过的站点
  let allStations = []
  let allStationNames = new Set() // 用于去重

  segmentList.forEach((segment) => {
    totalTime += parseInt(segment.drivertime) || 0
    totalDistance += parseInt(segment.driverlength) || 0

    // 收集经过站点
    if (segment.passdepotname) {
      const stations = segment.passdepotname.split(' ').filter(station => station.trim())
      stations.forEach(station => allStationNames.add(station))
      allStations = allStations.concat(stations)
    }

    // 每段都添加终点（换乘站或最终终点）
    allStationNames.add(segment.endname)
  })

  // 使用第一段的基本信息作为主要信息
  const firstSegment = segmentList[0]
  const lastSegment = segmentList[segmentList.length - 1]

  return {
    // 基本信息使用第一段
    busname: firstSegment.busname,
    bus_key_name: firstSegment.bus_key_name,
    color: firstSegment.color,
    startname: firstSegment.startname,
    endname: lastSegment.endname,
    directionName: lastSegment.directionName,

    // 时间信息使用第一段的站点时间
    stationStartTime: firstSegment.stationStartTime,
    stationEndTime: firstSegment.stationEndTime,
    interval_desc: firstSegment.interval_desc,

    // 汇总的行程信息
    drivertime: totalTime,
    driverlength: totalDistance,
    price: parseFloat(firstSegment.price).toFixed(1), // 只取第一个segment的价格

    // 所有经过站点
    passdepotname: allStations.join(' '),

    // 换乘信息
    segments: segmentList,
    transferCount: segmentList.length - 1, // 换乘次数 = 段数 - 1
    totalStations: allStationNames.size // 使用去重后的站点总数
  }
}

// 处理路径规划错误
const handleRouteError = () => {

}

const handleStationDetail = async (data) => {
  const poiid = data?.poiid
  if (poiid) {
    try {
      // 开始加载
      stationDetailLoading.value = true
      showStationDetail.value = true
      currentStation.value = null
      arrivalInfo.value = null

      // 1. 使用 HKMetroQuery 获取站点信息
      const stationData = hkMetro.getStationByPoiId(poiid)

      // 2. 获取预计到站信息
      let arrivalData = null
      if (stationData) {
        // 如果是换乘站，stationData 是数组，否则是对象
        const stations = Array.isArray(stationData) ? stationData : [stationData]

        // 为每条线路获取到站信息
        const arrivalPromises = stations.map(async (station) => {
          try {
            const { line_code, station_code } = station
            const apiUrl = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${line_code}&sta=${station_code}&lang=tc`

            const response = await fetch(apiUrl)
            if (!response.ok) {
              console.warn(`获取${line_code}-${station_code}到站信息失败: ${response.status}`)
              return null
            }

            const arrivalData = await response.json()
            if (arrivalData.status === 1 && arrivalData.data) {
              const stationKey = `${line_code}-${station_code}`
              const stationArrival = arrivalData.data[stationKey]

              if (stationArrival) {
                return {
                  line_code,
                  station_code,
                  line_name: station.line_name,
                  line_name_zh: station.line_name_zh,
                  station_name: station.station_name,
                  arrivals: stationArrival
                }
              }
            }
            return null
          } catch (error) {
            console.error(`获取${station.line_code}-${station.station_code}到站信息错误:`, error)
            return null
          }
        })

        const results = await Promise.all(arrivalPromises)
        arrivalData = results.filter(result => result !== null)
      }

      arrivalInfo.value = arrivalData

      // 3. 获取高德地图站点详情
      const API_KEY = "2be9c7d6d620fe19941398b0ed87cd48"
      const apiUrl = `https://restapi.amap.com/v3/place/detail?id=${poiid}&key=${API_KEY}`

      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`)
      }

      const apiData = await response.json()

      if (apiData.status === "1" && apiData.pois && apiData.pois.length > 0) {
        const stationInfo = apiData.pois[0]
        currentStation.value = stationInfo
      } else {
        // API没有返回有效数据，使用备选方案
        const fallbackInfo = createBasicStationInfo(poiid)
        if (fallbackInfo) {
          currentStation.value = fallbackInfo
        }
      }
    } catch (error) {
      // API获取失败时，使用本地数据构建基本信息
      const stationInfo = createBasicStationInfo(poiid)
      if (stationInfo) {
        currentStation.value = stationInfo
      }
      console.error('获取站点信息错误:', error)
    } finally {
      // 结束加载
      stationDetailLoading.value = false
    }
  }
}

// 根据线路代码和站点代码获取站点中文名称
const getStationChineseName = (lineCode, stationCode) => {
  const stationInfo = hkMetro.getStationInfo(lineCode, stationCode)
  return stationInfo ? stationInfo.station_name_zh : stationCode
}

// 创建基本站点信息（当API失败时使用）
const createBasicStationInfo = (poiid) => {
  // 在所有线路中查找该站点
  if (!subwayData.value) return null

  for (const line of subwayData.value.l) {
    const station = line.st.find(s => s.poiid === poiid)
    if (station) {
      return {
        id: station.poiid,
        name: station.n,
        type: '地铁站',
        address: `${line.ln}线`,
        adname: '香港',
        cityname: '香港',
        location: station.sl || '',
        tel: [],
        photos: [],
        timestamp: new Date().toLocaleString()
      }
    }
  }
  return null
}

const handleStationError = () => {

}

// 组件挂载时添加消息监听
onMounted(() => {
  window.addEventListener('message', handleMessage)
  window.addEventListener('keydown', handleKeydown)

  // 获取地铁数据
  fetchSubwayData()
})

// 组件卸载时移除消息监听
onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
  window.removeEventListener('keydown', handleKeydown)
})
</script>
