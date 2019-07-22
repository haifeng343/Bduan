// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    code:'',
    InputType: 'password',
    eyeImg: '../../img/eyes.png',
    password1:'',
    password2:'',
  },
  bindName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  forget: function () {
    wx.navigateTo({
      url: '/pages/forgetPassword/forgetPassword',
    })
  },
  bindPassword1:function(e){
    this.setData({
      password1:e.detail.value
    })
  },
  bindPassword2: function (e) {
    this.setData({
      password2: e.detail.value
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

  onShareAppMessage: function () {

  }
})