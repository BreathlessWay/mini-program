const cloud = require("wx-server-sdk"),
  lget = require("lodash").get,
  getWeather = require("./getWeather"),
  locationToAddress = require("./locationToAddress"),
  { locationMapDbName, env } = require("@/constants");

cloud.init({
  env,
});

const db = cloud.database(),
  locationMapDb = db.collection(locationMapDbName);

module.exports = async (event) => {
  const result = {
    errMsg: "",
    status: 0,
    data: null,
  };
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
      if (res.data) {
        city = lget(res, "data.ad_info.city") || "";
        await locationMapDb.add({
          data: {
            location: new db.Geo.Point(longitude, latitude),
            city,
          },
        });
      }
    }
    result.errMsg = "";
    result.data = await getWeather(cloud, city);
    result.status = 0;
  } catch (err) {
    result.errMsg = err.message;
    result.data = null;
    result.status = 600;
  }

  return result;
};
