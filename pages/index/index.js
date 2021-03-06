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
    page: 0,
    limit: 10,
    fiexdTagFlag:true,
    tagOffsetTop:0,
    menuList: [
      { iconPath: '/statics/images/home/home_guanfang@3x.png', name: '官方发布' },
      { iconPath: '/statics/images/home/home_jishisaishi@3x.png', name: '即时赛事' },
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
  getTagOffset() {
    let query = wx.createSelectorQuery();
    query.select('.JStagScroll').boundingClientRect();
    query.exec((res) => {
      this.setData({
        tagOffsetTop: res[0].top
      });
    });
  },
  getIndex () {
    apiMethods.newRequest('index', {}).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          banner: rs.bannerList,
          topMatchsList: rs.topMatchsList,
          tagList: rs.tagNmList,
          activeTagId: rs.tagNmList[0].tagId,
        });

        this.getTagOffset();
        this.getTagList();
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  //获取观点
  getPoint () {
    let paramter = {};
    paramter.opid = 1;
    paramter.page = 1;
    paramter.limit = 4;
    apiMethods.newRequest('eventViewHall', paramter).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          pointList: rs.matches
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  //上拉加载
  onReachBottom () {
    wx.showLoading({
      title:'正在加载',
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
      page:0,
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
    paramter.page = datas.page + 1;
    paramter.limit = datas.limit;
    apiMethods.newRequest('officialTaglist', paramter).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          ['newsList[' + datas.page + ']']: rs.newsList
        });
        this.setData({
          page: paramter.page
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  // 页面滚动
  onPageScroll (e) {
    let scrollTop = e.scrollTop,
        tagOffsetTop = this.data.tagOffsetTop,
        fiexdTagFlag;
    if (scrollTop > tagOffsetTop){
      fiexdTagFlag = false;
    }else{
      fiexdTagFlag = true;
    }
    this.setData({
      fiexdTagFlag: fiexdTagFlag
    });
  },
  //四类点击
  menuTap(e) {
    let clickIndex = e.currentTarget.dataset.index;
    switch (clickIndex){
      case 0:
        wx.pageScrollTo({
          scrollTop: this.data.tagOffsetTop
        });
        // 官方发布
        break;
      case 1:
        // 即时赛事
        wx.switchTab({
          url: '../match/index',
        });
        break;
      case 2:
        // 图库
        wx.navigateTo({
          url: '../photo/index',
        });
        break;
    }
  }
});