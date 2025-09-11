import request from './request.js'

/**
 * 获取访客出入境繁忙度数据
 * @returns {Promise} API响应数据
 */
export const getVisitorQueueTime = () => {
  return request({
    url: '/immigration/queue-time/visitor',
    method: 'GET'
  })
}

/**
 * 获取居民出入境繁忙度数据
 * @returns {Promise} API响应数据
 */
export const getResidentQueueTime = () => {
  return request({
    url: '/immigration/queue-time/resident',
    method: 'GET'
  })
}

/**
 * 同时获取访客和居民出入境繁忙度数据
 * @returns {Promise} 包含访客和居民数据的对象
 */
export const getImmigrationQueueTime = async () => {
  try {
    const [visitorResponse, residentResponse] = await Promise.all([
      getVisitorQueueTime(),
      getResidentQueueTime()
    ])
    
    return {
      data: {
        visitor: visitorResponse.data,
        resident: residentResponse.data
      }
    }
  } catch (error) {
    throw error
  }
}

/**
 * 口岸中文名称映射
 */
export const portNames = {
  'HYW': '红磡站',
  'HZM': '港珠澳大桥香港口岸',
  'LMC': '落马洲管制站',
  'LSC': '落马洲支线管制站',
  'LWS': '罗湖管制站',
  'MKT': '文锦渡管制站',
  'SBC': '深圳湾管制站',
  'STK': '启德邮轮码头'
}

/**
 * 获取口岸中文名称
 * @param {string} portCode 口岸代码
 * @returns {string} 口岸中文名称
 */
export const getPortName = (portCode) => {
  return portNames[portCode] || portCode
}

/**
 * 获取状态文本描述
 * @param {number} statusCode 状态码
 * @returns {string} 状态描述
 */
export const getStatusText = (statusCode) => {
  switch (statusCode) {
    case 0: return '正常'
    case 1: return '繁忙'
    case 2: return '非常繁忙'
    case 4: return '维护中'
    case 99: return '非服务时间'
    default: return '未知'
  }
}

/**
 * 获取状态文本颜色类名
 * @param {number} statusCode 状态码
 * @returns {string} CSS类名
 */
export const getStatusTextColor = (statusCode) => {
  switch (statusCode) {
    case 0: return 'text-green-600'
    case 1: return 'text-yellow-600'
    case 2: return 'text-red-600'
    case 4: return 'text-purple-600'
    case 99: return 'text-slate-500'
    default: return 'text-slate-400'
  }
}

/**
 * 获取口岸状态背景色类名
 * @param {number} maxStatus 最大状态码
 * @returns {string} CSS类名
 */
export const getPortStatusColor = (maxStatus) => {
  switch (maxStatus) {
    case 0: return 'bg-green-500'
    case 1: return 'bg-yellow-500'
    case 2: return 'bg-red-500'
    case 4: return 'bg-purple-500'
    case 99: return 'bg-slate-400'
    default: return 'bg-slate-300'
  }
}

/**
 * 获取等候时间描述
 * @param {number} statusCode 状态码
 * @param {string} userType 用户类型 ('resident' | 'visitor')
 * @returns {string} 等候时间描述
 */
export const getWaitingTime = (statusCode, userType) => {
  if (userType === 'resident') {
    switch (statusCode) {
      case 0: return '一般少于15分钟'
      case 1: return '一般少于30分钟'
      case 2: return '一般30分钟或以上'
      case 4: return '系统维护中'
      case 99: return '非服务时间'
      default: return '未知'
    }
  } else { // visitor
    switch (statusCode) {
      case 0: return '一般少于30分钟'
      case 1: return '一般少于45分钟'
      case 2: return '一般45分钟或以上'
      case 4: return '系统维护中'
      case 99: return '非服务时间'
      default: return '未知'
    }
  }
}

/**
 * 格式化更新时间
 * @returns {string} 格式化后的时间字符串
 */
export const formatUpdateTime = () => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}