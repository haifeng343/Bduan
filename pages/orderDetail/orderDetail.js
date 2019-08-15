
const netUtil = require('../../utils/request.js');
Page({
  data: { 
    Id:'',
    Info:{},
    mobile:'',
    showCall:false,
  },
  onLoad:function(options) {
    this.setData({
      Id:options.id || ''
    })
    this.init();
  },
  init:function() {
    let that = this;
    var url = 'order/details';
    var params = {
      Id:that.data.Id
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        Info: res.Data,
        mobile: res.Data.BuyAccountMobile,
        showCall: res.Data.BuyAccountMobile.indexOf('*') == -1 && res.Data.BuyAccountMobile != ''
      })
    })
  },
  bindCall:function() {
    wx.makePhoneCall({
      phoneNumber: this.data.mobile,
    })
  },
  //复制
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  onPullDownRefresh: function () {

  },  

  onShareAppMessage: function () {

  }
})