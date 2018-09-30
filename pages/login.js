// pages/login.js
const apiMethods = require('../utils/apiMethods.js');
const md5 = require('../utils/md5/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    pwd:''
  }, 
  getAcount(e){
    let val = e.detail.value;
    if(val){
      this.setData({
        account:val
      });
    }
  },
  getPwd(e) {
    let val = e.detail.value;
    if (val) {
      this.setData({
        pwd: val
      });
    }
  },
  toLogin(){
    let datas = this.data,
        paramter = {},
        account = datas.account,
        pwd = datas.pwd;
    paramter.telephone = account;
    paramter.password = md5(pwd);
    apiMethods.newRequest('login', paramter).then((d) => {
      console.log(d.data);
      let rs = d.data.data;
      if (d.data.code === '0') {
        wx.setStorageSync('userId', rs.userId);
        wx.navigateBack({
          delta:1
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }
});