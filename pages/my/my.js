// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  bindGroup:function() {
    wx.navigateTo({
      url: '/pages/myGroup/myGroup',
    })
  },
  bindCallUs:function() {
    wx.navigateTo({
      url: '/pages/callUs/callUs',
    })
  },
  bindAccountMent:function() {
    wx.navigateTo({
      url: '/pages/accountMoment/accountMoment',
    })
  },
  bindCourse:function() {
    wx.navigateTo({
      url: '/pages/myCourse/myCourse',
    })
  },
  bindTeachers:function() {
    wx.navigateTo({
      url: '/pages/myTeachers/myTeachers',
    })
  },
  bindStore:function() {
    wx.navigateTo({
      url: '/pages/myStore/myStore',
    })
  },
  bindSetting:function() {
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})