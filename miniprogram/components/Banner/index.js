const dayjs = require('dayjs'),
  date = dayjs().format('YYYY-MM-DD');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object
    },
    oneData: {
      type: Object,
    },
    register: {
      type: Boolean
    }
  },
  data: {
    date
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleLogin() {
      this.triggerEvent('login');
    },
    handleLogout() {
      this.triggerEvent('logout');
    }
  }
})