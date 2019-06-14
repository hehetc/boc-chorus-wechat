
// pages/user/user.js
var uploadFn = require('../../utils/upload.js');
var config = require('../../config.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_name: "张三",
        user_city: "青岛",
        // 此时头像的照片是静态的
        avatar_path: "../../image/avator.jpg",
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        showModalStatus: false, 
        hasRealName: false,
        realname:'',
        mobile:'',
        button_text:'补充个人信息',
        drawer_title:'请补充个人信息'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        console.log("【user.js】获取到的globalData：");
        console.log(app.globalData);
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
                avatar_path: app.globalData.userInfo.avatarUrl
                // realname: app.globalData.user_realname,
                // mobile: app.globalData.user_mobile
            });
            if (app.globalData.user_realname) {
              this.setData({
                hasRealName: true,
                button_text: "修改个人信息",
                drawer_title: "修改个人信息",
                realname: app.globalData.user_realname,
                mobile: app.globalData.user_mobile
              });
            }
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true,
                    avatar_path: app.globalData.avatar_url
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true,
                        avatar_path: app.globalData.avatar_url
                    })
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

    },

    //补充个人信息调后台接口
    addUserInfo: function (e) {
      console.log("补充个人信息的e:")
      console.log(e);
      if (e.detail.value.rName == '' || e.detail.value.mobile == ''){
        wx.showModal({
          title: '提示',
          content: '姓名或手机号为空!',
          success(res) {
            
          }
        })
      }else{
        var that = this;
        console.log("【user.js】调用补充个人信息接口：/person/addUserInfo")
        wx.request({
          url: config.url + '/person/addUserInfo',
          data: {
            'realname': e.detail.value.rName,
            'mobile': e.detail.value.mobile,
            'user_id': app.globalData.user_id
          },
          method: 'POST',
          success: function (res) {
            console.log("【user.js】调用补充个人信息接口成功返回：");
            console.log(res.data);
            if (res.data.code == 1) {
              wx.showToast({
                title: '补充成功！',
                duration: 1000,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.navigateBack({
                    });
                  }, 2000) //延迟时间
                  that.setData({
                    hasRealName: true,
                    realname: e.detail.value.rName,
                    mobile: e.detail.value.mobile,
                    button_text: '更改个人信息'
                  });
                  app.globalData.user_realname = e.detail.value.rName;
                  app.globalData.user_mobile = e.detail.value.mobile;

                  console.log("更新个人信息成功后的data ");
                  console.log(that.data);
                  console.log("更新个人信息成功后的globalData ");
                  console.log(app.globalData);
                }
              })
            }

          }
        })
      }
    },

    powerDrawer: function (e) {
      var currentStatu = e.currentTarget.dataset.statu;
      this.util(currentStatu)
    },
    util: function (currentStatu) {
      /* 动画部分 */
      // 第1步：创建动画实例   
      var animation = wx.createAnimation({
        duration: 200,  //动画时长  
        timingFunction: "linear", //线性  
        delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData({
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  } 

})