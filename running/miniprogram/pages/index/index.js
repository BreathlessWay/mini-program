Page({
  data: {},
  async onLoad() {
    const soulSoupData = await wx.cloud.callFunction({
      name: "running",
      data: {
        type: "getHistoryData",
        size: 10
      },
    });

    console.log(soulSoupData);
  },
});
