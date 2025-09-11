// 空气质量健康指数API服务
import request from './request.js'

export const fetchAirQualityData = async () => {
  try {
    const response = await request.get('/air-quality/aqhi')
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.data
  } catch (error) {
    console.error('获取空气质量数据失败:', error)
    throw error
  }
}

export default {
  fetchAirQualityData
}