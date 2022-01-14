const lget = require("lodash.get");
const app = getApp();

module.exports = Behavior({
  data: {
    userInfo: null,
  },
  async created() {
    await this.login();
  },
  pageLifetimes: {
    show() {
      if (!this.data.userInfo && app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
        });
      }
    },
  },
  methods: {
    async login() {
      try {
        const userInfo = await wx.cloud.callFunction({
          name: "running",
          data: {
            type: "login",
          },
        });
        const userDetail = lget(userInfo, "result.data");
        this.setData({
          userInfo: userDetail,
        });
        app.globalData.userInfo = userDetail;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
