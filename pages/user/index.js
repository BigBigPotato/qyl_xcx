// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = wx.getStorageSync('user');
    if (!user){
      wx.navigateTo({
        url: '../login',
      });
    }
  },
  onShow () {
    let user = wx.getStorageSync('user');
    if (!user) {
      wx.navigateTo({
        url: '../login',
      });
    }else{
      this.setData({
        user:user
      });
    }
  },
  loginOut () {
    wx.clearStorageSync();
    wx.switchTab({
      url: '../index/index',
    });
  },
  handleTap (e) {
    // console.log(e)
    let clickId = e.target.id;
    switch(clickId){
      case 'suggestion':
        wx.navigateTo({
          url: './suggestion/index',
        });
        break;
      case 'about':
        wx.navigateTo({
          url: './about/index',
        });
        break;
    }
  }
})