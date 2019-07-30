var netUtil = require("../../utils/request.js"); //require引入
var utilMd5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    value: '',
    InputType: 'password',
    eyesImg: '../../img/eyes.png',
    eyeImg: '../../img/eye.png',
  },
  bindName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPassword: function(e) {
    this.setData({
      value: e.detail.value
    })
  },
  forget:function(){
    wx.navigateTo({
      url: '/pages/forgetPassword/forgetPassword',
    })
  },
  changeEyeImg: function() {
    console.log(this.data.InputType);
    let t = this.data.InputType == 'password' ? 'text' : 'password';
    console.log(t);
    this.setData({ InputType: t });
  },
  submitBtn:function() {
    let that = this;
    var url = 'account/login/password';
    var params = {
      AccountName: that.data.name,
      Password: utilMd5.hexMD5(that.data.value),
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      wx.setStorageSync('userInfo', res.Data);
      wx.switchTab({
        url: '/pages/index/index',
      })
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

  onShareAppMessage: function() {

  }
})