const superagent = require("superagent"),
  lget = require("lodash").get,
  dayjs = require("dayjs"),
  { weatherMapDbName, weatherPrivateKey } = require("@/constants");

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
      ...weatherData,
      ...weather,
      ...life,
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
    _id: addResult._id,
    city,
    ...weather,
    ...life,
  };
};
