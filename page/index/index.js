var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
		filterId: 1,
		// address: '定位中…',
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../imgs/stars/emptystar.png',
    selectedSrc: '../../imgs/stars/fullstar.png',
    halfSrc: '../../imgs/stars/halfstar.png',
    key: 0,//评分
    banners:[],
    shops:[]
	},
  onLoad: function (options) {
    var that=this;
    that.setData({
      banners: app.globalData.banners,
      //shops: app.globalData.shops
    });
    that.getShop();
    //console.log(that.data.banners);
    // console.log(that.data.shops);
  },
  getShop: function () {
    var self = this;
    //console.log(self);
    //console.log(self.options.uid);
    wx.request({
      url: 'http://60.205.229.120/wechatorder/index.php/Apiwx/Wxorder/getStoreInfo?uid=' + self.options.uid,
      success: function (res) {
        var shoparr=[];
        for (var attr in res.data) {
          shoparr.push(res.data[attr]);
        }
        console.log(res.data);
        self.setData({
          shops: shoparr
        })
        //self.globalData.shops = res.data;
        console.log(self.data.shops);
      }
    })
  },
	onShow: function () {
	},
	onScroll: function (e) {
		if (e.detail.scrollTop > 100 && !this.data.scrollDown) {
			this.setData({
				scrollDown: true
			});
		} else if (e.detail.scrollTop < 100 && this.data.scrollDown) {
			this.setData({
				scrollDown: false
			});
		}
	},
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onReachBottom:function(){
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
  },
	tapSearch: function () {
		wx.navigateTo({url: 'search'});
	},
	toNearby: function () {
		var self = this;
		self.setData({
			scrollIntoView: 'nearby'
		});
		self.setData({
			scrollIntoView: null
		});
	},
	tapFilter: function (e) {
    console.log(this.data.shops);
    console.log(e.target.dataset.id);
		switch (e.target.dataset.id) {
			case '1':
        this.data.shops.sort(function (a, b) {
          return a.s_id > b.s_id;
				});
				break;
			case '2':
        this.data.shops.sort(function(a,b){
          return a.sales < b.sales;
        });
				break;
			case '3':
				this.data.shops.sort(function (a, b) {
					return a.score > b.score;
				});
				break;
		}
		this.setData({
			filterId: e.target.dataset.id,
			shops: this.data.shops/*********/
		});
	},
	tapBanner: function (e) {
		var name = this.data.banners[e.target.dataset.id].name;
		wx.showModal({
			title: '提示',
			content: '您点击了“' + name + '”活动链接，活动页面暂未完成！',
			showCancel: false
		});
	},
  //点击右边,半颗星
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    console.log("得" + key + "分")
    this.setData({
      key: key
    })

  },
  //点击左边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    console.log("得" + key + "分")
    this.setData({
      key: key
    })
  }
});

