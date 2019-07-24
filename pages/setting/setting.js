// pages/setting/setting.js
Page({

 
  data: {

  },
  modifyPhone:function(){
    wx.navigateTo({
      url: '/pages/modifyPhone/modifyPhone',
    })
  },
  modifyPassword:function() {
    wx.navigateTo({
      url: '/pages/modifyPassword/modifyPassword',
    })
  },
  onLoad: function (options) {

  },

  onShareAppMessage: function () {

  }
})