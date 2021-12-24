const db = wx.cloud.database(),
  _ = db.command;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    detail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id,
    });
    this.getDetail(options.id);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: this.data.detail.title,
      imageUrl: this.data.detail.img,
    };
  },
  async getDetail(id) {
    console.log(this.data.id);
    const doc = await db.collection("emall").doc(id);
    await doc.update({
      data: {
        count: _.inc(1),
      },
    });
    const res = await doc.get();
    console.log(res);
    this.setData({
      detail: res.data,
    });
  },
});
