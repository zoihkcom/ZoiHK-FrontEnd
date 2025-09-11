// 根据域名判断环境
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const CONFIG = {
  API_BASE_URL: isDevelopment 
    ? 'http://localhost:8901/api/v1' 
    : 'https://api.smarthk.one/api/v1'
};

// 全局暴露配置
window.APP_CONFIG = CONFIG;