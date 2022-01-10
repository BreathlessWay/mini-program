const lget = require("lodash").get,
  getWeather = require("./getWeather"),
  locationToAddress = require("./locationToAddress"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { locationMapDbName, successStatus } = require("@/constants");

const weatherApi = async (cloud, event) => {

  const db = cloud.database(),
    locationMapDb = db.collection(locationMapDbName);

  let city = "";

  const { latitude, longitude } = event;

  const cacheCity = await locationMapDb
    .where({
      location: new db.Geo.Point(longitude, latitude),
    })
    .get();

  if (cacheCity && cacheCity.data.length) {
    city = lget(cacheCity, "data.0.city");
  } else {
    const res = await locationToAddress(cloud, {
      latitude,
      longitude,
    });
    city = lget(res, "data.ad_info.city");
    await locationMapDb.add({
      data: {
        location: new db.Geo.Point(longitude, latitude),
        city,
      },
    });
  }

  const weathResult = await getWeather(cloud, city);
  return {
    errMsg: "",
    status: successStatus,
    data: weathResult.data,
  };
};

module.exports = tryCatchWrap(weatherApi, '获取天气信息失败');
