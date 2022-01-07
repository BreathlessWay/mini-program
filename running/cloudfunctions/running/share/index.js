const lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { commonMapDbName, successStatus } = require("@/constants");

const shareApi = async (cloud, event) => {
  // weather soup stepCount target bg
  const db = cloud.database(),
    commonMapDb = db.collection(commonMapDbName),
    pic = await commonMapDb
      .field({
        code: true,
      })
      .get();

  let codeSrc = "";
  if (pic.data.length) {
    codeSrc = lget(pic, "data.0.code");
  } else {
    // 获取小程序二维码的buffer
    const resp = await cloud.openapi.wxacode.get({
      path: "pages/index/index",
    });
    const { buffer } = resp;
    // 将图片上传云存储空间
    const upload = await cloud.uploadFile({
      cloudPath: "code.png",
      fileContent: buffer,
    });

    await commonMapDb.add({
      data: {
        code: upload.fileID,
      },
    });

    codeSrc = upload.fileID;
  }

  return {
    errMsg: "",
    status: successStatus,
    data: {
      codeSrc,
    },
  };
};

module.exports = tryCatchWrap(shareApi);
