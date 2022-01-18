//app.js
var Bmob = require('utils/bmob.js')
Bmob.initialize("2c29b1d7c3486988932e9f5ff0b327af", "2a2845bbab206f6fd274aa2263ac618c");

App({
  onLaunch: function () {
    var user = new Bmob.User() //开始注册用户
    user.auth().then(function (obj) {
      console.log('登陆成功')
    },
      function (err) {
        console.log('失败了', err)
      });
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == 'function' && cb(this.globalData.userInfo)
    } else {
      //调用登录接口 
      wx.login({
        success: function (res) {
          var user = new Bmob.User(); //实例化         
          user.loginWithWeapp(res.code).then(function (user) {
            if (user.get("nickName")) {
              //更新缓存中的openid
              wx.setStorageSync('openid', user.get("openid"))
            } else {
              //*************保存用户其他信息，比如昵称头像之类的*****************
              wx.getUserInfo({
                success: function (result) {
                  var nickName = result.userInfo.nickName;
                  var avatarUrl = result.userInfo.avatarUrl;
                  var u = Bmob.Object.extend("_User");
                  var query = new Bmob.Query(u);
                  // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                  query.get(user.id, {
                    success: function (result) {
                      // 自动绑定之前的账号
                      result.set('nickName', nickName);
                      result.set("userPic", avatarUrl);
                      result.set("openid", openid);
                      result.save();
                    }
                  });
                }
              });
              //*************保存用户其他信息，比如昵称头像之类的end*****************
            }
          }, function (err) {
            console.log(err, 'errr');
          });
        }
      });
    }

  },
    globalData: {
      userInfo: null
    }
  })