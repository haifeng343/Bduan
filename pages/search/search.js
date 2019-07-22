// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    status:'订单号搜索',
    show:false,
  },
  onShow:function() {

  },
  bindSearch:function(e){
    this.setData({
      value : e.detail.value
    })
  },
  changeVal:function() {
    this.setData({
      show: !this.data.show
    })
  },
  change1:function() {
    this.setData({
      status: '订单号搜索',
      show:false
    })
  },
  change2:function() {
    this.setData({
      status: '账户名搜索',
      show: false
    })
  },
  search:function() {

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