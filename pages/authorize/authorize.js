var config = require('../../config.js');
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    start_image_path: "../../image/chorus.png"
  },

  /**
   * 获取用户信息接口后的处理逻辑
   */
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      console.log("用户授权获取到，并赋值给了globalData的用户信息：");
      console.log(app.globalData.userInfo);
      //调后台接口，将用户信息入库
      var that = this;
      wx.request({
          url: config.url+'/person/',
          data: {
            'username': app.globalData.userInfo.nickName,
            'avatarUrl': app.globalData.userInfo.avatarUrl
          },
          method: 'POST',
          success: function(user_res){
              app.globalData.user_id = user_res.data.userId
              app.globalData.avatar_url = user_res.data.avatarUrl
              console.log("用当前用户调用后台接口/person成功新建用户/查到用户后，设置的globalData：")
              console.log(app.globalData);
          }
      })

      wx.switchTab({
        url: '../../pages/manage/manage',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      console.log("已有globalData.userInfo，如下：");
      console.log(app.globalData.userInfo);
      //调后台接口，将用户信息入库
      wx.request({
        url: config.url + '/person/',
        data: {
          'username': app.globalData.userInfo.nickName,
          'avatarUrl': app.globalData.userInfo.avatarUrl
        },
        method: 'POST',
        success: function (user_res) {
          app.globalData.user_id = user_res.data.userId
          app.globalData.avatar_url = user_res.data.avatarUrl
          console.log("用当前用户调用后台接口/person成功新建用户/查到用户后，设置的globalData：")
          console.log(app.globalData);
        }
      })
      wx.switchTab({
        url: '../../pages/manage/manage',
      })
    }
    // 在没有 open-type=getUserInfo 版本的兼容处理
    if (!this.data.canIUse) {
      console.log("不可用button.open - type.getUserInfo");
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})