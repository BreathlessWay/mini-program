const lget = require("lodash.get");

Page({
  data: {
    userInfo: null,
    canIUseGetUserProfile: false,
  },
  async onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
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
    await wx.cloud.callFunction({
      name: "running",
      data: {
        type: "login",
        user: e.detail.userInfo,
      },
    });
  },
  async getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    const res = await wx.getUserProfile({
      desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    });
    await wx.cloud.callFunction({
      name: "running",
      data: {
        type: "login",
        user: res.userInfo,
      },
    });
  },
});
