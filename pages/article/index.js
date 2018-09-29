// pages/article/index.js
var apiMethods = require('../../utils/apiMethods.js'),
    app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: wx.getStorageSync('userId'),
    newsId:'',
    forumDetail: {},
    commentsList:[],
    hotCommentList: [],
    headerPic: '',
    authorName: '',
    authorId: ''
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
  // 文章信息
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
          hotCommentList: rs.hotCommentList,
          headerPic: rs.forumDetail.headerPic ? rs.forumDetail.headerPic : "/statics/images/defaultAvatar.png",
          authorName: rs.forumDetail.username ? rs.forumDetail.username : '过客',
          authorId: rs.forumDetail.userId
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  // 打赏
  toReward () {
    let userId = wx.getStorageSync('userId'),
        datas = this.data,
        params = {
          headerPic: datas.headerPic,
          authorName: datas.authorName,
          authorId: datas.authorId,
          newsId: datas.newsId
        };
    params = app.splitParams(params);
    if(userId){
      wx.navigateTo({
        url: `./reward/reward?${params}`
      })
    }else{
      wx.navigateTo({
        url: '../login',
      })
    }
  }
})