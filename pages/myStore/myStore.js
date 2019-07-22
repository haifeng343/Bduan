// pages/myStore/myStore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  bindStoreManag:function() {
    wx.navigateTo({
      url: '/pages/storeManag/storeManag',
    })
  },
  onShareAppMessage: function () {

  }
})