var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    usertoken:'',
  },
  onShow:function() {
    // let userInfo = wx.getStorageSync('userInfo');
    // let usertoken = wx.getStorageSync('userInfo').UserToken;
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || '',
      usertoken: wx.getStorageSync('userInfo').UserToken || ''
    })
    this.init();
  },
  onLoad:function() {
    // this.init();
  },
  init: function () {
    let that = this;
    var url = 'account/info';
    var params = {}
    netUtil.postRequest(url, params, function (res) {
      wx.setStorageSync('userInfo', res.Data)
    }, null, false, false, false)
  },
  navtoRecharge: function () {
    wx.navigateTo({
      url: '/pages/transition/transition?accountId=' + this.data.userInfo.AccountId
    })
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
  bindAboutUs:function() { 
    wx.navigateTo({
      url: '/pages/aboutUs/aboutUs',
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
  bindActive:function() {
    wx.navigateTo({
      url: '/pages/active/active',
    })
  },
  bindLogin:function() {
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },

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