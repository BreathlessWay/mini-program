const db = wx.cloud.database();

Page({
  data: {
    list: [],
    banner: [],
  },
  async onLoad() {
    this.getBanner();
    wx.showLoading({
      title: "加载中...",
    });
    await this.handleGetGood();
    wx.hideLoading();
  },
  async onPullDownRefresh() {
    await this.handleGetGood();
    wx.stopPullDownRefresh();
  },
  async handleGetUserInfo(e) {
    console.log(e.detail);
    const res = await wx.cloud.callFunction({
      name: "login",
      data: {
        a: 1,
        b: 2,
      },
    });
    console.log(res);
  },
  randomTitle(min = 5, max = 20) {
    const str =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz0123456789 ",
      strLength = str.length,
      titleLen = Math.floor(Math.random() * (max - min)) + min;

    let title = "";
    for (let i = 0; i < titleLen; i++) {
      let chart = str[Math.floor(Math.random() * strLength)];
      while ((i === 0 || i === titleLen - 1) && chart === " ") {
        chart = str[Math.floor(Math.random() * strLength)];
      }
      title += chart;
    }

    return title;
  },
  randomTag() {
    const tagLen = Math.floor(Math.random() * 3) + 2,
      tagArray = [];

    for (let i = 0; i < tagLen; i++) {
      tagArray.push(this.randomTitle(2, 8));
    }
    return tagArray;
  },
  async handleAddGood() {
    const image = await wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
    });
    const file = image.tempFilePaths[0],
      fileSplit = file.split("."),
      fileExt = fileSplit[fileSplit.length - 1];

    wx.showLoading({
      title: "加载中...",
    });
    const uploadImage = await wx.cloud.uploadFile({
      cloudPath: `image/${Math.floor(Math.random() * 1000000)}.${fileExt}`, // 上传至云端的路径
      filePath: image.tempFilePaths[0], // 小程序临时文件路径
    });
    await db.collection("emall").add({
      data: {
        count: Math.floor(Math.random() * 100),
        title: this.randomTitle(),
        desc: this.randomTitle(10, 30),
        price: Math.floor(Math.random() * 100),
        tags: this.randomTag(),
        img: uploadImage.fileID,
      },
    });

    await this.handleGetGood();
    wx.hideLoading();
  },
  async getBanner() {
    const res = await db
      .collection("emall")
      .orderBy("count", "desc")
      .limit(4)
      .get();
    console.log(res);
    this.setData({
      banner: res.data,
    });
  },
  async handleGetGood() {
    const res = await db.collection("emall").get();

    this.setData({
      list: res.data,
    });
  },
  handleJump(e) {
    wx.navigateTo({
      url: `/pages/detail/index?id=${e.currentTarget.dataset.id}`,
    });
  },
  handleAddCart() {},
  handleDeleteCart() {},
});
