const _page = Page;

Page = function (options) {
  options.data.mode = null
  options.data.userInfo = null

  const _onLoad = options.onLoad;

  const onLoad = async function () {
    const accountInfo = wx.getAccountInfoSync()
    const mode = await new Promise(resolve => {
      setTimeout(() => {
        resolve(accountInfo.miniProgram.appId)
      }, 0)
    })
    this.setData({
      mode
    })
    _onLoad && _onLoad.apply(this, arguments);
  }

  options.onLoad = onLoad

  const _onShow = options.onShow

  const onShow = function () {
    this.setData({
      userInfo: getApp().globalData.userInfo
    })
    _onShow && _onShow.apply(this, arguments);
  }

  options.onShow = onShow

  return _page(options)
}