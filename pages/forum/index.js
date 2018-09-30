// pages/forum/index.js
var apiMethods = require('../../utils/apiMethods.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit:10,
    page:0,
    channelList:[],
    newsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getForum();
  },
  getForum () {
    let paramter = {},
        datas = this.data;
    paramter.limit = datas.limit;
    paramter.page = datas.page + 1;
    apiMethods.newRequest('squareList',paramter).then((d) => {
      let rs = d.data.data;
      if(d.data.code === '0'){
        this.setData({
          channelList: rs.channelList,
          ['newsList[' + datas.page +']']: rs.newsList,
          page: paramter.page
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})