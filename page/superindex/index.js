var app = getApp();
var num;
Page({
  data: {
    share: 1,
    flag: false,
    mark: true,
    list:[],
    currentCity: ''
  },
  // onLoad: function (options) {
  //   var that = this;
  //   var id = options.id;
  //   var cityname = options.name;
  //   var shareurl = 'https://www.youyuwei.com/apiweb/xcxcity?lat=' + lat + '&lng=' + long + '';
  //   console.log(shareurl);
  //   wx.showToast({
  //     title: '加载中...',
  //     icon: 'loading',
  //     duration: 1000
  //   });
  //   if (id == undefined) {
  //     wx.getLocation({
  //       type: 'wgs84',
  //       success: function (res) {
  //         wx.hideToast();
  //         var lat = res.latitude; //维度
  //         var long = res.longitude //经度
  //         wx.request({
  //           url: 'https://www.youyuwei.com/apiweb/xcxcity?lat=' + lat + '&lng=' + long + '',
  //           method: 'GET',
  //           success: function (res) {
  //             console.log(res.data.data.list);
  //             var arr = res.data.data.list;
  //             var first = arr[0];
  //             var second = arr[1];
  //             var three = arr[2];
  //             var name = first.content.name;
  //             var content = second.content.length;
  //             var len = first.content.labellist.length;
  //             var tshow = three.content.length;
  //             var cityId = first.content.id;
  //             if (content <= 3) {
  //               num = 0;
  //             } else {
  //               if (content % 3 == 0) {
  //                 num = 0
  //               }
  //               if (content % 3 == 1) {
  //                 num = 1
  //               }
  //               if (content % 3 == 2) {
  //                 num = 2
  //               }
  //             }
  //             that.setData({
  //               first: first,
  //               second: second,
  //               ven: content,
  //               three: three,
  //               len: len,
  //               ren: tshow,
  //               cityname: name,
  //               cityId: cityId,
  //               shareurl: shareurl,
  //               num: num
  //             })
  //           }
  //         })
  //       },
  //     })
  //   } else {
  //     var lat = "";//维度
  //     var long = "";//经度
  //     wx.request({
  //       url: shareurl+'&id=' + id + '',
  //       method: 'GET',
  //       success: function (res) {
  //         wx.hideToast()
  //         var arr = res.data.data.list;
  //         var first = arr[0];
  //         var second = arr[1];
  //         var three = arr[2];
  //         var content = second.content.length;
  //         var len = first.content.labellist.length;
  //         var tshow = three.content.length;
  //         if (content <= 3) {
  //           num = 0;
  //         } else {
  //           if (content % 3 == 0) {
  //             num = 0
  //           }
  //           if (content % 3 == 1) {
  //             num = 1
  //           }
  //           if (content % 3 == 2) {
  //             num = 2
  //           }
  //         }
  //         that.setData({
  //           first: first,
  //           second: second,
  //           three: three,
  //           ven: content,
  //           ren: tshow,
  //           len: len,
  //           num: num,
  //           cityId: id,
  //           cityname: cityname,
  //           shareurl: shareurl
  //         })
  //       }
  //     })
  //   }

  // },
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var id = options.id;
    var cityname = options.name;
    var shareurl = 'http://60.205.229.120/wechatorder/index.php/Apiwx/Wxorder/getGroup';
    console.log(shareurl);
    this.getLocation();
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1000
    });
    wx.request({
      url: shareurl,
      success: function (res) {
        console.log(res);
        wx.hideToast();
        that.setData({
          list:res.data
        });
      }
    });
    
  },
  toggle: function (e) {
    var mark = this.data.mark;
    if (mark) {
      this.setData({
        flag: true,
        mark: false
      })

    } else {
      this.setData({
        flag: false,
        mark: true
      })
    }
  },
  search: function () {
    wx.navigateTo({ url: 'search' });
  },
  onShareAppMessage: function () {
    var cityname = this.data.cityname;
    var id = this.data.cityId;
    return {
      title: "余味全球美食",
      desc: cityname + "美食推荐",
      path: '/pages/index/index?id=' + id + '&name=' + cityname + ''
    }
  },

  getLocation: function () {
    var page = this
    wx.getLocation({
      type: 'wgs84',   //<span class="comment" style="margin:0px;padding:0px;border:none;">默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标</span><span style="margin:0px;padding:0px;border:none;"> </span>  
      success: function (res) {
        // success    
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var page = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=wIcQb8qunl8AkiZaLCfpVhveMyDjaRDG&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success    
        console.log(res);
        var city = res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district;
        name=city+district;
        page.setData({ currentCity: name });
      },
      fail: function () {
        page.setData({ currentCity: "获取定位失败" });
      },

    })
  }  
})