Page({
  data: {},
  async onLoad() {
    const res = await wx.getLocation({
      type: 'gcj02'
    });

    const weathData = await wx.cloud.callFunction({
      name: "running",
      data: {
        type: 'getWeatherData',
        latitude: res.latitude,
        longitude: res.longitude,
      },
    });

    console.log(weathData)
  },
});
