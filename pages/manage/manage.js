var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var config = require('../../config.js');
var app = getApp();

Page({
    data: {
        tabs: ["进行中", "已结束"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        completed: [],
        processing: []
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    onShow: function () {
        console.log("【manage.js】onShow时先用userId查询用户申请的活动列表")
        var that = this;
        wx.request({
            url: config.url + '/activity/getall',
            data:{
                'userId':app.globalData.user_id
            },
            method: 'POST',
            success: function (res) {
              console.log("【manage.js】后台接口/activity/getall返回的结果：")
                console.log(res.data);
                that.setData({
                    completed: res.data.completed,
                    processing: res.data.processing
                });
            }
        })
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
});