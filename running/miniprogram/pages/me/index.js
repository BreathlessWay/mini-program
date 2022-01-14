const { userStore, SET_USER } = require("../../store/user");

Page({
  data: {
    userInfo: null,
  },
  onLoad: function (options) {
    userStore.on(SET_USER, this.setUserInfo);
  },
  onShow: function () {},
  onUnload() {
    userStore.off(SET_USER, this.setUserInfo);
  },
  onPullDownRefresh: function () {},
  setUserInfo(userInfo) {
    this.setData({
      userInfo,
    });
  },
});
