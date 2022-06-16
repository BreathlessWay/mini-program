import {
  USER_INFO_KEY
} from '../constants';

const app = getApp();

export const setUserInfo = (data) => {
  app.globalData.userInfo = data
  wx.setStorageSync(USER_INFO_KEY, data);
};

export const getUserInfo = () => {
  return wx.getStorageSync(USER_INFO_KEY);
};

export const removeUserInfo = (data) => {
  app.globalData.userInfo = null
  wx.removeStorageSync(USER_INFO_KEY);
};