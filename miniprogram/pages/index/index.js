import lget from "lodash.get";

import Toast from '@vant/weapp/toast/toast';

import {
  setUserInfo
} from "../../utils/auth";

const app = getApp();

Page({
  data: {
    soulSoupData: null,
    canIUseGetUserProfile: false,
    userInfo: null,
    register: false,
    time: null
  },
  async onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
  },
  async onShow() {
    if (app.globalData.userInfo) {
      const {
        lastHeSuanTime,
        expiration
      } = app.globalData.userInfo
      let time = 0
      if (lastHeSuanTime && expiration) {
        time = lastHeSuanTime + expiration * 60 * 60 * 1000 - Date.now()
        time = time < 0 ? 0 : time
      }
      this.setData({
        userInfo: app.globalData.userInfo,
        expirationInputValue: lget(app.globalData.userInfo, 'expiration'),
        time
      });
      await this.getSoulSoup()
    } else {
      await this.login()
    }
  },
  async login() {
    try {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      const userInfo = await wx.cloud.callFunction({
        name: "hesuan",
        data: {
          type: "user",
        },
      });
      const userDetail = lget(userInfo, "result.data");
      if (userDetail) {
        this.setUserInfo(userDetail);
        await this.getSoulSoup()
      } else {
        this.setData({
          register: true,
        });
      }
    } catch (error) {
      Toast.fail('登录失败');
    } finally {
      Toast.clear();
    }
  },
  async setUserInfo(userInfo) {
    app.globalData.userInfo = userInfo;
    const {
      lastHeSuanTime,
      expiration
    } = userInfo
    let time = 0
    if (lastHeSuanTime && expiration) {
      time = lastHeSuanTime + expiration * 60 * 60 * 1000 - Date.now()
      time = time < 0 ? 0 : time
    }
    this.setData({
      userInfo,
      expirationInputValue: lget(userInfo, 'expiration'),
      time
    });
    const {
      soup,
      user_id,
      _id,
      ...rest
    } = userInfo
    setUserInfo(rest);
    await this.getSoulSoup()
  },
  async getUserInfo(e) {
    await this.updateUserInfo(e.detail.userInfo, '获取用户信息失败')
  },
  async getUserProfile() {
    try {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      // 只能在外层才能触发，只能被页面上的按钮点击事件触发
      const res = await wx.getUserProfile({
        desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      });
      await this.updateUserInfo(res.userInfo, '获取用户信息失败')
    } catch (error) {
      Toast.fail('获取用户信息失败');
    } finally {
      Toast.clear()
    }
  },
  async getSoulSoup() {
    try {
      const soulSoup = await wx.cloud.callFunction({
        name: "hesuan",
        data: {
          type: "getSoulSoupData",
        },
      });
      this.setData({
        soulSoupData: lget(soulSoup, "result.data"),
      });
    } catch (error) {
      this.setData({
        errMsg: this.data.errMsg.push("鸡汤"),
      });
    }
  },
  async updateUserInfo(data, errMsg) {
    try {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      const userResult = await wx.cloud.callFunction({
        name: "hesuan",
        data: {
          type: "user",
          user: data,
        },
      });
      await this.setUserInfo(lget(userResult, "result.data"));
    } catch (e) {
      Toast.fail(errMsg);
    } finally {
      Toast.clear()
    }
  },
  updateTime(e) {
    const {
      data,
      errMsg
    } = e.detail
    this.updateUserInfo(data, errMsg)
  }
});