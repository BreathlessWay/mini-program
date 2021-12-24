// pages/cart/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  async handleOrder() {
    const res = await wx.chooseAddress();
    console.log(res);
  },
});
