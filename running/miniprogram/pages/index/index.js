const lget = require("../../miniprogram_npm/lodash.get/index");

Page({
  data: {
    userInfo: null,
  },
  async onLoad() {
    await this.login();
    // await this.getWeather();
  },
  async login() {
    try {
      const userInfo = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "login",
        },
      });
      this.setData({
        userInfo: lget(userInfo, "result.data"),
      });
    } catch (error) {
      console.log(error.errMsg);
    }
  },
  async getWeather() {
    try {
      const location = await wx.getLocation({
        type: "gcj02",
      });
      const weather = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getWeatherData",
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
      console.log(weather);
    } catch (error) {
      console.log(error.errMsg);
    }
  },
  async getUserInfo(e) {
    const soulSoupData = await wx.cloud.callFunction({
      name: "running",
      data: {
        type: "login",
        userInfo: e.detail.userInfo,
      },
    });
  },
});
