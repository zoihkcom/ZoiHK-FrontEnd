<template>
  <div class="amap-container">
    <div id="amap-container" class="amap-map"></div>

    <!-- 路径规划控制面板 -->
    <div class="route-control-panel" v-if="showRoutePanel">
      <div class="route-form">
        <div class="form-group">
          <label>起点：</label>
          <div class="input-with-suggestions">
            <input v-model="startPoint" placeholder="输入起点地址或点击地图选择" @input="onStartPointInput"
              @focus="showStartSuggestions = true" @blur="hideStartSuggestions" />
            <div v-if="showStartSuggestions && startSuggestions.length > 0" class="suggestions-dropdown">
              <div v-for="(suggestion, index) in startSuggestions" :key="index" class="suggestion-item"
                @mousedown="selectStartSuggestion(suggestion)">
                <div class="suggestion-name">{{ suggestion.name }}</div>
                <div class="suggestion-location" v-if="formatLocationInfo(suggestion)">
                  {{ formatLocationInfo(suggestion) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>终点：</label>
          <div class="input-with-suggestions">
            <input v-model="endPoint" placeholder="输入终点地址或点击地图选择" @input="onEndPointInput"
              @focus="showEndSuggestions = true" @blur="hideEndSuggestions" />
            <div v-if="showEndSuggestions && endSuggestions.length > 0" class="suggestions-dropdown">
              <div v-for="(suggestion, index) in endSuggestions" :key="index" class="suggestion-item"
                @mousedown="selectEndSuggestion(suggestion)">
                <div class="suggestion-name">{{ suggestion.name }}</div>
                <div class="suggestion-location" v-if="formatLocationInfo(suggestion)">
                  {{ formatLocationInfo(suggestion) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>规划类型：</label>
          <select v-model="routeType" @change="onRouteTypeChange">
            <option value="driving">驾车</option>
            <option value="walking">步行</option>
            <option value="bicycling">骑行</option>
            <option value="transit">公共交通</option>
          </select>
        </div>

        <div class="form-group" v-if="routeType === 'driving'">
          <label>路径策略：</label>
          <select v-model="strategy">
            <option value="10">推荐方案</option>
            <option value="12">躲避拥堵</option>
            <option value="14">避免收费</option>
          </select>
        </div>



        <div class="button-group">
          <button @click="planRoute" :disabled="!canPlanRoute" class="plan-btn">
            {{ isPlanning ? '规划中...' : '开始规划' }}
          </button>
          <button @click="clearRoute" class="clear-btn">清除路线</button>
        </div>

        <!-- 多路线方案显示 -->
        <div v-if="multipleRoutes.length > 0" class="multiple-routes">
          <div class="routes-header">
            <h4>路线方案</h4>
            <span v-if="routeType === 'driving' && drivingTaxiCost" class="route-taxi-cost">打车费：{{ drivingTaxiCost
            }}</span>
          </div>
          <div class="route-options">
            <div v-for="(route, index) in multipleRoutes" :key="index" class="route-option"
              :class="{ active: selectedRouteIndex === index }">
              <div class="route-option-header" @click="selectRoute(index)">
                <span class="route-name">{{ route.strategyName }}</span>
                <span class="route-time">{{ route.duration }}</span>
              </div>
              <div class="route-option-details" @click="selectRoute(index)">
                <span class="route-distance">{{ route.distance }}</span>
                <span v-if="route.tolls" class="route-tolls">过路费：{{ route.tolls }}</span>
                <span class="route-expand-icon" @click.stop="toggleRouteDetails(index)">
                  <svg :class="{ rotated: route.expanded }" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </span>
              </div>

              <!-- 路线详细步骤 -->
              <div v-if="route.expanded" class="route-steps">
                <div class="route-steps-header">
                  <span class="start-point">从 {{ getStartPointName() }} 出发</span>
                </div>
                <div v-for="(step, stepIndex) in route.routeSteps" :key="stepIndex" class="route-step">
                  <div class="step-icon">
                    <!-- 根据交通方式显示不同图标 -->
                    <div v-if="step.transit_mode === 'WALK'" class="transit-icon walk-icon">
                      <i class="fa fa-male"></i>
                    </div>
                    <div v-else-if="step.transit_mode === 'SUBWAY'" class="transit-icon subway-icon">
                      <i class="fa fa-train"></i>
                    </div>
                    <div v-else-if="step.transit_mode === 'BUS'" class="transit-icon bus-icon">
                      <i class="fa fa-bus"></i>
                    </div>
                    <div v-else class="transit-icon default-icon">
                      <i class="fa fa-circle"></i>
                    </div>
                  </div>
                  <div class="step-content">
                    <div class="step-road">{{ step.road || '未知道路' }}</div>
                    <div v-if="step.stationInfo" class="step-stations">{{ step.stationInfo }}</div>
                    <div class="step-distance">
                      {{ step.distance }}
                      <span v-if="step.duration" class="step-duration">{{ step.duration }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 单路线信息显示（备用） -->
        <div v-else-if="routeInfo" class="route-info">
          <h4>路线信息</h4>
          <div class="route-details">
            <p><strong>距离：</strong>{{ routeInfo.distance }}</p>
            <p><strong>预计时间：</strong>{{ routeInfo.duration }}</p>
            <p v-if="routeType === 'driving' && drivingTaxiCost"><strong>打车费：</strong>{{ drivingTaxiCost }}</p>
            <p v-if="routeInfo.tolls"><strong>过路费：</strong>{{ routeInfo.tolls }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const props = defineProps({
  center: { type: Array, default: () => [114.1694, 22.3193] },
  zoom: { type: Number, default: 13 },
  showRoutePanel: { type: Boolean, default: true },
  amapKey: { type: String, default: '7dce621dfd925b38d31e0f421cc39740' },
  securityJsCode: { type: String, default: '62b0ed3ad14b522b670ddc9ec88a1f32' },
  city: { type: String, default: '香港' }
})

const emit = defineEmits(['map-ready', 'map-error', 'route-error'])

// 响应式数据
const map = ref(null)
const AMap = ref(null)
const startPoint = ref('')
const endPoint = ref('')
const startMarker = ref(null)
const endMarker = ref(null)
const startCoords = ref(null)
const endCoords = ref(null)
const routeType = ref('driving')
const strategy = ref('10')
const isPlanning = ref(false)
const routeInfo = ref(null)
const drivingTaxiCost = ref(null)

const currentRouteService = ref(null)
const geocoder = ref(null)

// 多路线相关
const multipleRoutes = ref([])
const selectedRouteIndex = ref(0)
const routeServices = ref([])
const routePolylines = ref([]) // 存储路线绘制对象

// 搜索建议相关
const showStartSuggestions = ref(false)
const showEndSuggestions = ref(false)
const startSuggestions = ref([])
const endSuggestions = ref([])
const placeSearch = ref(null)
const searchTimeout = ref(null)

// 计算属性
const canPlanRoute = computed(() => {
  return startCoords.value && endCoords.value && !isPlanning.value
})

// 格式化地理信息显示
const formatLocationInfo = (suggestion) => {
  const { pname, cityname, adname } = suggestion
  const parts = []

  // 处理省份/特别行政区
  if (pname && pname.trim()) {
    parts.push(pname)
  }

  // 处理城市名称（如果和省份不同）
  if (cityname && cityname.trim() && cityname !== pname) {
    parts.push(cityname)
  }

  // 处理区域名称
  if (adname && adname.trim()) {
    parts.push(adname)
  }

  return parts.join(' · ')
}

// 通用工具函数：提升可读性与复用
function formatDistance(meters) {
  if (!meters && meters !== 0) return '未知距离'
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)}公里`
  return `${Math.round(meters)}米`
}

function formatMinutes(seconds) {
  if (!seconds && seconds !== 0) return ''
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const remain = minutes % 60
  return hours > 0 ? `${hours}小时${remain}分钟` : `${minutes}分钟`
}

function getStepsDataByType(route, type) {
  if (!route) return []
  if (type === 'transit') return route.segments || []
  if (type === 'bicycling') return route.rides || []
  return route.steps || []
}

function extractPathFromRoute(route, type) {
  if (!route) return []
  // 公共交通：route 为 plan
  if (type === 'transit') {
    const raw = route.path || []
    return raw
      .map(pt => Array.isArray(pt) ? [pt[0], pt[1]] : (pt && pt.lng !== undefined ? [pt.lng, pt.lat] : (pt && pt.lon !== undefined ? [pt.lon, pt.lat] : null)))
      .filter(Boolean)
  }
  // 其他：从 steps/rides 累积 path
  const steps = getStepsDataByType(route, type)
  const path = []
  steps.forEach(step => {
    if (step && Array.isArray(step.path)) {
      step.path.forEach(pt => {
        if (pt && pt.lng !== undefined && pt.lat !== undefined) path.push([pt.lng, pt.lat])
      })
    }
  })
  return path
}


// 生命周期
onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  destroyMap()
})

// 方法
async function initMap() {
  try {

    window._AMapSecurityConfig = {
      securityJsCode: props.securityJsCode,
    };

    AMap.value = await AMapLoader.load({
      key: props.amapKey,
      version: '2.0',
      plugins: [
        'AMap.Geocoder',
        'AMap.AutoComplete',
        'AMap.PlaceSearch',
        'AMap.Marker',
        'AMap.Polyline',
        'AMap.InfoWindow',
        'AMap.Driving',
        'AMap.Walking',
        'AMap.Riding',
        'AMap.Transfer'
      ]
    })

    map.value = new AMap.value.Map('amap-container', {
      center: props.center,
      zoom: props.zoom,
      mapStyle: 'amap://styles/normal'
    })

    // 初始化地理编码器和搜索服务
    geocoder.value = new AMap.value.Geocoder()
    placeSearch.value = new AMap.value.PlaceSearch({
      city: props.city,
      citylimit: true,
      pageSize: 10,
      extensions: 'all' // 获取详细信息
    })

    // 添加点击事件监听器
    map.value.on('click', onMapClick)

    emit('map-ready', { map: map.value, AMap: AMap.value })

  } catch (error) {
    console.error('地图初始化失败:', error)
    emit('map-error', error)
  }
}

function onMapClick(e) {
  const { lng, lat } = e.lnglat

  if (!startCoords.value) {
    setStartPointFromMap([lng, lat])
  } else if (!endCoords.value) {
    setEndPointFromMap([lng, lat])
  } else {
    // 如果起点终点都已设置，重新设置起点
    clearRoute()
    setStartPointFromMap([lng, lat])
  }
}

// 从地图点击设置起点（需要反地理编码获取地址）
function setStartPointFromMap(coords) {
  setStartPoint(coords)

  // 反地理编码获取地址
  geocoder.value.getAddress(coords, (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
      startPoint.value = result.regeocode.formattedAddress
    }
  })
}

// 从地图点击设置终点（需要反地理编码获取地址）
function setEndPointFromMap(coords) {
  setEndPoint(coords)

  // 反地理编码获取地址
  geocoder.value.getAddress(coords, (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
      endPoint.value = result.regeocode.formattedAddress
    }
  })
}

function setStartPoint(coords) {
  startCoords.value = coords

  if (startMarker.value) {
    map.value.remove(startMarker.value)
  }

  startMarker.value = new AMap.value.Marker({
    position: coords,
    title: '起点',
    icon: new AMap.value.Icon({
      imageSize: new AMap.value.Size(25, 34),
      image: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png'
    })
  })

  map.value.add(startMarker.value)
}

function setEndPoint(coords) {
  endCoords.value = coords

  if (endMarker.value) {
    map.value.remove(endMarker.value)
  }

  endMarker.value = new AMap.value.Marker({
    position: coords,
    title: '终点',
    icon: new AMap.value.Icon({
      imageSize: new AMap.value.Size(25, 34),
      image: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png'
    })
  })

  map.value.add(endMarker.value)
}

async function onStartPointInput() {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  if (!startPoint.value.trim()) {
    startSuggestions.value = []
    return
  }

  // 延迟搜索，避免频繁调用
  searchTimeout.value = setTimeout(() => {
    searchPlaces(startPoint.value, 'start')
  }, 300)
}

async function onEndPointInput() {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  if (!endPoint.value.trim()) {
    endSuggestions.value = []
    return
  }

  // 延迟搜索，避免频繁调用
  searchTimeout.value = setTimeout(() => {
    searchPlaces(endPoint.value, 'end')
  }, 300)
}

function searchPlaces(keyword, type) {
  if (!placeSearch.value) return

  placeSearch.value.search(keyword, (status, result) => {
    if (status === 'complete' && result.poiList && result.poiList.pois) {
      const suggestions = result.poiList.pois.map(poi => {
        const suggestion = {
          name: poi.name,
          district: Array.isArray(poi.address)
            ? (poi.address.length > 0 ? poi.address.join(';') : poi.cityname)
            : (poi.address || poi.district || poi.cityname),
          location: poi.location,
          address: Array.isArray(poi.address) ? poi.address.join(';') : poi.address,
          pname: poi.pname || poi.pcode || '',
          cityname: poi.cityname || poi.citycode || '',
          adname: poi.adname || poi.adcode || ''
        }

        // 如果没有地理信息，使用默认的香港地区信息
        if (!suggestion.pname && !suggestion.cityname && !suggestion.adname) {
          suggestion.pname = '香港特别行政区'
          suggestion.cityname = '香港特别行政区'
          if (poi.district) {
            suggestion.adname = poi.district
          }
        }

        return suggestion
      })

      if (type === 'start') {
        startSuggestions.value = suggestions
      } else {
        endSuggestions.value = suggestions
      }
    } else {
      if (type === 'start') {
        startSuggestions.value = []
      } else {
        endSuggestions.value = []
      }
    }
  })
}

function selectStartSuggestion(suggestion) {
  startPoint.value = suggestion.name
  const coords = [suggestion.location.lng, suggestion.location.lat]
  setStartPoint(coords)
  startSuggestions.value = []
  showStartSuggestions.value = false
}

function selectEndSuggestion(suggestion) {
  endPoint.value = suggestion.name
  const coords = [suggestion.location.lng, suggestion.location.lat]
  setEndPoint(coords)
  endSuggestions.value = []
  showEndSuggestions.value = false
}

function hideStartSuggestions() {
  setTimeout(() => {
    showStartSuggestions.value = false
  }, 200) // 延迟隐藏，允许点击选择
}

function hideEndSuggestions() {
  setTimeout(() => {
    showEndSuggestions.value = false
  }, 200) // 延迟隐藏，允许点击选择
}

async function planRoute() {
  if (!canPlanRoute.value) return

  isPlanning.value = true
  multipleRoutes.value = []
  selectedRouteIndex.value = 0

  try {
    // 使用选定的策略进行路线规划
    const routeData = await callRouteJSAPI()

    // 提取驾车打车费（非方案级，来自顶层结果）
    if (routeType.value === 'driving') {
      drivingTaxiCost.value = (routeData && routeData.taxi_cost != null) ? `${routeData.taxi_cost} 元` : null
    } else {
      drivingTaxiCost.value = null
    }

    // 根据路线类型获取正确的路线数据
    const routesData = getRoutesData(routeData)

    if (routesData && Array.isArray(routesData) && routesData.length > 0) {
      // 清除之前的路线绘制
      clearRoutePolylines()

      // 处理多条路线结果
      const routes = routesData.map((route, index) => {
        const routeInfo = parseRouteData(route)
        const routeSteps = parseRouteSteps(route)
        return {
          ...routeInfo,
          strategyName: `方案${index + 1}`,
          policy: strategy.value,
          color: getRouteColor(),
          routeData: route,
          routeSteps: routeSteps,
          expanded: false,
          visible: index === 0
        }
      })

      multipleRoutes.value = routes

      if (routes.length > 0) {
        selectedRouteIndex.value = 0
        // 绘制第一条路线
        drawSelectedRoute(0)
      }
    }
  } catch (error) {
    console.error('路径规划失败:', error)
    emit('route-error', error)
  } finally {
    isPlanning.value = false
  }
}

async function callRouteJSAPI() {
  return new Promise((resolve, reject) => {
    const startPoint = new AMap.value.LngLat(startCoords.value[0], startCoords.value[1])
    const endPoint = new AMap.value.LngLat(endCoords.value[0], endCoords.value[1])

    let routeService

    switch (routeType.value) {
      case 'driving':
        routeService = new AMap.value.Driving({
          policy: parseInt(strategy.value), // 使用选定的策略
          map: null, // 不自动绘制，手动控制
          showTraffic: false,
          hideMarkers: true,
          autoFitView: false,
          extensions: 'all'
        })
        break

      case 'walking':
        routeService = new AMap.value.Walking({
          map: null,
          hideMarkers: true
        })
        break

      case 'bicycling':
        routeService = new AMap.value.Riding({
          map: null,
          hideMarkers: true
        })
        break

      case 'transit':
        routeService = new AMap.value.Transfer({
          policy: 0,
          map: null,
          extensions: 'all',
          city: props.city,
          hideMarkers: true
        })
        break

      default:
        routeService = new AMap.value.Driving({
          map: null,
          hideMarkers: true
        })
    }

    // 保存当前路径规划服务的引用
    currentRouteService.value = routeService

    routeService.search(startPoint, endPoint, (status, result) => {
      if (status === 'complete') {
        resolve(result)
      } else {
        reject(new Error(result.info || '路径规划失败'))
      }
    })
  })
}


// 根据路线类型获取正确的路线数据
function getRoutesData(routeData) {
  if (!routeData) return []

  // 公共交通使用 plans 字段，其他类型使用 routes 字段
  if (routeType.value === 'transit') {
    const plans = routeData.plans || []
    return Array.isArray(plans) ? plans : []
  } else {
    const routes = routeData.routes || []
    return Array.isArray(routes) ? routes : []
  }
}

// 解析路线数据
function parseRouteData(route) {
  let distance = '未知'
  let duration = '未知'
  let tolls = null

  // 公共交通数据结构不同
  if (routeType.value === 'transit') {
    // 公共交通：直接从 plan 对象获取数据
    if (route.distance) {
      distance = `${(route.distance / 1000).toFixed(2)} 公里`
    }
    if (route.time) {
      duration = formatMinutes(route.time)
    }
    if (route.cost) {
      tolls = `${route.cost} 元`
    }
  } else {
    // 其他交通方式
    if (route.distance) {
      distance = `${(route.distance / 1000).toFixed(2)} 公里`
    }
    if (route.time) {
      duration = formatMinutes(route.time)
    }
    if (route.tolls) {
      tolls = `${route.tolls} 元`
    }
  }

  return {
    distance,
    duration,
    tolls
  }
}

// 解析路线步骤
function parseRouteSteps(route) {
  if (!route) return []

  // 公共交通使用特殊的数据结构
  if (routeType.value === 'transit') {
    const segments = route.segments || []
    return parseTransitSegments(segments)
  }

  // 根据路线类型选择正确的步骤数据
  const stepsData = getStepsDataByType(route, routeType.value)
  if (!Array.isArray(stepsData) || stepsData.length === 0) {
    return []
  }

  return stepsData.map(step => {
    const distance = formatDistance(step.distance)

    // 根据当前路线类型设置 transit_mode
    let transitMode = 'DEFAULT'
    if (routeType.value === 'walking') {
      transitMode = 'WALK'
    } else if (routeType.value === 'driving') {
      transitMode = 'DRIVING'
    } else if (routeType.value === 'bicycling') {
      transitMode = 'BICYCLING'
    } else if (routeType.value === 'electrobike') {
      transitMode = 'ELECTROBIKE'
    }

    return {
      road: step.road || step.instruction || '未知道路',
      distance,
      instruction: step.instruction || '',
      transit_mode: step.transit_mode || transitMode
    }
  })
}

// 解析公共交通的 segments 数据
function parseTransitSegments(segments) {
  if (!segments || !Array.isArray(segments) || segments.length === 0) {
    return []
  }

  return segments.map(segment => {
    const distance = formatDistance(segment.distance)
    const duration = formatMinutes(segment.time)

    // 根据交通方式生成描述
    let road = segment.instruction || '未知路段'
    let stationInfo = ''

    if (segment.transit_mode === 'SUBWAY' && segment.transit) {
      // 地铁信息
      const transit = segment.transit
      if (transit.on_station && transit.off_station) {
        stationInfo = `${transit.on_station.name} → ${transit.off_station.name}`
        if (transit.lines && Array.isArray(transit.lines) && transit.lines.length > 0) {
          const line = transit.lines[0]
          if (line && line.name) {
            road = `${line.name}`
          }
        }
      }
    } else if (segment.transit_mode === 'BUS' && segment.transit) {
      // 巴士信息
      const transit = segment.transit
      if (transit.on_station && transit.off_station) {
        stationInfo = `${transit.on_station.name} → ${transit.off_station.name}`
        if (transit.lines && Array.isArray(transit.lines) && transit.lines.length > 0) {
          const line = transit.lines[0]
          if (line && line.name) {
            road = `${line.name}`
          }
        }
      }
    } else if (segment.transit_mode === 'WALK') {
      // 步行信息
      road = segment.instruction || '步行'
    }

    return {
      road: road,
      distance: distance,
      duration: duration,
      instruction: segment.instruction || '',
      transit_mode: segment.transit_mode || 'WALK',
      stationInfo: stationInfo
    }
  })
}

// 切换路线详情展开/收起
function toggleRouteDetails(index) {
  if (multipleRoutes.value[index]) {
    multipleRoutes.value[index].expanded = !multipleRoutes.value[index].expanded
  }
}

// 获取起点名称
function getStartPointName() {
  return startPoint.value || '起点'
}

// 获取路线颜色
function getRouteColor() {
  // 统一使用绿色
  return '#52c41a'
}

// 选择路线
function selectRoute(index) {
  selectedRouteIndex.value = index
  // 切换显示选中的路线
  drawSelectedRoute(index)
}

// 清除路线绘制对象
function clearRoutePolylines() {
  // 清除之前绘制的路线
  routePolylines.value.forEach(polyline => {
    if (polyline && map.value) {
      map.value.remove(polyline)
    }
  })
  routePolylines.value = []
}

// 绘制选中的路线
function drawSelectedRoute(index) {
  if (!multipleRoutes.value[index] || !map.value) return

  clearRoutePolylines()

  const route = multipleRoutes.value[index].routeData
  const color = multipleRoutes.value[index].color

  // 使用通用方法抽取路径
  const path = extractPathFromRoute(route, routeType.value)

  if (path.length > 0) {
    const polyline = new AMap.value.Polyline({
      path,
      strokeColor: color,
      isOutline: true,
      strokeWeight: 6,
      outlineColor: '#fff',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      showDir: true
    })

    map.value.add(polyline)
    routePolylines.value.push(polyline)
    map.value.setFitView([polyline])
  }
}



function clearRoute() {
  // 清除标记
  if (startMarker.value) {
    map.value.remove(startMarker.value)
    startMarker.value = null
  }
  if (endMarker.value) {
    map.value.remove(endMarker.value)
    endMarker.value = null
  }

  // 清除路线服务
  if (currentRouteService.value) {
    currentRouteService.value.clear()
    currentRouteService.value = null
  }

  // 清除多路线服务
  routeServices.value.forEach(service => {
    if (service && service.clear) {
      service.clear()
    }
  })
  routeServices.value = []

  // 清除路线绘制对象
  clearRoutePolylines()

  // 重置数据
  startPoint.value = ''
  endPoint.value = ''
  startCoords.value = null
  endCoords.value = null
  multipleRoutes.value = []
  selectedRouteIndex.value = 0
  drivingTaxiCost.value = null
}

function onRouteTypeChange() {
  if (startCoords.value && endCoords.value) {
    if (currentRouteService.value != null) {
      currentRouteService.value.clear()
      planRoute()
    }
  }
}

function destroyMap() {
  if (map.value) {
    map.value.destroy()
    map.value = null
  }
}
</script>

<style scoped>
.amap-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.amap-map {
  width: 100%;
  height: 100%;
}

.route-control-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 999;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.route-form {
  padding: 20px;
}

.route-form h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.input-with-suggestions {
  position: relative;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3366FF;
  box-shadow: 0 0 0 2px rgba(51, 102, 255, 0.1);
}

.form-group select option:disabled {
  color: #999;
  background-color: #f5f5f5;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.suggestion-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
}

.suggestion-location {
  font-size: 11px;
  color: #999;
  line-height: 1.2;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.plan-btn,
.clear-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.plan-btn {
  background: #3366FF;
  color: white;
}

.plan-btn:hover:not(:disabled) {
  background: #2952CC;
}

.plan-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.clear-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.clear-btn:hover {
  background: #ebebeb;
}

.route-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.route-info h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.route-details p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.route-details strong {
  color: #333;
}

/* 多路线样式 */
.multiple-routes {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.multiple-routes h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.route-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.route-option {
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.route-option:hover {
  border-color: #3366FF;
  box-shadow: 0 2px 8px rgba(51, 102, 255, 0.1);
}

.route-option.active {
  border-color: #3366FF;
  background: #f6f9ff;
  box-shadow: 0 2px 8px rgba(51, 102, 255, 0.15);
}


.routes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.route-taxi-cost {
  color: #13c2c2;
  font-weight: 500;
}

.route-option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.route-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.route-time {
  color: #3366FF;
  font-weight: 500;
  font-size: 14px;
}

.route-option-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.route-distance {
  color: #666;
}

.route-tolls {
  color: #fa8c16;
  font-weight: 500;
}

.route-expand-icon {
  margin-left: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  color: #666;
  transition: transform 0.3s ease;
}

.route-expand-icon svg.rotated {
  transform: rotate(180deg);
}

.route-expand-icon:hover {
  color: #3366FF;
}

/* 路线详细步骤样式 */
.route-steps {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 4px;
  padding: 12px;
}

.route-steps-header {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.start-point {
  font-size: 13px;
  color: #3366FF;
  font-weight: 500;
}

.route-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-left: 4px;
}

.route-step:last-child {
  margin-bottom: 0;
}

.step-icon {
  margin-right: 12px;
  margin-top: 2px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-road {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  margin-bottom: 2px;
  line-height: 1.4;
}

.step-distance {
  font-size: 11px;
  color: #999;
  line-height: 1.3;
}

.step-duration {
  margin-left: 8px;
  color: #666;
  font-weight: 500;
}

.step-stations {
  font-size: 11px;
  color: #1890ff;
  margin-bottom: 2px;
  font-weight: 500;
}

/* 交通方式图标样式 */
.transit-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
  font-size: 12px;
}

.walk-icon {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.subway-icon {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}

.bus-icon {
  background-color: #fff7e6;
  border: 1px solid #ffd591;
  color: #ff7a00;
}

.default-icon {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}
</style>