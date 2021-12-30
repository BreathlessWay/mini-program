Page({
  data: {},
  async onLoad() {
    const soulSoupData = await wx.cloud.callFunction({
      name: "running",
      data:{
        type: 'getHolidayData'
      }
    });

    console.log(soulSoupData)
  },
});
