// pages/forum/subject/index.js
var apiMethods = require('../../../utils/apiMethods.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    limit:10,
    channelId:'',
    opid:1,
    channelForumList:[],
    channelInfo:{},
    topForumList:[],
    tags: [{
      name: '全部',
      id:1
    }, {
      name: '最近热帖',
      id: 2
    }, {
      name: '历史置顶',
      id: 3
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      channelId:options.id
    });
    this.getSubject();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    setTimeout(() => {
      this.getSubject();
      wx.hideLoading();
    }, 1000);
  },
  getSubject () {
    let parameter = {},
        datas = this.data;
    parameter.channelId = datas.channelId;
    parameter.page = datas.page + 1;
    parameter.limit = datas.limit;
    parameter.opid = datas.opid;
    apiMethods.newRequest('channelForumList',parameter).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if(d.data.code === '0'){
        this.setData({
          ['channelForumList['+ datas.page +']']: rs.channelForumList,
          channelInfo: rs.channelInfo,
          topForumList: rs.topForumList,
          page:parameter.page
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  changeTag (e) {
    let opid = e.target.dataset.id;
    this.setData({
      opid:opid,
      page:0,
      channelForumList:[]
    });
    this.getSubject();
  }
})