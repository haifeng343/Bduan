// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  bindSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})