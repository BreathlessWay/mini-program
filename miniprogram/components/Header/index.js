import lget from "lodash.get";

import Toast from '@vant/weapp/toast/toast';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lastHeSuanTime: {
      type: Number
    },
    expiration: {
      type: Number,
      value: null
    },
    userInfo: {
      type: Object
    },
    showLastTime: {
      type: Boolean,
      value: false
    },
    showExpireTime: {
      type: Boolean,
      value: false
    }
  },
  observers: {
    'expiration'(val) {
      this.setData({
        expirationInputValue: val
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showPopup: false,
    showDialog: false,
    statusBarHeight: 0,
    expirationInputValue: 0,
    expirationError: false,
    expirationErrorMsg: '',
    formLastTime: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${Number(value)}月`;
      }
      if (type === 'day') {
        return `${Number(value)}日`;
      }
      if (type === 'hour') {
        return `${Number(value)}时`;
      }
      if (type === 'minute') {
        return `${Number(value)}分`;
      }
      return value;
    },
    beforeClose(action) {
      if (action === 'confirm') {
        return false;
      }
      return true;
    }
  },

  attached() {
    // this.setData({
    //   statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
    // });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleSelectSetting(e) {
      // currentTarget 事件触发【函数】绑定的元素
      // target 事件触发的元素
      const selectItem = e.currentTarget.dataset.setting;
      this.selectComponent('#item').toggle();
      if (!this.data.userInfo) {
        Toast('尚未登录，请先登录！');
        return
      }

      if (selectItem === '0') {
        this.setData({
          showPopup: true
        })
        return
      }
      if (selectItem === '1') {
        this.setData({
          showDialog: true
        })
        return
      }
    },
    async handleSetLastTime(e) {
      this.triggerEvent('updateTime', {
        data: {
          lastHeSuanTime: e.detail,
          shouldNotice: true
        },
        status: 'showLastTime',
        errMsg: '设置最近一次核酸时间失败'
      })

      const shouldNotice = lget(this, 'data.userInfo.shouldNotice');

      if (shouldNotice) return;
      try {
        await wx.requestSubscribeMessage({
          tmplIds: ['1AJpNVMAJEYqa9pm3laXCokhJzoev-HiMDXjE6rSSTs'],
        })
      } catch (e) {}
    },
    handleCloseSetLastTime() {
      this.triggerEvent('updateTime', {
        status: 'showLastTime',
      })
    },
    handleCloseDialog() {
      this.setData({
        expirationInputValue: lget(this, 'data.expiration'),
        expirationError: false,
        expirationErrorMsg: ''
      })
      this.triggerEvent('updateTime', {
        status: 'showExpireTime',
      })
    },
    handleConfirmDialog() {
      const expirationInputValue = this.data.expirationInputValue;
      if (expirationInputValue < 24) {
        this.setData({
          expirationError: true,
          expirationErrorMsg: '核酸有效时间需要大于24小时'
        })
      } else {
        this.setData({
          expirationError: false,
          expirationErrorMsg: '',
        })
        this.triggerEvent('updateTime', {
          data: {
            expiration: this.data.expirationInputValue
          },
          status: 'showExpireTime',
          errMsg: '设置核酸有效时间失败'
        })
      }
    }
  }
})