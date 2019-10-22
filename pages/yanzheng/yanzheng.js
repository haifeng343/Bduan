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
  bindTransaction:function() {
    wx.navigateTo({
      url: '/pages/transaction/transaction',
    })
  },
  onShareAppMessage: function() {

  }
})