// pages/reservationForm/reservationForm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",//课程名称
    storeId:"",//门店Id
    itemId:"",//项目Id
  },
  onLoad: function (options) {
    this.setData({
      name:options.name || '',
      storeId: options.storeId || '',
      itemId: options.itemId || '',
    })
    wx.setNavigationBarTitle({
      title: '预约表-'+this.data.name,
    })
  },
  onShareAppMessage: function () {

  }
})