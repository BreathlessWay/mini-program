const app = getApp();

Page({
  data: {
    userInfo: null,
  },

  onShow() {
    app.globalData.userInfo &&
      this.setData({
        userInfo: app.globalData.userInfo,
      });
  },
});
