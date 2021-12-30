// 云函数入口文件
require("module-alias/register");

const cloud = require("wx-server-sdk"),
  getWeatherData = require("@/weather/index"),
  getSoulSoupData = require("@/soulSoup/index"),
  { env } = require("@/constants");

cloud.init({
  env,
});

// 云函数入口函数
exports.main = async (event, context) => {
  const { type, ...rest } = event;
  switch (type) {
    case "getWeatherData":
      return await getWeatherData(cloud, rest, context);
    case "getSoulSoupData":
      return await getSoulSoupData(cloud, rest, context);
  }
};
