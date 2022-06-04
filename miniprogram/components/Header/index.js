import lget from "lodash.get";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lastHeSuanTime: {
      type: Number,
      value: new Date().getTime()
    },
    expiration: {
      type: Number,
      value: null
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
    statusBarHeight: 0,
    showPopup: false,
    showDialog: false,
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
  },

  attached() {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
    });
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
      this.setData({
        showPopup: false
      })
      this.triggerEvent('updateTime', {
        data: {
          lastHeSuanTime: e.detail
        },
        errMsg: '设置最近一次核酸时间失败'
      })
    },
    handleCancelSetLastTime() {
      this.setData({
        showPopup: false
      })
    },
    handleCloseDialog() {
      this.setData({
        expirationInputValue: lget(this, 'data.expiration'),
        showDialog: false
      })
    },
    async handleConfirmDialog() {
      this.triggerEvent('updateTime', {
        data: {
          expiration: this.data.expirationInputValue
        },
        errMsg: '设置核酸有效时间失败'
      })
    }
  }
})