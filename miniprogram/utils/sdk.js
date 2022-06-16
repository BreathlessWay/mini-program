const getSystemInfoSync = wx.getSystemInfoSync

let systemInfoCache = null;

Object.defineProperty(wx, 'getSystemInfoSync', {
  get: function () {
    return () => {
      if (!systemInfoCache) {
        const res = getSystemInfoSync()
        systemInfoCache = res
      }
      return systemInfoCache
    }
  }
})

const getAccountInfoSync = wx.getAccountInfoSync;

let accountInfoCache = null;

Object.defineProperty(wx, 'getAccountInfoSync', {
  get: function () {
    return () => {
      if (!accountInfoCache) {
        const res = getAccountInfoSync()
        accountInfoCache = res
      }
      return accountInfoCache
    }
  }
})