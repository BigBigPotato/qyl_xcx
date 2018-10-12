// pages/user/suggestion/index.js
const apiMethods = require('../../../utils/apiMethods.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question:'',
    contact:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  questionInput (e) {
    let val = e.detail.value;
    this.setData({
      question:val
    });
  },
  contactInput(e) {
    let val = e.detail.value;
    this.setData({
      contact: val
    });
  },
  upQuestion (e) {
    // console.log(e)
    let clickId = e.target.id,
        parameter = {},
        user = wx.getStorageSync('user'),
        datas = this.data;
    parameter.userId = user.userId;
    parameter.token = user.token;
    parameter.contact = datas.contact;
    parameter.suggest = datas.question;
    if(clickId){
      apiMethods.newRequest('saveSuggest', parameter).then((d) => {
        // console.log(d.data);
        let rs = d.data.data;
        if (d.data.code === '0') {
          this.setData({
            question: '',
            contact: ''
          });
        }
        wx.showToast({
          title: d.data.msg,
          icon: 'none'
        });
      }).catch((err) => {
        console.log(err);
      });
    }else{
      wx.showToast({
        title: '请将信息填写完整',
        icon:'none'
      });
    }
  }
})