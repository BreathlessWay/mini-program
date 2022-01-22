import dayjs from "dayjs";
import lget from "lodash.get";

const app = getApp();

Page({
  data: {
    userInfo: null,
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
  async onLoad() {
    try {
      wx.showLoading({
        title: "Running",
        mask: true,
      });
      await this.getOnLoadData();
    } catch (e) {
    } finally {
      wx.hideLoading();
    }
  },
  async onShow() {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
    if (app.globalData.userInfo) {
      try {
        wx.showNavigationBarLoading();
        await this.getOnShowData();
      } catch (error) {
      } finally {
        wx.hideNavigationBarLoading();
      }
    }
  },
  async onPullDownRefresh() {
    try {
      await this.getOnLoadData();
      if (this.data.userInfo) {
        await this.getOnShowData();
      }
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
      this.getWeather(),
      this.getHoliday(),
      this.getNewsData(),
      this.getHistoryData(),
    ]);
  },
  getOnShowData() {
    return Promise.all([
      this.getPlanData(),
      this.getSoulSoup(),
      this.getGushiData(),
      this.getChengyuData(),
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
