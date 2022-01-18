const dayjs = require("dayjs");
const lget = require("lodash.get");

Page({
  data: {
    planList: [],
    filterDate: dayjs().format("YYYY-MM"),
  },
  async onShow() {
    await this.getPlanData(this.data.filterDate);
  },
  toDecimal(x) {
    return isNaN(parseFloat(x)) ? 0 : Math.round(x * 100) / 100;
  },
  async getPlanData(month) {
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

      let planList = [];
      if (planData.length) {
        planList = planData.map((item) => {
          const { endStep = 0, startStep = 0 } = item.stepInfo || {};
          if (endStep) {
            const stepCount = endStep - startStep;
            return {
              day: item.day,
              stepCount,
              target,
              percent: this.toDecimal((stepCount / target) * 100),
            };
          }
          return {
            day: item.day,
            stepCount: 0,
            target,
            percent: 0,
          };
        });
      }
      this.setData({
        planList,
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
  async bindDateChange(e) {
    this.setData({
      filterDate: e.detail.value,
    });
    await this.getPlanData(e.detail.value);
  },
});
