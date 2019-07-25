var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    Id:'',
    Info:{},
    CategoryList:'',
  },
  onLoad:function(options) {
    this.setData({
      Id:options.Id
    })
    this.init();
  },
  init() {
    this.getData();
  },
  getData:function() {
    let that = this;
    var url = 'account/store/details';
    var params = {
      Id:that.data.Id
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      that.setData({
        Info: res.Data,
        CategoryList: (res.Data.CategoryList).toString().replace(/,/g,'/')
      })
    })
  },
  navtoStoreAccount: function () {
    wx.navigateTo({
      url: '/pages/storeAccount/storeAccount?Id='+this.data.Id,
    })
  },
  navtoStoreTeacher: function () {
    wx.navigateTo({
      url: '/pages/storeTeacher/storeTeacher?Id=' + this.data.Id,
    })
  },
  onShareAppMessage: function () {

  }
})