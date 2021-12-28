// 云函数入口文件
require("module-alias/register");

const getWeatherData = require("@/weather/index");

// 云函数入口函数
exports.main = async (event, context) => {
  const { type, ...rest } = event;
  switch (type) {
    case "getWeatherData":
      return await getWeatherData(rest, context);
  }
};
