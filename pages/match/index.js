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
    page: 0,
    activeTagId: 0,
    activeTagIndex:1,
    collectImg: ['saishi_huilingdang@3x.png', 'saishi_honglingdang@3x.png'],
    pullUpFlag:true,
    userId: wx.getStorageSync('userId'),
    posters:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTag();
  },
  getTag () {
    let parameter = {};
    parameter.platform = 'web_offical';
    parameter.locationId = 3;
    apiMethods.newRequest('listPlatformTag', parameter).then((d) => {
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
    let parameter = {},
        datas = this.data,
        userId = datas.userId;
    if (datas.activeTagId >= 0 && datas.activeTagId <= 2) {
      parameter.page = datas.page + 1;
      parameter.limit = datas.limit;
    }
    parameter.opid = datas.activeTagId;
    userId ? (parameter.userId = userId) : '';
    if (!userId && datas.activeTagId === 3){
      wx.navigateTo({
        url: '../login'
      });
      return;
    }
    apiMethods.newRequest('instant2', parameter).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        if(datas.activeTagId >= 0 && datas.activeTagId <= 2){
          if (rs.matches.length){
            this.setData({
              ['matchesList[' + datas.page + ']']: rs.matches,
              page:parameter.page,
              posters: rs.posters ? rs.posters : []
            });
          }else{
            this.setData({
              pullUpFlag: false,
              posters: rs.posters ? rs.posters : []
            });
          }
        }else{
          let matchesArr = [];
          for(let list of rs.matches){
            matchesArr = matchesArr.concat(list.match)
          }
          this.setData({
            ['matchesList[' + datas.page + ']']: matchesArr
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
      page:0,
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
  collectMatch (e) {
    let parameter = {},
        datas = this.data,
        dataset = e.target.dataset;
    parameter.matchId = dataset.id;
    parameter.optType = dataset.flag === 0 ? 1 : 0;
    parameter.userId = wx.getStorageSync('userId');
    apiMethods.newRequest('CollectMatche',parameter).then((d) => {
      // console.log(d.data);
      if(d.data.code === '0'){
        let page = this.data.page;
        this.setData({
          page:page - 1,
        });
        this.getMatches();
      }
    }).catch((err) => {
      console.log(err);
    });
  }
})