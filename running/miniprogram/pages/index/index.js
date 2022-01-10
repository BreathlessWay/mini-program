Page({
  data: {},
  async onLoad() {
    const soulSoupData = await wx.cloud.callFunction({
      name: "running",
      data: {
        type: "getNewsData"
      },
    });

    console.log(soulSoupData);
  },
});
