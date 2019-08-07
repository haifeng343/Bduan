
const netUtil = require('../../utils/request.js');
Page({
  data: { 
    Id:'',
    Info:{},
    mobile:'',
  },
  onLoad:function(options) {
    this.setData({
      Id:options.id
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
        mobile: res.Data.BuyAccountMobile
      })
    })
  },
  bindCall:function() {
    wx.makePhoneCall({
      phoneNumber: this.data.mobile,
    })
  },
  bindCause:function(e) {
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?id='+e.currentTarget.dataset.id,
    })
  },
  onPullDownRefresh: function () {

  },  

  onShareAppMessage: function () {

  }
})