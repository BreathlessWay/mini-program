const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.cloudbase.sendSms({
        "env": 'personal-22c51c',
        "phoneNumberList": [
          "+8615801949316"
        ],
        "smsType": 'Notification',
        "templateId": '923584',
        "templateParamList": [
          "商品",
          "/index.html"
        ],
        useShortName: false
      })
      console.log(result)
    return result
  } catch (err) {
    return err
  }
}
