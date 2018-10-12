// pages/user/about/index.js
const apiMethods = require('../../../utils/apiMethods.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAboutUs();
  },
  getAboutUs () {
    apiMethods.newRequest('aboutus', {}).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          content:rs.content
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }
})