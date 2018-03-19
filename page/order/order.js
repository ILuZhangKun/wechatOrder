// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex:0,
    status:0,
    order:[],
    open_id: wx.getStorageSync('open_id'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
   wx.request({
     url: 'http://60.205.229.120/wechatorder/index.php/Apiwx/Wxorder/getOrderSub?openid='+that.data.open_id,
     success: function (res) {
       console.log(res);
       that.setData({
         order: res.data
       })
     }
   });
   console.log(that.data);
  },
  changeTab:function(e){
    var that=this;
    var index = e.currentTarget.dataset.index
    that.setData({
      tabIndex: index,
    })
    if(index==1){
      wx.request({
        url: 'http://60.205.229.120/wechatorder/index.php/Apiwx/Wxorder/getOrderPay?openid='+that.data.open_id,
        success: function (res) {
          console.log(res);
          that.setData({
            order: res.data
          })
        }
      });
    }else if(index==2){
      wx.request({
        url: 'http://60.205.229.120/wechatorder/index.php/Apiwx/Wxorder/getOrderDone?openid=' + that.data.open_id,
        success: function (res) {
          console.log(res);
          that.setData({
            order: res.data
          })
        }
      });
    } else {
      wx.request({
        url: 'http://60.205.229.120/wechatorder/index.php/Apiwx/Wxorder/getOrderSub?openid=' + that.data.open_id,
        success: function (res) {
          console.log(res);
          that.setData({
            order: res.data
          })
        }
      });
    }
  },
  
})