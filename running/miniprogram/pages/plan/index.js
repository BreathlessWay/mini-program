const dayjs = require("dayjs");
const lget = require("lodash.get");

const currentMonth = dayjs().format("YYYY-MM");

Page({
  data: {
    planList: [],
    target: 0,
    startTime: '',
    endTime: '',
    filterDate: currentMonth,
    loading: false,
    disabled: false,
  },
  async onShow() {
    await this.getPlanData(this.data.filterDate);
  },
  async getPlanData(month) {
    this.setData({
      disabled: currentMonth === month,
    });
    wx.showLoading({
      title: "获取运动计划",
    });
    try {
      const plan = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "getPlanData",
          month,
        },
      });
      const planData = lget(plan, "result.data.plan") || [],
        target = lget(plan, "result.data.target") || 0;

      this.setData({
        planList: planData,
        target,
      });
    } catch (error) {
      wx.showToast({
        title: "运动计划走丢了...",
        icon: "error",
      });
    } finally {
      wx.hideLoading();
    }
  },
  async handleChangeDate(date) {
    this.setData({
      filterDate: date,
    });
    await this.getPlanData(date);
  },
  handleInputTarget(e) {
    this.setData({
      target: Number(e.detail.value),
    });
  },
  bindStartTimeChange(e) {
    this.setData({
      startTime: e.detail.value,
    });
  },
  bindEndTimeChange(e) {
    this.setData({
      endTime: e.detail.value,
    });
  },
  async handleSubmit() {
    this.setData({
      loading: true,
    });
    try {
    } catch (error) {
      wx.showToast({
        title: "神秘力量在阻碍！",
        icon: "error",
      });
    } finally {
      this.setData({
        loading: false,
      });
    }
  },
});
