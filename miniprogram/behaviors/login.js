import Toast from '@vant/weapp/toast/toast';

import {
  setUserInfo,
  removeUserInfo
} from '../utils/auth'

export default Behavior({
  data: {
    canIUseGetUserProfile: false,
    register: false
  },
  attached() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
  },
  methods: {
    async login() {
      try {
        Toast.loading({
          message: '登录中...',
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
    getUserInfo(e) {
      this.setUserInfo(e.detail.userInfo);
    },
    async getUserProfile() {
      try {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        // 只能在外层才能触发，只能被页面上的按钮点击事件触发
        const res = await wx.getUserProfile({
          desc: "用于用户下单", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        });
        this.setUserInfo(res.userInfo);
      } catch (error) {
        Toast.fail('获取用户信息失败');
      } finally {
        Toast.clear()
      }
    },
    setUserInfo(userInfo) {
      this.setData({
        userInfo,
        register: false,
      });
      setUserInfo(userInfo);
    },
    logout() {
      removeUserInfo();
    }
  }
})