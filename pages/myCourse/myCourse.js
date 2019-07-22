// pages/myCourse/myCourse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  bindCourseDetail:function() {
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail',
    })
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