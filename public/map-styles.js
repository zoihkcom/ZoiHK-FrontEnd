// 通用地图样式配置和功能
// 可在所有地图页面中使用

// 全局变量
let currentBaseLayer = null;

// 地图样式配置
const mapStyles = {
  wikimedia: {
    name: "Wikimedia",
    urls: ["https://maps.wikimedia.org/osm-intl/${z}/${x}/${y}.png"],
    attribution: "© OpenStreetMap contributors, © Wikimedia Foundation",
  },
  "esri-satellite": {
    name: "ESRI Satellite",
    urls: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}",
    ],
    attribution:
      "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
  "cartodb-positron": {
    name: "CartoDB Positron",
    urls: [
      "https://a.basemaps.cartocdn.com/light_nolabels/${z}/${x}/${y}.png",
      "https://b.basemaps.cartocdn.com/light_nolabels/${z}/${x}/${y}.png",
      "https://c.basemaps.cartocdn.com/light_nolabels/${z}/${x}/${y}.png",
    ],
    attribution: "© OpenStreetMap contributors, © CartoDB",
  },
  "cartodb-light": {
    name: "CartoDB Light",
    urls: [
      "https://a.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png",
      "https://b.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png",
      "https://c.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png",
    ],
    attribution: "© OpenStreetMap contributors, © CartoDB",
  },
};

// 创建地图图层
function createMapLayer(styleKey) {
  const style = mapStyles[styleKey];
  return new OpenLayers.Layer.XYZ(style.name, style.urls, {
    sphericalMercator: true,
    wrapDateLine: true,
    numZoomLevels: 20,
  });
}

// 切换地图样式
function changeMapStyle(styleKey) {
  if (!window.map) {
    console.error('Map not initialized');
    return;
  }
  
  if (currentBaseLayer) {
    window.map.removeLayer(currentBaseLayer);
  }
  
  currentBaseLayer = createMapLayer(styleKey);
  window.map.addLayer(currentBaseLayer);
  
  // 确保标记层在最上层
  if (window.markersLayer) {
    window.map.setLayerIndex(window.markersLayer, window.map.layers.length - 1);
  }
}

// 初始化地图样式（默认为维基地图）
function initMapWithStyle(mapInstance, defaultStyle = 'wikimedia') {
  window.map = mapInstance;
  currentBaseLayer = createMapLayer(defaultStyle);
  window.map.addLayer(currentBaseLayer);
  return currentBaseLayer;
}

// 通用CSS样式（可通过JavaScript动态添加）
function addMapStyleSelectorCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .map-style-selector {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 8px;
      padding: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    .map-style-selector select {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      background: white;
    }
  `;
  document.head.appendChild(style);
}

// 创建样式选择器HTML
function createMapStyleSelector() {
  const selector = document.createElement('div');
  selector.className = 'map-style-selector';
  selector.innerHTML = `
    <select id="mapStyleSelector" onchange="changeMapStyle(this.value)">
      <option value="wikimedia" selected>维基地图</option>
      <option value="esri-satellite">ESRI 卫星图</option>
      <option value="cartodb-positron">CartoDB 简洁</option>
      <option value="cartodb-light">CartoDB 浅色</option>
    </select>
  `;
  document.body.appendChild(selector);
}

// 自动初始化（如果页面加载完成）
document.addEventListener('DOMContentLoaded', function() {
  addMapStyleSelectorCSS();
});
