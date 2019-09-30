Page({

  data: {

  },


  onLoad: function(options) {

  },
  bindVercation: function() {
    wx.navigateTo({
      url: '/pages/vercationLog/vercationLog',
    })
  },
  bindQuan: function() {
    wx.navigateTo({
      url: '/pages/yanquan/yanquan',
    })
  },
  onShareAppMessage: function() {

  }
})