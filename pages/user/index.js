// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = wx.getStorageSync('userId');
    if(!userId){
      wx.navigateTo({
        url: '../login',
      });
    }
  },
  loginOut () {
    wx.clearStorageSync();
    wx.switchTab({
      url: '../index/index',
    });
  }
})