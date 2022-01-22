import lget from "lodash.get";

const app = getApp();

Page({
  data: {
    height: 0,
    weight: 0,
    array: ["保密", "男", "女"],
    gender: 0,
    loading: false,
    showData: null,
  },

  onShow() {
    this.setData({
      gender: lget(app, "globalData.userInfo.gender"),
    });
  },

  bindKeyInputHeight(e) {
    this.setData({
      height: Number(e.detail.value),
    });
  },

  bindKeyInputWeight(e) {
    this.setData({
      weight: Number(e.detail.value),
    });
  },

  bindPickerChange(e) {
    this.setData({
      gender: Number(e.detail.value),
    });
  },

  async handleCalcBmi() {
    this.setData({
      loading: true,
    });
    try {
      const { height, weight, gender } = this.data;
      const res = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getBmiData",
          height,
          weight,
          gender,
        },
      });
      this.setData({
        showData: lget(res, "result.data"),
      });
    } catch (error) {
      wx.showToast({
        title: "绝世身材好到爆",
        icon: "error",
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },
});
