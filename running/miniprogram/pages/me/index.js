const app = getApp();

const dayjs = require("dayjs");

const { userStore, SET_USER } = require("../../store/user");

Page({
  data: {
    userInfo: null,
  },
  onLoad() {
    userStore.on(SET_USER, this.setUserInfo);
  },
  async onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }
    await this.getPlanData();
  },
  onUnload() {
    userStore.off(SET_USER, this.setUserInfo);
  },
  onPullDownRefresh() {},
  setUserInfo(userInfo) {
    this.setData({
      userInfo,
    });
  },
  async getPlanData() {
    try {
      const plan = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getPlanData",
          month: dayjs().format("YYYY-MM"),
        },
      });
      console.log(plan);
    } catch (error) {
      console.log(error);
    }
  },
});
