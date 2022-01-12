Page({
  data: {},
  async onLoad() {
    // const soulSoupData = await wx.cloud.callFunction({
    //   name: "running",
    //   data: {
    //     type: "getBmiData",
    //     height: 170,
    //     weight: 80,
    //     gender: 1,
    //   },
    // });

    // console.log(soulSoupData);
    await this.login();
    // await this.getWeather();
  },
  async login() {
    try {
      const userInfo = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "login",
        },
      });
      console.log(userInfo);
    } catch (error) {
      console.log(error.errMsg);
    }
  },
  async getWeather() {
    try {
      const location = await wx.getLocation({
        type: "gcj02",
      });
      const weather = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getWeatherData",
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
      console.log(weather);
    } catch (error) {
      console.log(error.errMsg);
    }
  },
});
