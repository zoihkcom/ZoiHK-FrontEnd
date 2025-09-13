// 法定古蹟 API
import request from './request.js'

/**
 * 获取法定古蹟（GeoJSON FeatureCollection）
 * 后端接口：/heritage/monuments
 */
export async function fetchMonuments() {
  try {
    const res = await request.get('/heritage/monuments')
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`)
    return res.data
  } catch (e) {
    console.error('获取法定古蹟数据失败:', e)
    throw e
  }
}

export default { fetchMonuments }

