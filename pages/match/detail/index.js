// pages/match/detail/index.js
var apiMethods = require('../../../utils/apiMethods.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchId:'',
    basicPanel:{},
    matchStatus:-1,
    activeTag:'0',
    tagItem:['basic','intelligence','formation'],
    intelligence:{},
    sendMsg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      matchId:options.id
    });
    this.getBasicPanel();
  },
  changeTag (e) {
    let tag = e.target.dataset.tag;
    switch (tag){
      case '0':
        this.setData({
          sendMsg:this.data.basicPanel
        });
        break;
      case '1':
        this.getIntelligence();
        break;
      case '2':
        this.getFormation();
        break;
    }
    this.setData({
      activeTag:tag
    });
  },
  getBasicPanel () {
    let parameter = {};
    parameter.matchId = this.data.matchId;
    apiMethods.newRequest('basicPanel', parameter,true).then((d) => {
      // console.log(d.data);
      if(d.data.code === '0'){
        let rs = d.data.data,
            matchStatus = rs.matchStatus,
            status = '';
        switch (matchStatus) {
          case 1:
          case 9:
          case 13:
            //未开始
            status = '未开始';
            break;
          case 8:
            status = '完场';
            break;
          case 2:
            status = '上半场';
            break;
          case 3:
            status = '中场';
            break;
          case 4:
            status = '下半场';
            break;
          case 5:
            status = '加时赛上半场';
            break;
          case 6:
            status = '加时赛下半场';
            break;
          case 7:
            status = '点球决战';
            break;
        }
        this.setData({
          basicPanel: rs,
          sendMsg: rs,
          matchStatus: matchStatus,
          status: status,
        });
        wx.setNavigationBarTitle({
          title: rs.eventNm,
        });
      }else{
        wx.showToast({
          title: '暂无详细信息',
          icon:'none'
        });
        setTimeout(() => {
          wx.hideToast();
          wx.navigateBack({
            delta: 1
          });
        },1500);
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  getIntelligence () {
    let parameter = {};
    parameter.matchId = this.data.matchId;
    apiMethods.newRequest('intelligence', parameter).then((d) => {
      // console.log(d.data);
      if(d.data.code === '0'){
        this.setData({
          intelligence: d.data.data,
          sendMsg: d.data.data
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  getFormation() {
    let parameter = {};
    parameter.matchId = this.data.matchId;
    apiMethods.newRequest('getSquad', parameter).then((d) => {
      // console.log(d.data);
      if (d.data.code === '0') {
        this.setData({
          formation: d.data.data,
          sendMsg: d.data.data
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }
})