var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    userInfo:{},
    sellerAmount:0,//商家总金额
    sellerId:'',//商家Id
    storeList:[],
  },
  onShow:function() {
    let userInfo = wx.getStorageSync('userInfo');
    let sellerAmount = wx.getStorageSync('userInfo').SellerAmount;
    let sellerId = wx.getStorageSync('userInfo').SellerId;
    this.setData({
      userInfo:userInfo,
      sellerAmount: Number(sellerAmount/100).toFixed(2),
      sellerId: sellerId,
    })
    this.init();
  },
  init: function () {
    let that = this;
    var url = 'account/store/list';
    var params = {
      Id: that.data.storeId
    }
    netUtil.postRequest(url, params, function (res) {
      res.Data.forEach(item=>{
        item.Money = Number(item.Money/100).toFixed(2);
      })
      that.setData({
        storeList:res.Data,
      })
    }, null, false, false, false)
  },
  navtoRecharge:function() {
    wx.navigateTo({
      url: '/pages/rechar/rechar?Id=' + this.data.sellerId + '&money=' + this.data.sellerAmount+'&status=2',
    })
  },
  navtoStoreRecharge:function(e) {
    wx.navigateTo({
      url: '/pages/rechar/rechar?Id=' + e.currentTarget.dataset.id + '&money=' + e.currentTarget.dataset.money + '&name=' + e.currentTarget.dataset.name + '&status=1',
    })
  },
  onShareAppMessage: function () {

  }
})