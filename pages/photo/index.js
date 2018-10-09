// pages/photo/index.js
const apiMethods = require('../../utils/apiMethods.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags:[],
    colorArr: ['purple', 'blue', 'yellow', 'green', 'red'],
    page:0,
    limit:10,
    tagId:'',
    keyword:'',
    photoList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTags();
    this.getPhotos();
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
      this.getPhotos();
      wx.hideLoading();
    }, 1000);
  },
  getTags () {
    apiMethods.newRequest('tags',{}).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if(d.data.code === '0'){
        this.setData({
          tags:rs
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  getPhotos () {
    let parameter = {},
        datas = this.data;
    parameter.page = datas.page + 1;
    parameter.limit = datas.limit;
    datas.tagId ? (parameter.tag = datas.tagId) : '';
    datas.keyword ? (parameter.keyword = datas.keyword) : '';

    apiMethods.newRequest('imgs', parameter).then((d) => {
      // console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        this.setData({
          page:parameter.page,
          ['photoList[' + datas.page + ']']: rs.imgs
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  searchByTag (e) {
    let clickTagId = e.target.dataset.id,
        tagId = this.data.tagId;
    if (clickTagId === tagId) {
      this.setData({
        tagId: '',
        page: 0,
        photoList: []
      });
    } else {
      this.setData({
        tagId: clickTagId,
        page: 0,
        photoList: []
      });
    }
    this.getPhotos();
  },
  searchByKey() {
    this.setData({
      page: 0,
      photoList: []
    });
    this.getPhotos();
  },
  searchInput (e) {
    let val = e.detail.value.trim();
    this.setData({
      keyword:val
    });
  },
  downloadPhoto (e) {
    let downloadUrl = e.target.dataset.src;
    wx.downloadFile({
      url: downloadUrl,
      success (res) {
        let path = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success () {
            wx.showToast({
              title: 'ok',
            })
          }
        })
      },
      fail (err) {
        console.log(err);
      }
    })
  }
});