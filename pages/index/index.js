var apiMethods = require('../../utils/apiMethods.js');
Page({
  data:{
    autoplay: true,
    interval: 5000,
    circular: true,
    currentIndex: 0,
    banner: [],
    topMatchsList: [],
    tagList: [],
    pointList: [],
    newsList: [],
    activeTagIndex: 0,
    activeTagId: 0,
    page: 1,
    limit: 10,
    menuList: [
      { iconPath: '/statics/images/home/home_guanfang@3x.png', name: '官方发布' },
      { iconPath: '/statics/images/home/home_jishisaishi@3x.png', name: '即时赛事' },
      { iconPath: '/statics/images/home/home_mingrengtang@3x.png', name: '名人堂' },
      { iconPath: '/statics/images/home/home_tupian@3x.png', name: '图库' }
    ],
    battleFlag:[
      '/statics/images/home/home_weikaishi@3x.png',
      '/statics/images/home/home_yikaishi@3x.png',
      '/statics/images/home/home_yijieshu@3x.png'
    ]
  },
  onLoad () {
    this.getIndex();
    this.getPoint();
  },
  getIndex () {
    apiMethods.newRequest('index', 'GET', {}, (d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          banner: rs.bannerList,
          topMatchsList: rs.topMatchsList,
          tagList: rs.tagNmList,
          activeTagId: rs.tagNmList[0].tagId,
        });

        this.getTagList();
      }
    }, (err) => {
      console.log(err);
    });
  },
  getPoint () {
    //获取观点
    let paramter = {};
    paramter.opid = 1;
    paramter.page = 1;
    paramter.limit = 4;
    apiMethods.newRequest('eventViewHall', 'GET', paramter, (d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          pointList: rs.matches
        });
      }
    }, (err) => {
      console.log(err);
    });
  },
  //上拉加载
  onReachBottom () {
    let page = this.data.page;
    this.setData({
      page: page + 1
    });
    wx.showLoading({
      title:'',
      mask:true
    });
    setTimeout(()=>{
      this.getTagList();
      wx.hideLoading();
    },1000);
  },
  swiperChange (e) {
    this.setData({
      currentIndex: e.detail.current
    });
  },
  // tag点击
  changeTag (e) {
    // console.log(e)
    let dataset = e.target.dataset;
    this.setData({
      newsList: [],
      activeTagIndex: dataset.index,
      activeTagId: dataset.id
    });
    this.getTagList();
  },
  // 获取news列表
  getTagList: function () {
    let paramter = {},
        datas = this.data;
    paramter.opid = datas.activeTagId;
    paramter.page = datas.page;
    paramter.limit = datas.limit;
    apiMethods.newRequest('officialTaglist', 'GET', paramter, (d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          newsList: datas.newsList.concat(rs.newsList)
        });
      }
    }, (err) => {
      console.log(err);
    });
  },
});