// 云函数入口文件
process.env.TZ = "Asia/Shanghai";

require("module-alias/register");

const cloud = require("wx-server-sdk"),
  user = require("@/user/index"),
  getSoulSoupData = require("@/soulSoup/index"),
  getOneData = require("@/one/index"),
  {
    env
  } = require("@/constants");

cloud.init({
  env,
});

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const {
      type,
      ...rest
    } = event;
    switch (type) {
      case "user":
        return await user(cloud, rest, context);
      case "getSoulSoupData":
        return await getSoulSoupData(cloud, rest, context);
      case "one":
        return await getOneData(cloud, rest, context);
    }
  } catch (error) {
    throw error.errMsg || error.message;
  }
};