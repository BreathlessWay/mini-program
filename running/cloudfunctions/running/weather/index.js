const cloud = require("wx-server-sdk"),
  lget = require("lodash").get,
  getWeather = require("./getWeather"),
  locationToAddress = require("./locationToAddress"),
  {
    locationMapDbName,
    env,
    otherStatus,
    successStatus,
  } = require("@/constants");

cloud.init({
  env,
});

const db = cloud.database(),
  locationMapDb = db.collection(locationMapDbName);

module.exports = async (event) => {
  try {
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
  } catch (err) {
    throw {
      errMsg: err.errMsg || err.message || "获取天气数据失败",
      status: err.errCode || err.status || otherStatus,
      data: null,
    };
  }
};
