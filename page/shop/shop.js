var app = getApp();
var server = require('../../utils/server');
var request = require('../../utils/requestServer.js');
Page({
  data: {
    filterId: 1,
    cart: {
      count: 0,
      total: 0,
      list: [],
      shop_id:0
    },
    showCartDetail: false,
    shop: [],
    goodsList: [],
    classifySelected: '',
    classifyViewed: '',
    showCart: false,
    loading: false,
  },
  onLoad: function (options) {
    var that = this;
    var shopId = options.id;
    console.log(shopId);
    that.data.cart.shop_id = shopId;
    // for (var attr in app.globalData.shops) {
    //   if (app.globalData.shops[attr].s_id == shopId) {
    //     that.setData({
    //       shop: app.globalData.shops[attr]
    //     });
        //根据shopId获取商家菜品
        that.getGoods(shopId);
        that.getShop(shopId);
        console.log(this.data.shop);
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          duration: 600
        });
        // break;
      //}
    //}
    that.setData({
      loading: true
    });
  },
  onShow: function () {
  },
  getShop:function(option){
    var that = this;
    var url = '/Wxorder/getStore?s_id=' + option;
    request.sendRrquest(url, 'GET', {}, {})
      .then(function (res) {
        that.setData({
         shop:res.data[0],
        });
      }, function (error) {
        console.log(error);
      });

  },
  getGoods: function (res) {
    var that = this;
    var url = '/Wxorder/getGoods?s_id=' + res;
    request.sendRrquest(url, 'GET', {}, {})
      .then(function (res) {
        that.setData({
          goodsList: res.data,
          classifySeleted: res.data[0].gt_id
        });
      }, function (error) {
        console.log(error);
      });
  },
  tapFilters: function (e) {
    switch (e.target.dataset.id) {
      case '1':

        break;
      case '2':

        break;
    }
    this.setData({
      filterId: e.target.dataset.id,
      shops: this.data.shops
    });
  },
  tapAddCart: function (e) {
    var goodId = parseInt(e.target.dataset.id.slice(1));
    if (e.target.dataset.md) {
      var typeId = parseInt(e.target.dataset.md.slice(2));//类型id
      var goodIndex = parseInt(e.target.dataset.gindex.slice(4));//菜品下标
      this.addCart(goodId, typeId, goodIndex);
    }
    else {
      this.addCart(goodId);
    }

  },
  tapReduceCart: function (e) {
    this.reduceCart(e.target.dataset.id);
  },
  addCart: function (goodid, typeid, goodIndex) {
    //id是该菜品的id
    var len = this.data.cart.list.length;
    var f_good = [];//带匹配good
    var good = {
      typeId: -1,
      goodId: -1,
      count: 0,
      goodPrice: -1,
      goodName: ""
    };

    for (var i = 0; i < len; i++) {
      if (this.data.cart.list[i].goodId == goodid) {
        this.data.cart.list[i].count += 1;
        this.countCart();
        return;
      }
    }
    for (var i = 0; i < this.data.goodsList.length; i++) {
      if (parseInt(this.data.goodsList[i].gt_id) == typeid) {
        f_good = this.data.goodsList[i];
        break;
      }
    }
    if (f_good.goods[goodIndex].g_id == goodid) {
      good.goodPrice = f_good.goods[goodIndex].price;
      good.goodName = f_good.goods[goodIndex].g_name;
    }
    good.typeId = typeid;
    good.goodId = goodid;
    good.count += 1;
    this.data.cart.list.push(good);
    this.countCart();
  },
  reduceCart: function (id) {
    //id:要删除的goodId
    for (var i = 0; i < this.data.cart.list.length; i++) {
      if (this.data.cart.list[i].goodId == id) {
        if (this.data.cart.list[i].count <= 1) {
          this.data.cart.list.splice(i, 1);
        } else {
          this.data.cart.list[i].count -= 1;
        }
        this.countCart();
      }
    }
    this.setData({
      showCart: this.data.cart.list.length == 0 ? false : true,
    })
  },
  countCart: function () {
    var count = 0,
      total = 0;
    for (var i = 0; i < this.data.cart.list.length; i++) {
      var good = this.data.cart.list[i];//所选商品
      // console.log(good);
      // console.log(good.typeId);//菜品类型
      // console.log(good.goodId);//菜品
      // console.log(good.count);//菜品数量
      count += good.count;
      total += good.goodPrice * good.count;
      // console.log(total);
    }
    this.data.cart.count = count;
    this.data.cart.total = total;
    this.setData({
      cart: this.data.cart
    });
  },
  clearCartList: function () {
    this.setData({
      cart: {
        count: 0,
        total: 0,
        list: [],
      },
      showCartDetail: false,
      showCart: false
    });
  },
  goOrder: function () {
    console.log(this.data.cart);
    if (this.data.cart.total != 0) {
      wx.setStorageSync('cart.list', this.data.cart.list);
      wx.setStorageSync('cart.count', this.data.cart.count);
      wx.setStorageSync('cart.total', this.data.cart.total);
      wx.setStorageSync('cart.shop_id', this.data.cart.shop_id);
      wx.navigateTo({
        url: '../order/orderdetail'
      })
    }
  },
  follow: function () {
    this.setData({
      followed: !this.data.followed
    });
    console.log(this.data.followed);
    wx.showToast({
      title: this.data.followed ? '收藏成功' : '已取消收藏',
      icon: 'success',
      duration: 1000
    });
  },
  onGoodsScroll: function (e) {
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }

    var scale = e.detail.scrollWidth / 570,
      scrollTop = e.detail.scrollTop / scale,
      h = 0,
      classifySeleted,
      len = this.data.goodsList.length;
    this.data.goodsList.forEach(function (classify, i) {
      var _h = 70 + classify.goods.length * (46 * 3 + 20 * 2);
      if (scrollTop >= h - 100 / scale) {
        classifySeleted = classify.gt_id;
      }
      h += _h;
    });
    this.setData({
      classifySeleted: classifySeleted,
    });
    console.log("classifySeleted:" + classifySeleted);
  },
  tapClassify: function (e) {
    console.log(e);
    var id = e.target.dataset.id.slice(2);
    this.setData({
      classifyViewed: "gs" + id
    });
    var self = this;
    setTimeout(function () {
      self.setData({
        classifySeleted: id
      });
    }, 100);
    console.log(this.data.classifyViewed);
  },
  showCartDetail: function () {
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
  },
  hideCartDetail: function () {
    this.setData({
      showCartDetail: false
    });
    console.log('lalalla' + this.data.cart.list);
  },
  showCartList: function () {
    if (this.data.cart.list.length != 0) {
      this.setData({
        showCart: !this.data.showCart
      })
    }
  }
});

