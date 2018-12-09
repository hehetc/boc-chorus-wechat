var des_lat = -1;
var des_lng = -1;
var des_title = "";
var callout_obj={};

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
//腾讯地图Key
var demo = new QQMapWX({
  key: 'CAYBZ-FPZKV-I6WPA-UMYBP-BBGTE-TBFHU'
});

Page({
    data: {
        markers: [{
            iconPath: "../../image/marker.png",
            id: 0,
            latitude: -1,
            longitude: -1,
            callout:{}
        }],
        controls: [{
            id: 1,
            iconPath: '../../image/location.png',
            position: {
                left: 20,
                top: 450 - 50,
                width: 30,
                height: 30
            },
            clickable: true
        }],
        inputShowed: false,
        inputVal: "",
        central_longitude: -1,
        central_latitude: 20,
    },
    regionchange(e) {
        // console.log(e.type)
    },
    /**
     * 点击marker的时候触发，显示callout
     */
    markertap(e) {
        var that = this;
        callout_obj = {
            content:des_title,
            color:"#000",
            fontSize:12,
            borderRadius:5,
            padding:3,
            display:'ALWAYS',
            textAlign:'cneter'
        };
        that.setData({
            markers:[{
                iconPath: "../../image/marker.png",
                id: 0,
                latitude: des_lat,
                longitude: des_lng,
                callout: callout_obj
            }]
        });
        
    },
    controltap(e) {
        var that = this;
        that.mapCtx.moveToLocation();
    },

    searchDetail: function () {
        wx.redirectTo({
            url: '../searchDetail/searchDetail',
        })
    },

    /**
     * 页面载入的时候获取用户地址
     */
    onLoad: function (options) {
        console.log("【addLocation.js】：页面加载时获取用户地址")
        var that = this;
        if (!getApp().data.haveLocation) {
          console.log("【addLocation.js】getApp().data中:尚没有地点，则调微信接口获取地点：");
            wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  console.log("【addLocation.js】调用getLocation返回的结果（经纬度等）:")
                  console.log(res);
                  //设置本页面的data中的：central_longitude、central_latitude
                    that.setData({
                        central_latitude: res.latitude,
                        central_longitude: res.longitude
                    });
                    //设置目的地址（发起签到的签到地址）为当前经纬度
                    des_lat = res.latitude;
                    des_lng = res.longitude;
                    // 调用“逆地址解析”接口
                    console.log("【addLocation.js】开始调用逆地址解析接口...");
                    demo.reverseGeocoder({
                      location: {
                        latitude: des_lat,
                        longitude: des_lng
                      },
                      success: function (res) {
                        console.log("【addLocation.js】逆地址解析成功，返回结果：")
                        console.log(res);
                        //设置目的地址的中文地址为解析出来的
                        des_title = res.result.address;
                      },
                      fail: function (res) {
                        console.log("【addLocation.js】逆地址解析error，返回结果：");
                        console.log(res);
                      },
                      complete: function (res) {
                      }
                    });

                    that.setData({
                      markers: [{
                        iconPath: "../../image/marker.png",
                        id: 0,
                        width:30,
                        height:30,
                        latitude: des_lat,
                        longitude: des_lng
                      }],
                      central_latitude: des_lat,
                      central_longitude: des_lng
                    })

                }
            });
            // getApp().data.haveLocation = true;
            // //页面退出的时候也要更新haveLocation！！！！！
        }

      console.log("【addLocation.js】getApp().data中已haveLocation：");
      console.log(getApp().data);
        // des_lat = options.lat;
        // des_lng = options.lng;
        // des_title = options.title;
        // that.setData({
        //     markers: [{
        //         iconPath: "../../image/marker.png",
        //         id: 0,
        //         latitude: des_lat,
        //         longitude: des_lng
        //     }],
        //     central_latitude: des_lat,
        //     central_longitude: des_lng
        // })

    },

    onReady: function (e) {
        var that = this;
        that.mapCtx = wx.createMapContext('myMap');
    },

    /**
     * 确定地点并返回
     */
    submit_location: function() {
        getApp().data.activity_lat = des_lat;
        getApp().data.activity_lng = des_lng;
        getApp().data.activity_location = des_title;
        console.log("获取地点页面，点击确定后，设置getApp().data中的位置信息为当前位置。打印getApp().data：")
        console.log(getApp().data);
        wx.navigateBack({
            delta:1
        });
    }
})