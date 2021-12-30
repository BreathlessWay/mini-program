// 云函数入口文件
process.env.TZ = "Asia/Shanghai";

require("module-alias/register");

const cloud = require("wx-server-sdk"),
  getWeatherData = require("@/weather/index"),
  getSoulSoupData = require("@/soulSoup/index"),
  getHolidayData = require("@/holiday/index"),
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
    case "getHolidayData":
      return await getHolidayData(cloud, rest, context);
  }
};
