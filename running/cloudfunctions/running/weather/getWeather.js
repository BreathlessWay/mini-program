const superagent = require("superagent"),
  lget = require("lodash").get,
  dayjs = require("dayjs"),
  { weatherMapDbName, weatherKey } = require("@/constants");

module.exports = async function (cloud, city) {
  let weatherData = null;
  if (!city) return weatherData;
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
      return weatherData;
    }
  }

  const start = dayjs().format("YYYY/MM/DD");
  const res = await superagent.get(
      `https://api.seniverse.com/v3/weather/daily.json?key=${weatherKey}&location=${encodeURIComponent(
        city
      )}&start=${start}`
    ),
    weather = lget(res, "body.results.0.daily.0");

  if (weatherData && weatherData._id) {
    await weatherMapDb.doc(weatherData._id).update({
      data: {
        ...weather,
      },
    });
    return {
      ...weatherData,
      ...weather,
    };
  }

  const addResult = await weatherMapDb.add({
    data: {
      city,
      ...weather,
    },
  });
  return {
    _id: addResult._id,
    city,
    ...weather,
  };
};
