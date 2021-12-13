// index.js
// const app = getApp()
const { envList } = require("../../envList.js");

Page({
  data: {
    showUploadTip: false,
    powerList: [
      {
        title: "云函数",
        tip: "安全、免鉴权运行业务代码",
        showItem: false,
        item: [
          {
            title: "获取OpenId",
            page: "getOpenId",
          },
          //  {
          //   title: '微信支付'
          // },
          {
            title: "生成小程序码",
            page: "getMiniProgramCode",
          },
          // {
          //   title: '发送订阅消息',
          // }
        ],
      },
      {
        title: "数据库",
        tip: "安全稳定的文档型数据库",
        showItem: false,
        item: [
          {
            title: "创建集合",
            page: "createCollection",
          },
          {
            title: "更新记录",
            page: "updateRecord",
          },
          {
            title: "查询记录",
            page: "selectRecord",
          },
          {
            title: "聚合操作",
            page: "sumRecord",
          },
        ],
      },
      {
        title: "云存储",
        tip: "自带CDN加速文件存储",
        showItem: false,
        item: [
          {
            title: "上传文件",
            page: "uploadFile",
          },
        ],
      },
      {
        title: "云托管",
        tip: "不限语言的全托管容器服务",
        showItem: false,
        item: [
          {
            title: "部署服务",
            page: "deployService",
          },
        ],
      },
    ],
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false,
  },

  async onLoad() {
    const db = wx.cloud.database({ env: "personal-22c51c" });
    const _ = db.command;
    const sale = await db.collection("sales").count();
    console.log({ sale });

    const data = await db
      .collection("todos")
      .doc("18ed0968619f63c3074b8d1b205becc2")
      .update({
        data: {
          done: true,
        },
      });
    console.log(data);

    const m = await db
      .collection("todos")
      .doc("859059a5619f79920817e26d5828b700")
      .update({
        data: {
          location: _.remove(),
          "tags.0": _.set("fuck you"),
        },
      });
    console.log(m);

    const res = await db
      .collection("todos")
      .where(
        _.or([
          {
            tags: _.eq("database"),
          },
          {
            "style.color": _.eq("yellow"),
          },
        ])
      )
      .get({ explain: true });

    console.log(res);
  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (
      powerList[index].title === "数据库" &&
      !this.data.haveCreateCollection
    ) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList,
      });
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map((i) => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach((i) => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false,
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: "",
    });
    wx.cloud
      .callFunction({
        name: "quickstartFunctions",
        config: {
          env: this.data.selectedEnv.envId,
        },
        data: {
          type: "createCollection",
        },
      })
      .then((resp) => {
        if (resp.result.success) {
          this.setData({
            haveCreateCollection: true,
          });
        }
        this.setData({
          powerList,
        });
        wx.hideLoading();
      })
      .catch((e) => {
        console.log(e);
        this.setData({
          showUploadTip: true,
        });
        wx.hideLoading();
      });
  },

  getUserInfo(e) {
    console.log(e);
  },
  sms() {
    console.log("send");
    wx.cloud.callFunction({
      name: "sms",
    });
  },
  pay() {
    console.log("pay");
    wx.cloud
      .callFunction({
        name: "pay",
      })
      .then(() => {
        wx.requestPayment({
          success(res) {
            console.log(res)
          },

          fail(res) {},
        });
      });
  },
});
