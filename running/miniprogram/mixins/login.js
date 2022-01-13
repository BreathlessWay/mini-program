const lget = require("lodash.get");

module.exports = Behavior({
  data: {
    userInfo: null,
  },
  async created() {
    await this.login();
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
        getApp().globalData.userInfo = userDetail;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
