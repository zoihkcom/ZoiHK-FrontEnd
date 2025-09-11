// 医院急症轮候时间API服务
import request from './request.js'

export const fetchHospitalWaitTime = async () => {
  try {
    const response = await request.get('/hospital/wait-time')
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.data
  } catch (error) {
    console.error('获取医院轮候时间失败:', error)
    throw error
  }
}

export default {
  fetchHospitalWaitTime
}