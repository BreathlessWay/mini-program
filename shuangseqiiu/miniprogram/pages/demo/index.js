// pages/demo/index.js
const dateFormat = function (date, fmt) {
	const o = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'H+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		S: date.getMilliseconds(), // 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(
			RegExp.$1,
			(date.getFullYear() + '').substr(4 - RegExp.$1.length)
		);
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(fmt))
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
			);
	}
	return fmt;
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    file: null,
    content: "",
    list: []
  },

  onClick() {
    wx.login({
      success:()=> {
        wx.getWeRunData({
          success:(res)=> {
            console.log(res);
            wx.cloud
              .callFunction({
                name: "run",
                data: {
                  cloudID: res.cloudID,
                },
              })
              .then((data) => {
                data.result.forEach(item=>{
                  item.timestamp = dateFormat(new Date(item.timestamp*1000), 'yyyy-MM-dd HH:mm:ss')
                })
                console.log(data.result)
                this.setData({
                  list: data.result
                })
              });
          },
        });
      },
    });
  },
  async onUpload() {
    const data = await wx.chooseImage({
      count: 1,
    });
    const file = data.tempFilePaths[0],
      ext = file.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);

    const res = await wx.cloud.uploadFile({
      cloudPath: Math.floor(Math.random() * 10000000) + ext[0],
      filePath: file, // 文件路径
    });

    this.setData({
      file: res.fileID,
    });
  },
  bindKeyInput(e) {
    this.setData({
      content: e.detail.value,
    });
  },
  async onValid() {
    const res = await wx.cloud.callFunction({
      name: "sec",
      data: {
        msg: this.data.content,
      },
    });

    console.log(res);
  },
});
