import { setUserInfo, removeUserInfo } from "../../utils/auth";

const app = getApp();

Page({
  data: {
    canIUseGetUserProfile: false,
    userInfo: null,
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
  },
  async onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }
  },
  async setUserInfo(userInfo) {
    app.globalData.userInfo = userInfo;
    this.setData({
      userInfo,
    });
    setUserInfo(userInfo);
  },
  async getUserInfo(e) {
    try {
      wx.showLoading({
        title: "登录中...",
      });
      await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "login",
          user: e.detail.userInfo,
        },
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
  async getUserProfile(e) {
    try {
      wx.showLoading({
        title: "登录中...",
      });
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      const res = await wx.getUserProfile({
        desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      });
      await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "login",
          user: res.userInfo,
        },
      });

      await this.setUserInfo({
        avatarUrl: lget(res, "userInfo.avatarUrl"),
        gender: lget(res, "userInfo.gender"),
        nickName: lget(res, "userInfo.nickName"),
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
  logout() {
    removeUserInfo();
    app.globalData.userInfo = null;
    this.setData({
      userInfo: null,
    });
  },
});
