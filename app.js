//app.js

var config = require('./config.js');
App({
    onLaunch: function () {

        //updated on 1208
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              console.log("已经授权");
              console.log(this.globalData);
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId          
                  this.globalData.userInfo = res.userInfo
                  var that = this;
                  wx.request({
                      url: config.url+'/person/',
                      data: {
                          'username':res.userInfo.nickName,
                          'avatarUrl': res.userInfo.avatarUrl
                      },
                      method: 'POST',
                      success: function(user_res){
                          that.globalData.user_id = user_res.data.userId
                          that.globalData.avatar_url = user_res.data.avatarUrl
                          that.globalData.user_realname = user_res.data.realname
                          that.globalData.user_mobile = user_res.data.mobile
                          console.log("用当前用户调用后台接口/person成功新建用户/查到用户后，设置的globalData：")
                          console.log(that.globalData);
                      }
                  })
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            } else {              
              // 没有授权，重定向到authorize启动页
              console.log("没有授权");
              wx.navigateTo({
                url: '/pages/authorize/authorize'
              })
            }
          }
        })

    },
    onShow: function () {

    },
    onHide: function () {
      this.globalData.scence = 1;
      console.log("app.onHide");
    },

    globalData: {
        userInfo: null,
        users:null,
        user_id:null,
        avatar_url:null,
        user_realname:null,
        user_mobile:null
    },
    data: {
        haveLocation: false,
        activity_lat: -1,
        activity_lng: -1,
        activity_location: "" //中文地址
    }
})