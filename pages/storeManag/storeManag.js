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
  callSmo:function(e) { 
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile,
    })
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
  navtoClass:function(e) {
    wx.navigateTo({
      url: '/pages/storeClass/storeClass?Id=' + e.currentTarget.dataset.id,
    })
  },
  navtoStoreAccount: function (e) {
    wx.navigateTo({
      url: '/pages/storeAccount/storeAccount?Id=' + e.currentTarget.dataset.id,
    })
  },
  navtoStoreTeacher: function (e) {
    wx.navigateTo({
      url: '/pages/storeTeacher/storeTeacher?Id=' + e.currentTarget.dataset.id,
    })
  },
  navtoRecharge:function(e) {
    wx.navigateTo({
      url: '/pages/rechar/rechar?Id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name + '&money=' + this.data.Info.Money,
    })
  },
  onShareAppMessage: function () {

  }
})