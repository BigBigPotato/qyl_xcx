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
    commentsFlag:0,
    hotCommentList: [],
    headerPic: '',
    authorName: '',
    authorId: '',
    collectIcon: ['luntan_wujiaoxing@3x.png','luntan_wujiaoxing_lan@3x.png'],
    collects:0,//收藏数
    isCollect:0,//是否收藏
    shapeFlag:true,
    commentVal:'',
    focusFlag:false,
    commentType:0,
    commentId:'', 
    parentId:''
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
          ['commentsList[0]']: rs.commentsList,
          hotCommentList: rs.hotCommentList,
          headerPic: rs.forumDetail.headerPic ? rs.forumDetail.headerPic : "/statics/images/defaultAvatar.png",
          authorName: rs.forumDetail.username ? rs.forumDetail.username : '过客',
          authorId: rs.forumDetail.userId,
          collects: rs.forumDetail.collects,
          isCollect: rs.forumDetail.isCollect
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  // 收藏
  toCollect () {
    let userId = wx.getStorageSync('userId'),
        token = wx.getStorageSync('token'),
        datas = this.data,
        paramter = {
          newsId: datas.newsId
        };
    if (userId) {
      paramter.userId = wx.getStorageSync('userId');
      paramter.token = wx.getStorageSync('token');
      paramter.opid = datas.isCollect === 0 ? 1 : 0;
      apiMethods.newRequest('collectAndCancelForum',paramter).then((d) => {
        // console.log(d.data);
        let rs = d.data.data;
        if(d.data.code === '0'){
          this.setData({
            collects: paramter.opid === 1 ? ++datas.collects : --datas.collects,
            isCollect: rs.isCollect
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      wx.navigateTo({
        url: '../login',
      });
    }
  },
  changeComment (e) {
    // console.log(e)
    let flag = e.target.dataset.flag;
    if(flag === '0'){
      //全部跟帖
      this.setData({
        commentsFlag:0
      });
    }else{
      this.getAuthor();
    }
  },
  // 只看楼主
  getAuthor () {
    let parameter = {},
      datas = this.data;
    parameter.ownerId = datas.authorId;
    parameter.newsId = datas.newsId;
    apiMethods.newRequest('forumOwnerComment', parameter).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          ['commentsList[1]']: rs,
          commentsFlag: 1
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
      });
    }else{
      wx.navigateTo({
        url: '../login',
      });
    }
  },
  // 评论框获取焦点
  inputFocus (e) {
    let keyboardH = e.detail.height;
    this.setData({
      shapeFlag: false
    });
  },
  // 评论框失去焦点
  getCommentVal (e) {
    // console.log(e)
    let val = e.detail.value;
    if(val){
      this.setData({
        commentVal:val
      });
    }
  },
  hideShape () {
    this.setData({
      shapeFlag: true
    });
  },
  //评论
  sendComment () {
    let datas = this.data,
        parameter = {},
        val = datas.commentVal,
        commentType = datas.commentType,
        userId = wx.getStorageSync('userId'),
        token = wx.getStorageSync('token'),
        url = 'postForumCom';
    if(!userId) {
      wx.navigateTo({
        url: '../login',
      });
      return;
    }
    if(!val){
      wx.showToast({
        title: '请先输入评论内容',
        icon:'none'
      });
      return;
    }
    if (commentType === 1){
      url = 'postForumUserCom';
      parameter.commentId = datas.commentId;
      parameter.parentId = datas.parentId;
    }
    parameter.userId = wx.getStorageSync('userId');
    parameter.token = wx.getStorageSync('token');
    parameter.newsId = datas.newsId;
    parameter.content = val;
    apiMethods.newRequest(url,parameter).then((d) => {
      //console.log(d.data);
      if(d.data.code === '0'){
        this.setData({
          shapeFlag: true,
          commentVal: '',
          commentId: '',
          parentId: '',
          focusFlag: false,
          commentType: 0
        });
        let commentsFlag = this.data.commentsFlag;
        if (commentsFlag === 0) {
          this.getArticle();
        }else{
          this.getAuthor();
        }
      }else{
        wx.showToast({
          title: d.data.msg,
          icon:'none'
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  // 点赞
  toThumbUp (e) {
    // console.log(e)
    let userId = wx.getStorageSync('userId'),
        token = wx.getStorageSync('token'),
        details = e.detail,
        paramter = {
          commentId: details.commentId
        };
    if (userId) {
      paramter.userId = wx.getStorageSync('userId');
      paramter.token = wx.getStorageSync('token');
      paramter.opid = details.thumbFlag === 0 ? 1 : 0;
      apiMethods.newRequest('hitComment', paramter).then((d) => {
        // console.log(d.data);
        let rs = d.data.data;
        if (d.data.code === '0') {
          let commentsFlag = this.data.commentsFlag;
          if (commentsFlag === 0) {
            this.getArticle();
          } else {
            this.getAuthor();
          }
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      wx.navigateTo({
        url: '../login',
      });
    }
  },
  // 回复别人的评论
  toReply (e) {
    let detail = e.detail;
    this.setData({
      commentId: detail.commentId,
      parentId: detail.parentId,
      focusFlag:true,
      commentType:1
    });
  }
});