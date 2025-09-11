// 交通信息API服务
import request from './request.js'

export const fetchTrafficInfo = async () => {
  try {
    const response = await request.get('/traffic/info')
    
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return parseTrafficXML(response.data)
  } catch (error) {
    console.error('获取交通信息失败:', error)
    throw error
  }
}

const parseTrafficXML = (xmlText) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    
    const messages = xmlDoc.querySelectorAll('message')
    const trafficData = []

    messages.forEach(message => {
      const incident = {
        id: getElementText(message, 'ID'),
        incidentNumber: getElementText(message, 'INCIDENT_NUMBER'),
        headingCn: getElementText(message, 'INCIDENT_HEADING_CN'),
        headingEn: getElementText(message, 'INCIDENT_HEADING_EN'),
        detailCn: getElementText(message, 'INCIDENT_DETAIL_CN'),
        detailEn: getElementText(message, 'INCIDENT_DETAIL_EN'),
        locationCn: getElementText(message, 'LOCATION_CN'),
        locationEn: getElementText(message, 'LOCATION_EN'),
        districtCn: getElementText(message, 'DISTRICT_CN'),
        districtEn: getElementText(message, 'DISTRICT_EN'),
        directionCn: getElementText(message, 'DIRECTION_CN'),
        directionEn: getElementText(message, 'DIRECTION_EN'),
        announcementDate: getElementText(message, 'ANNOUNCEMENT_DATE'),
        statusCn: getElementText(message, 'INCIDENT_STATUS_CN'),
        statusEn: getElementText(message, 'INCIDENT_STATUS_EN'),
        nearLandmarkCn: getElementText(message, 'NEAR_LANDMARK_CN'),
        nearLandmarkEn: getElementText(message, 'NEAR_LANDMARK_EN'),
        betweenLandmarkCn: getElementText(message, 'BETWEEN_LANDMARK_CN'),
        betweenLandmarkEn: getElementText(message, 'BETWEEN_LANDMARK_EN'),
        contentCn: getElementText(message, 'CONTENT_CN'),
        contentEn: getElementText(message, 'CONTENT_EN'),
        latitude: getElementText(message, 'LATITUDE'),
        longitude: getElementText(message, 'LONGITUDE')
      }
      
      trafficData.push(incident)
    })

    return trafficData
  } catch (error) {
    console.error('解析交通信息XML失败:', error)
    throw new Error('交通信息数据格式错误')
  }
}

const getElementText = (parent, tagName) => {
  const element = parent.querySelector(tagName)
  return element ? element.textContent.trim() : ''
}

export default {
  fetchTrafficInfo
}