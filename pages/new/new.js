// pages/new/new.js
var location = "";
var config = require('../../config.js');
var app = getApp();
var util = require('../../utils/util.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {
        end_date: "2018-01-01",
        checkboxItems: [
            // { name: '拍照打卡', value: '1', checked: false },
          { name: '地点打卡', value: '2', checked: true, disabled:true }
            // { name: '人脸打卡', value: '3' }
        ],
        activity_location: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        var that = this;
        location = getApp().data.activity_location;
        console.log("【new.js】新建活动页面onShow时，获取的地点getApp().data.activity_location：")
        console.log(location);
        if (location != "") {
            that.setData({
                activity_location: location
            });
        }
        //设置默认活动日期为今天
        var today = util.formatDate(new Date());
        that.setData({
          end_date: today
        });
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
    // /**
    //  * 选择日期并获取日期
    //  */
    // bindStartDateChange: function (e) {
    //     this.setData({
    //         start_date: e.detail.value
    //     });
    //     // console.log("开始日期变化")
    // },
    bindEndDateChange: function (e) {
        this.setData({
            end_date: e.detail.value
        })
    },

    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        console.log(e.detail);
        var checkboxItems = this.data.checkboxItems, values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (checkboxItems[i].value == values[j]) {
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }
        this.setData({
            checkboxItems: checkboxItems
        });
    },

    getLocation: function () {
        wx.navigateTo({
            url: '../addLocation/addLocation',
        });
    },
    
    formSubmit: function (e) {
        var ifPhoto = 0;
        var ifLocation = 1;
        var ifFace = 0;
        var value = e.detail.value;
        console.log("【new.js】创建活动待提交的活动信息：");
        console.log(value);
        // //根据勾选，设置认证方式
        // var types = value.checkin_types;
        // for (var i = 0; i < types.length; i++) {
        //     if (types[i] == 1) {
        //         ifPhoto = 1;
        //     }
        //     if (types[i] == 2) {
        //         ifLocation = 1;
        //     }
        //     if (types[i] == 3) {
        //         ifFace = 1;
        //     }
        // }
      console.log("【new.js】调用创建活动接口：/activity/create")
        wx.request({
            url: config.url+'/activity/create',
            data: {
                'createrId': app.globalData.user_id,
                'activity_name': value.activity_name,
                'activity_desc': value.activity_desc,
                'location': value.activity_location,
                'lat': app.data.activity_lat,
                'lng': app.data.activity_lng,
                'endDate':value.end_date,
                'ifFace':ifFace,
                'ifPhoto':ifPhoto,
                'ifLocation':ifLocation
            },
            method:'POST',
            success:function(res) {
                console.log("【new.js】调用新建活动接口成功返回：");
                console.log(res.data);
                wx.switchTab({
                    url: '/pages/manage/manage'
                })
            }
        })
    },
    bindGetUserInfo: function (e) {
      console.log("button上bindGetUserInfo：")
      console.log(e.detail.userInfo)
    }
})