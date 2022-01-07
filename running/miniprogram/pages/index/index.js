Page({
  data: {},
  async onLoad() {
    await wx.login();
    const res = await wx.getWeRunData();
    const soulSoupData = await wx.cloud.callFunction({
      name: "running",
      data: {
        type: "getPlanData",
        cloudID: res.cloudID,
        date: new Date(),
        month: '2022-01'
      },
    });

    console.log(soulSoupData);
  },
});
