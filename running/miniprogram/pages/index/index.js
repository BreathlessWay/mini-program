const app = getApp();

const loginMixin = require("../../mixins/login");

const dayjs = require("dayjs");
const lget = require("lodash.get");

Page({
  data: {
    canIUseGetUserProfile: false,
  },
  behaviors: [loginMixin],
  async onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
    // await this.getWeather();
    // await this.getHoliday()
    // await this.getSoulSoup()
    // await this.getPlanData()
    // await this.getNewsData();
    // await this.getHistoryData()
    // await this.getGushiData();
    // await this.getChengyuData()
  },
  onShow() {
    if (!this.data.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
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
    try {
      await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "login",
          user: e.detail.userInfo,
        },
      });

      this.setData({
        userInfo: {
          avatarUrl: lget(e, "detail.userInfo.avatarUrl"),
          gender: lget(e, "detail.userInfo.gender"),
          nickName: lget(e, "detail.userInfo.nickName"),
        },
      });
    } catch (error) {
      console.log(error.errMsg);
    }
  },
  async getUserProfile(e) {
    try {
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
      this.setData({
        userInfo: {
          avatarUrl: lget(res, "userInfo.avatarUrl"),
          gender: lget(res, "userInfo.gender"),
          nickName: lget(res, "userInfo.nickName"),
        },
      });
    } catch (error) {
      console.log(error.errMsg);
    }
  },
  async getSoulSoup() {
    try {
      const res = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getSoulSoupData",
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error.errMsg);
    }
  },
  async getHoliday() {
    try {
      const res = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getHolidayData",
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error.errMsg);
    }
  },
  async getPlanData() {
    try {
      const runResult = await wx.getWeRunData();
      const res = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getPlanData",
          month: dayjs().format("YYYY-MM"),
          date: new Date(),
          cloudID: runResult.cloudID,
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error.errMsg);
    }
  },
  async getNewsData() {
    try {
      const res = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getNewsData",
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error.errMsg);
    }
  },
  async getHistoryData() {
    try {
      const res = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getHistoryData",
          size: 10,
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error.errMsg);
    }
  },
  async getGushiData() {
    try {
      const res = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getGushiData",
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error.errMsg);
    }
  },
  async getChengyuData() {
    try {
      const res = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getChengyuData",
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error.errMsg);
    }
  },
});
