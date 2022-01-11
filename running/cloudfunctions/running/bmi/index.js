const lget = require("lodash").get,
  tryCatchWrap = require("@/utils/tryCatchWrap"),
  { successStatus } = require("@/constants");

const toDecimal = (x) => (isNaN(parseFloat(x)) ? 0 : Math.round(x * 100) / 100);

const getBmiData = async (cloud, event) => {
  const bmi = event.weight / (event.height / 100) ** 2;

  let sickWarning = "",
    fatWarning = "",
    idealWeight = null,
    normalWeight = null;

  switch (true) {
    case bmi < 18.5: {
      fatWarning = "体重过低";
      sickWarning = "低（但其它疾病危险性增加）";
      break;
    }
    case bmi >= 18.5 && bmi < 23.9: {
      fatWarning = "正常范围";
      sickWarning = "平均水平";
      break;
    }
    case bmi >= 23.9 && bmi < 26.9: {
      fatWarning = "超重";
      sickWarning = "增加";
      break;
    }
    case bmi >= 26.9 && bmi < 29.9: {
      fatWarning = "I度肥胖";
      sickWarning = "中度增加";
      break;
    }
    case bmi >= 30 && bmi < 40: {
      fatWarning = "II度肥胖";
      sickWarning = "严重增加";
      break;
    }
    case bmi >= 40: {
      fatWarning = "Ⅲ度肥胖	";
      sickWarning = "非常严重增加";
      break;
    }
  }

  // 男性：(身高cm－80)×70﹪=标准体重
  // 女性：(身高cm－70)×60﹪=标准体重
  // 标准体重正负10﹪为正常体重
  switch (event.gender) {
    // 男
    case 1: {
      idealWeight = (event.height - 80) * 0.7;
    }
    // 女
    case 2: {
      idealWeight = (event.height - 70) * 0.6;
    }
    default: {
      idealWeight = event.height - 112;
    }
  }

  if (idealWeight) {
    normalWeight = `${toDecimal(idealWeight * 0.9)}~${toDecimal(
      idealWeight * 1.1
    )}`;
  }
  // 胸围：身高x0.52
  // 腰围：身高x0.37
  // 腹围：身高x0.457
  // 臀围：身高x0.542
  // 大腿围：身高x0.26+7.8

  return {
    errMsg: "",
    status: successStatus,
    data: {
      bmi: toDecimal(bmi),
      fatWarning,
      sickWarning,
      idealWeight: toDecimal(idealWeight),
      normalWeight,
      xw: toDecimal(event.height * 0.52),
      yw: toDecimal(event.height * 0.37),
      fw: toDecimal(event.height * 0.457),
      tw: toDecimal(event.height * 0.542),
      dtw: toDecimal(event.height * 0.26 + 7.8),
    },
  };
};

module.exports = tryCatchWrap(getBmiData, "获取bmi失败");
