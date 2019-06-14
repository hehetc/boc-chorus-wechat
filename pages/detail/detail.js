// pages/detail/detail.js
var config = require('../../config.js');
var app = getApp();

var distance = require('../../utils/getdistance.js');
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
//腾讯地图Key
var demo = new QQMapWX({
  key: 'CAYBZ-FPZKV-I6WPA-UMYBP-BBGTE-TBFHU'
});


var haveApplyed = true;
var haveChecked = false;
var lat = null;
var lng = null;
var face = null;
var location = null;
var activity_id=null;
var activity_title = null;
var location_check_res = false;

Page({
  /**
   * 页面的初始数据
   */
  data: {
      detail_info: {},//设置为：请求check/details返回的（获取活动的签到信息）
      activity_info:{},//活动本身的信息
      check_info:{},//点签到具体日期显示的，随时在变，根据点的哪个日期动态赋值
      detail_show:true,
      show_date:true,
      check_info_hidden:true,
      location_check_hidden: false,
      apply_msg:"点击签到",
      location_res: "等待验证",
      location_check_passed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var activityId = options.activity_id;
      activity_id = activityId;
      var that = this;
      console.log("活动详情页面已加载，传入了活动id,用活动id请求/check/details信息：");
      wx.request({
          url: config.url +'/check/details',
          data: {
              'id':activityId
          },
          method:'POST',
          success:function(res) {
              console.log("【detail.js】请求check/details（获取活动的签到信息）返回前端的：")
              console.log(res.data);
              that.setData({
                  detail_info:res.data
              });
          }
      });
      wx.request({
          url: config.url + '/activity/actInfo',
          data:{
              'id':activityId
          },
          method:'POST',
          success: function(res) {
            console.log("【detail.js】请求/activity/actInfo（获取活动本身的信息）返回前端的：");
              console.log(res.data);
              that.setData({
                  activity_info:res.data
              })
              lng = res.data.infos[0].F_Lng;
              lat = res.data.infos[0].F_Lat;
              face = res.data.infos[0].F_IfFace;
              location = res.data.infos[0].F_IfLocation;
              activity_title = res.data.infos[0].F_Caption;
          }
      })
      //判断是否已经报过名
      wx.request({
          url: config.url + '/activity/haveChecked',
          data:{
              'userId': app.globalData.user_id,
              'activityId':activityId
          },
          method:'POST',
          success: function(res){
            console.log("【detail.js】请求/activity/haveChecked（用活动id和用户id查当前用户是否已签到该活动）返回前端的：");
              console.log(res.data)
              if(res.data.code){
                  haveChecked = true;
                  that.setData({
                      apply_msg:'您已签到',
                      location_check_hidden:true
                  })
              }
              else {
                haveChecked = false;
                that.setData({
                  apply_msg: '点击签到'
                })
              }
          }
      })
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
  
  },
  getActivity_detail: function(){
      //点活动详情展开的事件
      var that = this;
      var temp = that.data.detail_show;
      that.setData({
          detail_show:!temp
      })
  },

  /**
   * 点签到记录
   * 2018-11-30修改
   */
  getDetailedCheck:function(e){
      var that = this;
      console.log("点击了签到记录");
      var temp = that.data.check_info_hidden;
      that.setData({
          check_info_hidden :!temp
      })
  },

  submitCheck:function(){
      if (location_check_res) {
        wx.request({
          url: config.url + '/check',
          method: 'POST',
          data: {
            'userId': app.globalData.user_id,
            'activityId': activity_id,
          },
          success: function (check_res) {
            if (check_res.data.code == 1) {
              wx.showToast({
                title: '签到成功！',
                duration: 1000,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.navigateBack({
                    });
                  }, 2000) //延迟时间
                  location_check_res = false;
                }
              })
            }
          }

        })
      } else {
        wx.showToast({
          title: '请完成所有验证',
          duration: 1000
        })
      }
  
      wx.switchTab({
          url: '../manage/manage'
      })


    },

      /**
     * 点击地点验证，进行地点签到
     */
    locationCheck: function () {
      var that = this;
      wx.getLocation({
        success: function (res) {
          var p1 = {
            lat: res.latitude,
            lng: res.longitude
          };
          var p2 = {
            lat: lat,
            lng: lng
          };
          console.log("当前地点和活动地点分别是：");
          console.log(p1, p2);
          demo.calculateDistance({
          to: [{
            latitude: p1.lat,
            longitude: p1.lng
          }],
          from: {
            latitude: p2.lat,
            longitude: p2.lng
          },
          success: function (res) {
            console.log("calculateDistance返回结果：");
            console.log(res);
            var dis = res.result.elements[0].distance;
            if (dis <= 1000) {
              location_check_res = true;
              that.setData({
                location_res: "验证成功",
                location_check_passed : true
              })
            } else {
              location_check_res = false;
              that.setData({
                location_res: "验证失败!"
              })
            }
          },
          fail: function (res) {
            console.log("验证失败，结果：");
            console.log(res);
          },
        })
      },
    })
  }


})