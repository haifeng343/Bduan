const netUtil = require('../../utils/request.js');
Page({

  data: {
    Id: '',
    Info: {},
    List:[],
    pageCount:20,
    page:1,
  },
  onLoad: function(options) {
    this.setData({
      Id: options.id
    })
    this.init();
    this.getOrderList();
  },
  bindSearch: function(e) {
    wx.navigateTo({
      url: '/pages/search/search?id=' + e.currentTarget.dataset.id+'&name='+e.currentTarget.dataset.name,
    })
  },
  getOrderList: function() {
    let that = this;
    var url = 'order/list';
    var params = {
      OrderSn: '',
      BuyAccountName: '',
      SheetId: that.data.Id,
      PageCount: that.data.pageCount,
      PageIndex: that.data.page,
    }
    netUtil.postRequest(url, params, function(res) {
      let arr = res.Data;
      let arr1 = [];
      if (that.data.page == 1) {
        arr1 = arr
      } else {
        arr1 = that.data.List;
        arr1 = arr1.concat(res.Data)
      }
      that.setData({
        List: arr1,
      })
    })
  },
  init: function() {
    let that = this;
    var url = 'account/sheet/details';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        Info: res.Data
      })
    })
  },
  bindDetail: function (e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    this.getOrderList();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    let temp = this.data.page;
    temp++;
    this.setData({
      page: temp
    })
    this.getOrderList();
  },

  onShareAppMessage: function() {

  }
})