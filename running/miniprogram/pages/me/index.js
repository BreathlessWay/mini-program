const app = getApp();

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
  },
  onUnload() {
    userStore.off(SET_USER, this.setUserInfo);
  },
  async setUserInfo(userInfo) {
    app.globalData.userInfo = userInfo;
    this.setData({
      userInfo,
    });
  },
});
