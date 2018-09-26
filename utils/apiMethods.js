
// const env = 'development';//开发模式
const env = 'production';//发布模式
const md5 = require('./md5/md5.js');
const apiMap = require('./apiMap.js');

//md5
const signStrMd5 = (obj) => {
  let str = "";
  for (let name in obj) {//遍历对象属性名
    str += name + "=" + obj[name] + "&";
  }
  // 1b5c68449a9df94143f478121749c260 密钥
  str = str.substr(0, str.length - 1) + "1b5c68449a9df94143f478121749c260";
  return md5(str);
}

//排序
const objKeySort = (obj) => {//排序的函数
  const newkey = Object.keys(obj).sort();
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  let newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < newkey.length; i++) {//遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  }
  newObj.sign = signStrMd5(newObj);//加密
  return newObj;//返回排好序的新对象
}

//参数封装
const newParams = (datas) => {
  datas.time = Date.parse(new Date()) / 1000;
  datas = objKeySort(datas);
  return datas;
}

//接口封装
const splitUrl = (url) => {
  let path = '';
  if (env === 'development'){
    path = 'http://api.caipiaoq.com/';
  }else{
    path = 'https://api.qiuyoule.com/';
  }
  path = path + apiMap[url];
  return path;
}

//请求
const newRequest = (url, method, datas, successcb, errorcb,loadingFlag) => {
  if(loadingFlag){
    wx.showLoading({
      title: ''
    });
  }
  const params = newParams(datas);
  const path = splitUrl(url);
  wx.request({
    url: path,
    data: params,
    method: method,
    dataType: 'json',
    success: (d) => {
      if (loadingFlag) wx.hideLoading();
      successcb(d);
    },
    fail: (err) => {
      if (loadingFlag) wx.hideLoading();
      errorcb(err);
    }
  })
}

module.exports = {
  newRequest
}