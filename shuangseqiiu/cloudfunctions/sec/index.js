const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  try {
    const result = await cloud.openapi.security.msgSecCheck({
        "openid": wxContext.OPENID,
        "scene": 2,
        "version": 2,
        "content": event.msg
      })
    return result
  } catch (err) {
    return err
  }
}
