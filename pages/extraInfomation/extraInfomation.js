var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: "", //门店Id
    itemId: "", //项目Id
    name: "", //项目名称
    List: [],
  },

  onLoad: function(options) {
    this.setData({
      storeId: options.storeId || '',
      itemId: options.itemId || '',
      name: options.name || '',

    })
    wx.setNavigationBarTitle({
      title: '额外信息-' + this.data.name,
    })
    this.init();
  },

  init: function() {
    let that = this;
    var url = 'account/storeitem/othercontent/list';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        List: res.Data
      })
    })
  },

  edit: function(e) {
    let that = this;
    let item = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ["编辑", "删除"],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/addExtra/addExtra?Id=' + item.id + '&title=' + item.title + '&content=' + item.content + '&storeId=' + that.data.storeId + '&itemId=' + that.data.itemId,
          })
        }
        if (res.tapIndex == 1) {

        }
      }
    })
  },
  //删除
  
  add: function() {
    wx.navigateTo({
      url: '/pages/addExtra/addExtra?storeId=' + this.data.storeId + '&itemId=' + this.data.itemId,
    })
  },
  onShareAppMessage: function() {

  }
})