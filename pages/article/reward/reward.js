// pages/article/reward/reward.js
let apiMethods = require('../../../utils/apiMethods.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerPic: '',
    authorId: '',
    authorName: '',
    newsId: '',
    rewardCount:0,
    rewardList:[],
    intergralIndex:-1,
    score:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      headerPic: options.headerPic,
      authorId: options.authorId,
      authorName: decodeURI(options.authorName),
      newsId: options.newsId,
    });
    this.getRewardIntergral();
  },
  getRewardIntergral () {
    let parameter = {};
    parameter.newsId = this.data.newsId;
    apiMethods.newRequest('rewardInfo', parameter).then((d) => {
      // console.log(d.data)
      let rs = d.data.data;
      if(d.data.code === '0'){
        this.setData({
          rewardCount: rs.rewardCount,
          rewardList: rs.rewardList
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  // 积分点击
  selectIntergral (e) {
    let dataset = e.target.dataset;
    this.setData({
      intergralIndex: dataset.index,
      score: dataset.score
    });
    wx.showActionSheet({
      itemList: ['确认打赏？'],
      itemColor:'#C13331',
      success:(res) => {
        // console.log(res);
        this.doReward();
      }
    });
  },
  // 打赏
  doReward () {
    let parameter = {},
        datas = this.data;
    parameter.newsId = datas.newsId;
    parameter.ownerId = datas.authorId;
    parameter.score = datas.score;
    parameter.userId = wx.getStorageSync('userId');
    parameter.token = wx.getStorageSync('token');
    apiMethods.newRequest('rewardUser', parameter).then((d) => {
      // console.log(d.data)
      wx.showToast({
        title: d.data.msg,
        icon:'none'
      });
    }).catch((err) => {
      console.log(err);
    });
  }
});