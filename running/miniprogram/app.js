const { envList } = require("./envList");
const { userStore, SET_USER } = require("./store/user");

const lget = require("lodash.get");

App({
  async onLaunch() {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: envList.running,
        traceUser: true,
      });
    }
    await this.login();
  },
  async login() {
    try {
      const userInfo = await wx.cloud.callFunction({
        name: "running",
        data: {
          type: "login",
        },
      });
      const userDetail = lget(userInfo, "result.data");
      if (userDetail) {
        userStore.trigger(SET_USER, userDetail);
      }
    } catch (error) {
      wx.showToast({
        title: "登录失败",
        icon: "error",
      });
    }
  },
  onError(error) {
    console.log(error);
  },
  onUnhandledRejection(error) {
    console.log(error);
  },
  globalData: {
    userInfo: {
      avatarUrl:
        "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLicu70LG0j0RFukvz8SCrzB6gGRAAYibbzCFEVtiaib17G05q5wWFTMMos6RARVmK38Qf5ry9uico4oOQ/132",
      gender: 0,
      nickName: "曜灵",
      setting: [1, 1, 1, 1],
    },
  },
});
