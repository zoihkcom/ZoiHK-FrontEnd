// 航班信息API服务
import request from './request.js'

export const fetchFlightArrivals = async (date = '') => {
  try {
    const response = await request.get('/flight/arrivals', {
      params: { date }
    })
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.data
  } catch (error) {
    console.error('获取到达航班信息失败:', error)
    throw error
  }
}

export const fetchFlightDepartures = async (date = '') => {
  try {
    const response = await request.get('/flight/departures', {
      params: { date }
    })
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.data
  } catch (error) {
    console.error('获取出发航班信息失败:', error)
    throw error
  }
}

export default {
  fetchFlightArrivals,
  fetchFlightDepartures
}