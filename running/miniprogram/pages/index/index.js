Page({
  data: {},
  async onLoad() {
    const soulSoupData = await wx.cloud.callFunction({
      name: "running",
      data: {
        type: "getChengyuData",
      },
    });

    console.log(soulSoupData);
  },
  async getUserInfo(e){
    const soulSoupData = await wx.cloud.callFunction({
      name: "running",
      data: {
        type: "login",
        userInfo: e.detail.userInfo
      },
    });

    console.log(soulSoupData);
  }
});
