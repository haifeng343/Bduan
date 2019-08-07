
var netUtil = require("../../utils/request.js"); //require引入

Page({

  data: {
    List: [],
    Info: {},
  },
  //复制微信号
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
  onLoad: function (options) {
    this.init();
  },
  init: function () {
    this.getData();
  },
  getData: function () {
    let that = this;
    var url = 'account/customer/service';
    var params = {
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      console.log(res)
      that.setData({
        List: res.Data.List,
        Info: res.Data
      })
    }); //调用get方法情就是户数
  },
  onShareAppMessage: function (res) {
   
  },
})