const dayjs = require("dayjs");
const superagent = require("superagent"),
  lget = require("lodash").get,
  cheerio = require('cheerio'),
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  {
    commonMapDbName,
    successStatus
  } = require("@/constants");

const getSoulSoupFromApi = async (cloud) => {
  const commonMapDb = cloud.database().collection(commonMapDbName),
    log = cloud.logger(),
    commonMapResult = await commonMapDb.get(),
    docId = lget(commonMapResult, 'data.0._id');

  let resultData = null,
    errMsg = "";
  try {
    const res = await superagent.get(
      "http://wufazhuce.com/"
    );
    const $ = cheerio.load(res.text),
      itemHtml = $('#carousel-one .item:first-child').html(),
      item$ = cheerio.load(itemHtml),
      image = item$('.fp-one-imagen').attr('src'),
      content = item$('.fp-one-cita a').text(),
      date = dayjs().endOf('day').add(6, 'hour').valueOf();

    if (!content) {
      throw "";
    }

    resultData = {
      content,
      image,
      date
    }
  } catch (error) {
    log.error({
      name: `one爬取失败`,
      error,
    });
    errMsg = error.message || "one爬取失败";
  }

  if (resultData) {
    if (docId) {
      await commonMapDb.doc(docId).update({
        data: resultData
      });
      return {
        errMsg,
        status: successStatus,
        data: {
          _id: docId,
          ...resultData,
        },
      };
    } else {
      const addResult = await commonMapDb.add({
        data: resultData
      });
      return {
        errMsg,
        status: successStatus,
        data: {
          _id: addResult._id,
          ...resultData,
        },
      };
    }
  }

  return {
    errMsg,
    status: successStatus,
    data: lget(commonMapResult, 'data.0'),
  };
};

module.exports = tryCatchWrap(getSoulSoupFromApi, "爬取one失败");