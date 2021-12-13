// pages/todo/index.js
const db = wx.cloud.database(),
  todos = db.collection("todos");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    item: null
  },
  location: {},
  onLoad() {
    this.getList();
  },
  getList() {
    todos.get().then((res) => {
      this.setData({
        list: res.data,
      });
    });
  },
  onSubmit(e) {
    todos
      .add({
        data: {
          title: e.detail.value.title,
          _createTime: Date.now(),
          _updateTime: Date.now(),
          ...this.location,
        },
      })
      .then(() => {
        wx.showToast({
          title: "添加成功",
          icon: "success",
        });
      })
      .then(this.getList);
  },
  onClick(e) {
    todos
      .doc(e.target.dataset.id)
      .get()
      .then((res) => {
        this.setData({
          item: res.data
        })
      });
  },
  onLocation() {
    wx.chooseLocation({
      success: (res) => {
        const { errMsg, ...rest } = res;
        this.location = rest;
      },
    });
  },
  go(){
    wx.openLocation({
      latitude: this.data.item.latitude,
      longitude: this.data.item.longitude,
      name: this.data.item.name,
      address: this.data.item.address,
    })
  }
});
