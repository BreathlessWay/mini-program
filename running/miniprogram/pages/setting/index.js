const app = getApp();

const lget = require("lodash.get");

Page({
  data: {
    userInfo: null,
    array: ["未知", "男", "女"],
    canIUseGetUserProfile: false,
    items: [
      { value: "0", name: "新闻" },
      { value: "1", name: "历史上的今天" },
      { value: "2", name: "一句诗词" },
      { value: "3", name: "成语" },
    ],
  },

  onShow() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
    if (app.globalData.userInfo) {
      const { setting } = app.globalData.userInfo,
        { items } = this.data;
      items.forEach((_) => {
        _.checked = !!setting[_.value];
      });

      this.setData({
        userInfo: app.globalData.userInfo,
        items,
      });
    }
  },
  async setUserInfo(userInfo) {
    await wx.cloud.callFunction({
      name: "running",
      data: {
        type: "login",
        user: userInfo,
      },
    });
    app.globalData.userInfo = userInfo;
    this.setData({
      userInfo,
    });
  },
  async getUserInfo(e) {
    try {
      wx.showLoading({
        title: "获取用户信息...",
      });
      await this.setUserInfo({
        avatarUrl: lget(e, "detail.userInfo.avatarUrl"),
        gender: lget(e, "detail.userInfo.gender"),
        nickName: lget(e, "detail.userInfo.nickName"),
        setting: [1, 1, 1, 1],
      });
    } catch (error) {
      wx.showToast({
        title: "获取用户信息失败",
        icon: "error",
      });
    } finally {
      wx.hideLoading();
    }
  },
  async getUserProfile() {
    try {
      wx.showLoading({
        title: "获取用户信息...",
      });
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      const res = await wx.getUserProfile({
        desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      });

      await this.setUserInfo({
        avatarUrl: lget(res, "userInfo.avatarUrl"),
        gender: lget(res, "userInfo.gender"),
        nickName: lget(res, "userInfo.nickName"),
        setting: [1, 1, 1, 1],
      });
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: "获取用户信息失败",
        icon: "error",
      });
    } finally {
      wx.hideLoading();
    }
  },
  bindKeyInputUserName(e) {
    this.setData({
      "userInfo.nickName": e.detail.value,
    });
  },
  checkboxChange(e) {
    const setting = [0, 0, 0, 0];
    e.detail.value.forEach((_, index) => {
      if (_) {
        setting[index] = 1;
      }
    });
    this.setData({
      "userInfo.setting": setting,
    });
  },
  handleSubmit() {
    console.log(this.data.userInfo);
  },
});
