// pages/myStore/myStore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  navtoStoreAccount: function () {
    wx.navigateTo({
      url: '/pages/storeAccount/storeAccount',
    })
  },
  navtoStoreTeacher: function () {
    wx.navigateTo({
      url: '/pages/storeTeacher/storeTeacher',
    })
  },
  onShareAppMessage: function () {

  }
})