var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageCount: 10,
    page: 1,
    List: [],
    storeId: '', //门店Id
  },
  onLoad: function(options) {
    this.setData({
      storeId: options.storeId
    })
    this.init();
  },
  init: function() {
    let that = this;
    var url = 'recharge/refund/list';
    var params = {
      RefundSn: '',
      StoreId: that.data.storeId,
      PageCount: that.data.pageCount,
      PageIndex: that.data.page,
    }
    netUtil.postRequest(url, params, function(res) {
      let arr = res.Data;
      let arr1 = [];
      arr.forEach(item => {
        item.RefundAmount = Number(item.RefundAmount / 100).toFixed(2)
      })
      if (that.data.page == 1) {
        arr1 = arr
      } else {
        arr1 = that.data.List;
        arr1 = arr1.concat(res.Data)
      }
      that.setData({
        List: arr1
      })
    })
  },
  bindEor: function (e) {
    console.log(e)
    wx.showModal({
      title: '退款失败',
      content: e.currentTarget.dataset.item.StatusDes + '\r\n' + '处理时间:' + e.currentTarget.dataset.item.HandlerTime,
      showCancel: false,
      confirmColor: '#3DD6D1',
      confirmText: '知道了',
      success: function () {

      }
    })
  },
  bindSearch: function() {
    wx.navigateTo({
      url: '/pages/searchRefund/searchRefund?storeId='+this.data.storeId,
    })
  },
  bindRefundDetail: function(e) {
    wx.navigateTo({
      // url: '/pages/orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
      url: '/pages/refundDetail/refundDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  onPullDownRefresh: function() {
    this.setData({
      page: 1
    })
    this.init();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function() {
    let temp = this.data.page;
    temp++;
    this.setData({
      page: temp
    })
    this.init();
  },

  onShareAppMessage: function() {

  }
})