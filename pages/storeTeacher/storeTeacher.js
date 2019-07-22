// pages/storeAccount/storeAccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSuccess: true,
  },
  bindCancel: function () {
    this.setData({
      showSuccess: false
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