/**
 * Google Maps Routes API Service
 * 使用新的 Routes API 替代传统的 Directions API
 */

const API_ENDPOINT = 'https://routes.googleapis.com/directions/v2:computeRoutes'

/**
 * 出行方式映射：从前端选项到 Routes API 参数
 */
const TRAVEL_MODE_MAP = {
  'DRIVING': 'DRIVE',
  'WALKING': 'WALK', 
  'TRANSIT': 'TRANSIT',
  'BICYCLING': 'BICYCLE',
  'TWO_WHEELER': 'TWO_WHEELER' // Routes API 新增
}

/**
 * 创建 Waypoint 对象
 * @param {string|object} location - 可以是地址字符串、Place ID 或坐标对象
 * @returns {object} Routes API waypoint 对象
 */
function createWaypoint(location) {
  if (typeof location === 'object' && location.placeId) {
    return {
      placeId: location.placeId
    }
  }
  
  if (typeof location === 'string') {
    // 检查是否是坐标格式 (lat,lng)
    const coords = location.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/)
    if (coords) {
      return {
        location: {
          latLng: {
            latitude: parseFloat(coords[1]),
            longitude: parseFloat(coords[2])
          }
        }
      }
    }
    
    // 否则作为地址处理
    return {
      address: location
    }
  }
  
  throw new Error('Invalid location format')
}

/**
 * 使用 Routes API 计算路线
 * @param {object} params - 路线计算参数
 * @param {string} apiKey - Google Maps API Key
 * @returns {Promise<object>} 路线计算结果
 */
export async function computeRoutes(params, apiKey) {
  const {
    origin,
    destination,
    travelMode = 'DRIVE',
    computeAlternativeRoutes = false,
    routingPreference = 'TRAFFIC_AWARE',
    languageCode = 'zh-CN',
    units = 'METRIC'
  } = params

  const requestBody = {
    origin: createWaypoint(origin),
    destination: createWaypoint(destination),
    travelMode: TRAVEL_MODE_MAP[travelMode] || 'DRIVE',
    routingPreference,
    computeAlternativeRoutes,
    languageCode,
    units
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.description,routes.legs,routes.viewport'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Routes API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`)
    }

    const result = await response.json()
    
    // 直接返回 Routes API 原生格式
    return result
    
  } catch (error) {
    console.error('Routes API request failed:', error)
    throw error
  }
}

/**
 * 格式化距离显示
 * @param {number} distanceMeters - 距离（米）
 * @returns {string} 格式化的距离文本
 */
export function formatDistance(distanceMeters) {
  if (!distanceMeters) return '-'
  
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} 米`
  } else {
    return `${(distanceMeters / 1000).toFixed(1)} 公里`
  }
}

/**
 * 格式化时长显示
 * @param {string} duration - ISO 8601 时长字符串 (如 "1234s")
 * @returns {string} 格式化的时长文本
 */
export function formatDuration(duration) {
  if (!duration) return '-'
  
  const seconds = parseDurationToSeconds(duration)
  if (!seconds) return '-'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours} 小时 ${minutes} 分钟`
  } else {
    return `${minutes} 分钟`
  }
}

/**
 * 解析 ISO 8601 时长字符串为秒数
 * @param {string} duration - 时长字符串 (如 "1234s")
 * @returns {number} 秒数
 */
export function parseDurationToSeconds(duration) {
  if (!duration) return 0
  
  // Routes API 返回格式如 "1234s"
  const match = duration.match(/^(\d+(?:\.\d+)?)s$/)
  if (match) {
    return parseFloat(match[1])
  }
  
  return 0
}