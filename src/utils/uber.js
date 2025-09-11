/**
 * 生成Uber网页版链接
 * @param {Object} pickup 起点信息
 * @param {number} pickup.lat 起点纬度
 * @param {number} pickup.lng 起点经度
 * @param {string} pickup.name 起点名称 (可选)
 * @param {Object} destination 目的地信息
 * @param {number} destination.lat 目的地纬度
 * @param {number} destination.lng 目的地经度
 * @param {string} destination.name 目的地名称 (可选)
 * @returns {string} Uber网页版链接URL
 */
export function generateUberDeepLink(pickup, destination) {
  // 验证必需参数
  if (!pickup || !destination) {
    throw new Error("起点和目的地信息不能为空");
  }

  if (typeof pickup.lat !== "number" || typeof pickup.lng !== "number") {
    throw new Error("起点经纬度必须是数字");
  }

  if (
    typeof destination.lat !== "number" ||
    typeof destination.lng !== "number"
  ) {
    throw new Error("目的地经纬度必须是数字");
  }

  // 设置默认名称
  const pickupData = {
    lat: pickup.lat,
    lng: pickup.lng,
    name: pickup.name || "起点",
  };

  const destData = {
    lat: destination.lat,
    lng: destination.lng,
    name: destination.name || "目的地",
  };

  // 移动端和桌面端都使用统一的网页版链接格式
  const pickupParam = {
    latitude: pickupData.lat,
    longitude: pickupData.lng,
    addressLine1: pickupData.name,
  };

  const dropParam = {
    latitude: destData.lat,
    longitude: destData.lng,
    addressLine1: destData.name,
  };

  const pickupParamStr = encodeURIComponent(JSON.stringify(pickupParam));
  const dropParamStr = encodeURIComponent(JSON.stringify(dropParam));

  return `https://m.uber.com/looking?pickup=${pickupParamStr}&drop[0]=${dropParamStr}`;
}

/**
 * 打开Uber网页版
 * @param {string} uberUrl Uber链接URL
 */
export function openUber(uberUrl) {
  if (!uberUrl) {
    throw new Error("Uber链接不能为空");
  }

  // 直接打开网页版链接
  window.open(uberUrl, "_blank");
}

/**
 * 简化版本：直接传入经纬度生成Uber链接
 * @param {number} pickupLat 起点纬度
 * @param {number} pickupLng 起点经度
 * @param {number} destLat 目的地纬度
 * @param {number} destLng 目的地经度
 * @param {string} pickupName 起点名称 (可选)
 * @param {string} destName 目的地名称 (可选)
 * @returns {string} Uber网页版链接URL
 */
export function generateUberLink(
  pickupLat,
  pickupLng,
  destLat,
  destLng,
  pickupName,
  destName
) {
  return generateUberDeepLink(
    { lat: pickupLat, lng: pickupLng, name: pickupName },
    { lat: destLat, lng: destLng, name: destName }
  );
}

/**
 * 从当前位置到目的地的Uber网页版链接
 * @param {number} destLat 目的地纬度
 * @param {number} destLng 目的地经度
 * @param {string} destName 目的地名称 (可选)
 * @returns {Promise<string>} Uber网页版链接URL
 */
export async function generateUberLinkFromCurrentLocation(
  destLat,
  destLng,
  destName
) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("浏览器不支持地理位置功能"));
      return;
    }

    if (typeof destLat !== "number" || typeof destLng !== "number") {
      reject(new Error("目的地经纬度必须是数字"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const pickup = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: "当前位置",
          };

          const destination = {
            lat: destLat,
            lng: destLng,
            name: destName || "目的地",
          };

          const uberUrl = generateUberDeepLink(pickup, destination);
          resolve(uberUrl);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        let errorMessage = "获取当前位置失败";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "位置权限被拒绝，请在浏览器设置中允许位置访问";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "位置信息不可用";
            break;
          case error.TIMEOUT:
            errorMessage = "获取位置超时";
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}

export default {
  generateUberDeepLink,
  generateUberLink,
  generateUberLinkFromCurrentLocation,
  openUber,
};
