const netUtil = require('../../utils/request.js');
Page({
  data: {
    Id: '', //退款Id
    Info: {},
    money: '', //退款金额
  },
  onLoad: function(options) {
    this.setData({
      Id: options.id || ''
    })
    this.init();
  },
  init: function() {
    let that = this;
    var url = 'recharge/refund/details';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) {
      let arr = res.Data;
      arr.List.forEach(item => {
        item.RefundMoney = Number(item.RefundMoney / 100).toFixed(2)
      })
      that.setData({
        Info: arr,
        money: Number(res.Data.RefundAmount / 100).toFixed(2),
      })
    })
  },
  bindEor: function(e) {
    wx.showModal({
      title: '退款失败',
      content: e.currentTarget.dataset.statusdes,
      showCancel: false,
      confirmColor: '#3DD6D1',
      confirmText: '知道了',
      success: function() {

      }
    })
  },
  //复制
  copyText: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  lookEor: function(e) {
    wx.showModal({
      title: '失败原因',
      content: this.data.Info.StatusDes + '\r\n' + '处理时间:' + this.data.Info.HandlerTime,
      confirmText: '知道了',
      confirmColor: '#29d9d6',
      showCancel: false,
      success: function() {

      }
    })
  },
  //取消退款
  bindCancel: function() {
    let that = this;
    var url = 'recharge/refund/cancel';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showModal({
        title: '取消退款成功',
        content: '',
        confirmColor: '',
        showCancel: false,
        confirmText: '知道了',
        success: function() {
          that.setData({
            'Info.RefundStatus': 5
          })
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; //上一页面
          let tempList = prevPage.data.List;
          tempList.forEach(item => {
            if (that.data.Id == item.Id) {
              item.RefundStatus = 5
            }
          })
          prevPage.setData({ //直接给上移页面赋值
            List: tempList
          });
        }
      })
    })
  },
  onPullDownRefresh: function() {

  },

  onShareAppMessage: function() {

  }
})