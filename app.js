//app.js
App({
  onLaunch: function () {
    // 登录
    
  },
  // 传参object --> string
  splitParams(obj) {
    let arr = [];
    for(let i in obj){
      //console.log(i);
      obj[i] = encodeURI(obj[i]);
      arr.push(i+'='+obj[i])
    }
    return arr.join('&');
  }
})