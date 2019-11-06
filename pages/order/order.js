var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageCount:10,
    page:1,
    List:[],
  },
  onLoad:function(options) {
    this.init();
  },
  init:function() {
    let that = this;
    var url = 'order/list';
    var params = {
      OrderSn: '',
      BuyAccountName: '',
      SheetId: '',
      PageCount: that.data.pageCount,
      PageIndex: that.data.page,
    }
    netUtil.postRequest(url, params, function (res) {
      let arr = res.Data;
      let arr1 = [];
      if(that.data.page==1){
        arr1 = arr
      }else{
        arr1 = that.data.List;
        arr1 = arr1.concat(res.Data)
      }
      that.setData({
        List: arr1,
      })
    }, null, true, true, true, true)
  },
  bindSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  bindDetail:function(e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id='+e.currentTarget.dataset.id,
    })
  },
  onPullDownRefresh: function() {
    this.setData({
      page:1
    })
    this.init();
  },

  onReachBottom: function() {
    let temp = this.data.page;
    temp++;
    this.setData({
      page:temp
    })
    this.init();
  },

  onShareAppMessage: function() {

  }
})