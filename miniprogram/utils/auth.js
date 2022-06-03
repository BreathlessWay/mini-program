const AUTH_KEY = "user_info";

export const setUserInfo = (data) => {
  wx.setStorageSync(AUTH_KEY, data);
};

export const getUserInfo = () => {
  return wx.getStorageSync(AUTH_KEY);
};

export const removeUserInfo = (data) => {
  wx.removeStorageSync(AUTH_KEY);
};
