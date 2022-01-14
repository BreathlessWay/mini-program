const app = getApp();

const loginMixin = require("../../mixins/login");

const dayjs = require("dayjs");
const lget = require("lodash.get");

Page({
  data: {
    canIUseGetUserProfile: false,
    weatherData: null,
    holidayData: null,
    soulSoupData: null,
    gushiData: null,
    chengyuData: null,
    planData: null,
    newsData: [],
    historyData: [],
    errMsg: [],
  },
  behaviors: [loginMixin],
  async onLoad() {
    try {
      wx.showLoading({
        title: "Running",
      });
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true,
        });
      }
      await this.getOnLoadData();
    } catch (e) {
    } finally {
      wx.hideLoading();
    }
  },
  async onShow() {
    try {
      wx.showNavigationBarLoading();
      await this.getOnShowData();
    } catch (error) {
    } finally {
      wx.hideNavigationBarLoading();
    }
  },
  async onPullDownRefresh() {
    try {
      await this.getOnLoadData();
      await this.getOnShowData();
    } catch (error) {
    } finally {
      wx.stopPullDownRefresh();
    }
  },
  onShareAppMessage() {
    return {
      title: "震惊，我今天跑了900步后...",
      path: "/page/index",
      imageUrl: "../../images/photo-1513593771513-7b58b6c4af38.jpeg",
    };
  },
  onShareTimeline() {
    return {
      title: "我今天跑了5000步，快来试试你能跑多少",
      query: "",
      imageUrl: "../../images/photo-1465188162913-8fb5709d6d57.jpeg",
    };
  },
  onAddToFavorites() {
    return {
      title: "跑 R",
      imageUrl: "../../images/photo-1488778578932-0f84d315fcae.jpeg",
      query: "",
    };
  },
  getOnLoadData() {
    return Promise.all([
      // this.getWeather(),
      // this.getHoliday(),
      // this.getSoulSoup(),
      // this.getGushiData(),
      // this.getChengyuData(),
    ]);
  },
  getOnShowData() {
    return Promise.all([
      // this.getPlanData(),
      // this.getNewsData(),
      // this.getHistoryData(),
    ]);
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
      this.setData({
        weatherData: lget(weather, "result.data"),
      });
    } catch (error) {
      this.setData({
        errMsg: this.data.errMsg.push("天气"),
      });
    }
  },
  async getUserInfo(e) {
    try {
      wx.showLoading();
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
          setting: [1, 1, 1, 1],
        },
      });
    } catch (error) {
      wx.showToast({
        title: "获取用户信息失败",
        icon: "error",
      });
    } finally {
      wx.hideLoading();
    }
  },
  async getUserProfile(e) {
    try {
      wx.showLoading();
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      const res = await wx.getUserProfile({
        desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
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
          setting: [1, 1, 1, 1],
        },
      });
    } catch (error) {
      wx.showToast({
        title: "获取用户信息失败",
        icon: "error",
      });
    } finally {
      wx.hideLoading();
    }
  },
  async getSoulSoup() {
    try {
      const soulSoup = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getSoulSoupData",
        },
      });
      this.setData({
        soulSoupData: lget(soulSoup, "result.data"),
      });
    } catch (error) {
      this.setData({
        errMsg: this.data.errMsg.push("鸡汤"),
      });
    }
  },
  async getHoliday() {
    try {
      const holiday = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getHolidayData",
        },
      });
      this.setData({
        holidayData: lget(holiday, "result.data"),
      });
    } catch (error) {
      this.setData({
        errMsg: this.data.errMsg.push("节假日"),
      });
    }
  },
  async getPlanData() {
    try {
      const runResult = await wx.getWeRunData();
      const plan = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getPlanData",
          month: dayjs().format("YYYY-MM"),
          date: new Date(),
          cloudID: runResult.cloudID,
        },
      });
      this.setData({
        planData: lget(plan, "result.data"),
      });
    } catch (error) {
      this.setData({
        errMsg: this.data.errMsg.push("运动计划"),
      });
    }
  },
  async getNewsData() {
    try {
      const news = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getNewsData",
        },
      });
      this.setData({
        newsData: lget(news, "result.data"),
      });
    } catch (error) {
      this.setData({
        errMsg: this.data.errMsg.push("新闻"),
      });
    }
  },
  async getHistoryData() {
    try {
      const history = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getHistoryData",
          size: 10,
        },
      });
      this.setData({
        historyData: lget(history, "result.data"),
      });
    } catch (error) {
      this.setData({
        errMsg: this.data.errMsg.push("历史上的今天"),
      });
    }
  },
  async getGushiData() {
    try {
      const gushi = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getGushiData",
        },
      });
      this.setData({
        gushiData: lget(gushi, "result.data"),
      });
    } catch (error) {
      this.setData({
        errMsg: this.data.errMsg.push("古诗"),
      });
    }
  },
  async getChengyuData() {
    try {
      const chengyu = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getChengyuData",
        },
      });
      this.setData({
        chengyuData: lget(chengyu, "result.data"),
      });
    } catch (error) {
      this.setData({
        errMsg: this.data.errMsg.push("成语"),
      });
    }
  },
});
