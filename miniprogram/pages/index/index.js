import lget from "lodash.get";

import Toast from '@vant/weapp/toast/toast';

import {
  setUserInfo,
  removeUserInfo
} from "../../utils/auth";

const app = getApp();

Page({
  data: {
    soulSoupData: null,
    oneData: null,
    userInfo: null,
    register: false,
    time: null
  },
  async onLoad() {
    const oneDataResult = await wx.cloud.callFunction({
      name: "hesuan",
      data: {
        type: "one",
      },
    });
    this.setData({
      oneData: lget(oneDataResult, 'result.data')
    })
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
        time
      });
      await this.getSoulSoup()
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
  logout() {
    this.setData({
      soulSoupData: null,
      userInfo: null,
      time: null
    })
    removeUserInfo()
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
  async getSoulSoup() {
    if (this.data.soulSoupData) return
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
    } catch (error) {}
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
  emitUpdateUserInfo(e) {
    const {
      data,
      errMsg
    } = e.detail
    this.updateUserInfo(data, errMsg)
  }
});