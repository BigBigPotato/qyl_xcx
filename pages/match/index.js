// pages/match/index.js
var apiMethods = require('../../utils/apiMethods.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tagList: [],
    matchesList: [],
    limit: 10,
    page: 1,
    activeTagId: 0,
    activeTagIndex:1,
    collectImg: ['saishi_huilingdang@3x.png', 'saishi_honglingdang@3x.png'],
    pullUpFlag:true,
    userId: wx.getStorageSync('userId')
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
    apiMethods.newRequest('listPlatformTag', paramter).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          tagList: rs
        });
        this.getMatches();
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  getMatches () {
    let paramter = {},
        datas = this.data,
        userId = datas.userId;
    paramter.page = datas.page;
    paramter.limit = datas.limit;
    paramter.opid = datas.activeTagId;
    userId ? (paramter.userId = userId) : '';
    if (!userId && datas.activeTagId === 3){
      // wx.navigateTo({
      //   url: ''//todo
      // })
    }
    apiMethods.newRequest('instant2', paramter).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        if(datas.activeTagId >= 0 && datas.activeTagId <= 2){
          if (rs.matches.length){
            this.setData({
              matchesList: datas.matchesList.concat(rs.matches)
            });
          }else{
            this.setData({
              pullUpFlag: false
            });
          }
        }else{
          let matchesArr = [];
          for(let list of rs.matches){
            matchesArr = matchesArr.concat(list.match)
          }
          this.setData({
            matchesList: matchesArr
          });
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  changetag (e) {
    let dataset = e.target.dataset;
    if (dataset.id >= 0 && dataset.id <= 2){
      this.setData({
        pullUpFlag:true
      });
    }else{
      this.setData({
        pullUpFlag: false
      });
    }
    this.setData({
      matchesList: [],
      activeTagIndex: dataset.index,
      activeTagId: dataset.id
    });
    this.getMatches();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page,
        pullUpFlag = this.data.pullUpFlag;
    if(pullUpFlag){
      this.setData({
        page: page + 1
      });
      wx.showLoading({
        title: '正在加载',
        mask: true
      });
      setTimeout(() => {
        this.getMatches();
        wx.hideLoading();
      }, 1000);
    }
  },
})