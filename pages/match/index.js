// pages/match/index.js
var apiMethods = require('../../utils/apiMethods.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tagList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTag();
  },
  getTag () {
    let paramter = {};
    paramter.platform = 'web_offical';
    paramter.locationId = 3;
    apiMethods.newRequest('listPlatformTag', 'GET', paramter, (d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          tagList: rs
        });
      }
    }, (err) => {
      console.log(err);
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})