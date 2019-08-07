const netUtil = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Id:'',
    Info:{},
  },
  onLoad:function(options) {
    this.setData({
      Id:options.id || ''
    })
    this.init();
  },
  init:function() {
    let that = this;
    var url = 'account/activitygroup/details';
    var params = {
      Id:that.data.Id
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        Info: res.Data
      })
    })
  },
  bindGropDetail:function(e){
    wx.navigateTo({
      url: '/pages/gropDetail/gropDetail?id='+e.currentTarget.dataset.id,
    })
  },
  onShareAppMessage: function () {

  }
})