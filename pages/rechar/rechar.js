var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    storeId: '', //门店Id
    name: '', //门店名称
    money:0,//金额
  },

  onLoad: function(options) {
    this.setData({
      storeId: options.Id || '',
      nmae: options.name || '',
      money: options.money || 0,
    })
    wx.setNavigationBarTitle({
      title: '充值-' + options.name,
    })
  },
  onShow:function() {
    this.init();
  },
  init:function() {
    let that = this;
    var url = 'account/store/details';
    var params = {
      Id: that.data.storeId
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        money: res.Data.Money,
      })
    }, null, false, false, false)
  },
  paybtn: function() {
    wx.navigateTo({
      url: '/pages/rechargeMoney/rechargeMoney?storeId='+this.data.storeId,
    })
  },
  bindRechargeLog: function() {
    wx.navigateTo({
      url: '/pages/rechargeLog/rechargeLog?storeId=' + this.data.storeId,
    })
  },
  bindRefundLog: function() {
    wx.navigateTo({
      url: '/pages/refundLog/refundLog?storeId=' + this.data.storeId,
    })
  },
  bindRefund:function() {
    wx.navigateTo({
      url: '/pages/refund/refund?storeId=' + this.data.storeId+'&price='+this.data.money,
    })
  },
  onShareAppMessage: function() {

  }
})