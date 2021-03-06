// pages/match/schedule/index.js
var apiMethods = require('../../../utils/apiMethods.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matches:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSchedule();
  },
  getSchedule () {
    let parameter = {};
    parameter.version = '2_0';
    apiMethods.newRequest('findWorldCup', parameter).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          matches: rs.matches
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }
})