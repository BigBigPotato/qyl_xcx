// pages/article/index.js
var apiMethods = require('../../utils/apiMethods.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: wx.getStorageSync('userId'),
    newsId:'',
    forumDetail: {},
    commentsList:[],
    hotCommentList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      newsId: options.id
    });
    this.getArticle();
  },
  getArticle () {
    let paramter = {},
        datas = this.data;
    paramter.newsId = datas.newsId;
    datas.userId ? (paramter.userId = datas.userId) : '';
    apiMethods.newRequest('forumDetail', paramter).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          forumDetail: rs.forumDetail,
          commentsList: rs.commentsList,
          hotCommentList: rs.hotCommentList
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  dealHtml (str) {

  }
})