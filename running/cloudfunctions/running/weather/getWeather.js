const superagent = require("superagent"),
  lget = require("lodash").get,
  dayjs = require("dayjs"),
  { weatherMapDbName, weatherPrivateKey, otherStatus } = require("@/constants");

module.exports = async function (cloud, city) {
  try {
    let weatherData = null;
    if (!city) {
      return {
        data: weatherData,
        status: otherStatus,
        errMsg: "参数 city 缺失",
      };
    }
    const weatherMapDb = cloud.database().collection(weatherMapDbName),
      weatherList = await weatherMapDb
        .where({
          city,
        })
        .get();

    if (weatherList && weatherList.data.length) {
      const date = dayjs().format("YYYY-MM-DD");
      weatherData = lget(weatherList, "data.0") || {};
      if (weatherData.date === date) {
        return {
          data: weatherData,
          status: 0,
          errMsg: "",
        };
      }
    }

    const res = await Promise.all([
        superagent.get(
          `https://api.seniverse.com/v3/weather/daily.json?key=${weatherPrivateKey}&location=${encodeURIComponent(
            city
          )}&start=${dayjs().format("YYYY/MM/DD")}`
        ),
        superagent.get(
          `https://api.seniverse.com/v3/life/suggestion.json?key=${weatherPrivateKey}&location=${encodeURIComponent(
            city
          )}`
        ),
      ]),
      weather = lget(res, "0.body.results.0.daily.0"),
      life = lget(res, "1.body.results.0.suggestion");

    if (weatherData && weatherData._id) {
      await weatherMapDb.doc(weatherData._id).update({
        data: {
          ...weather,
          ...life,
        },
      });
      return {
        data: {
          ...weatherData,
          ...weather,
          ...life,
        },
        status: 0,
        errMsg: "",
      };
    }

    const addResult = await weatherMapDb.add({
      data: {
        city,
        ...weather,
        ...life,
      },
    });
    return {
      data: {
        _id: addResult._id,
        city,
        ...weather,
        ...life,
      },
      status: 0,
      errMsg: "",
    };
  } catch (err) {
    return {
      data: null,
      status: err.errCode || err.status || otherStatus,
      errMsg:
        lget(err, "response.body.status") || err.message || "获取天气失败",
    };
  }
};
