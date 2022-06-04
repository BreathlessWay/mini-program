import lget from "lodash.get";

import Toast from '@vant/weapp/toast/toast';

import {
  setUserInfo,
  removeUserInfo
} from "../../utils/auth";

const app = getApp();

const timeGap = 24 * 60 * 60 * 1000;

Page({
  data: {
    soulSoupData: null,
    oneData: null,
    userInfo: null,
    register: false,
    time: null,
    timeData: {},
    showExpireTime: false,
    showLastTime: false,
    timeGap
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
  onShareAppMessage() {
    return {
      title: '快来看看你的核酸快过期了没',
      imageUrl: '../../images/9eaf88140610a50ac7f7dead40b41c7c.jpeg'
    }
  },
  onShareTimeline() {
    return {
      title: '快来看看你的核酸快过期了没',
      imageUrl: '../../images/f3237e65947dce3670ec424b773ea6f7.jpeg'
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
      errMsg,
      status
    } = e.detail
    if (data) {
      this.updateUserInfo(data, errMsg)
    }
    this.setData({
      register: false,
      [status]: false
    })
  },
  handleSetLastTime() {
    this.setData({
      showLastTime: true
    })
  },
  handleSetExpireTime() {
    this.setData({
      showExpireTime: true,
    })
  },
  handlTimeCountChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
});