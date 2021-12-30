const superagent = require("superagent"),
  lget = require("lodash").get,
  dayjs = require("dayjs"),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  {
    weatherMapDbName,
    weatherPrivateKey,
    successStatus,
  } = require("@/constants");

const getWeather = async (cloud, city) => {
  let weatherData = null;
  if (!city) {
    throw {
      data: weatherData,
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
        status: successStatus,
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

  if (!weather || !life) {
    throw {
      status: otherStatus,
      errMsg: "获取天气和生活指数失败",
    };
  }

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
      status: successStatus,
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
    status: successStatus,
    errMsg: "",
  };
};

module.exports = tryCatchWrap(getWeather, "获取天气数据失败");
