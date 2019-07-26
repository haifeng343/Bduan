var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSuccess: false,
    IsShow:'',
    Id: '',
    List: [], //我的门店杭虎列表
    accountList: [], //所有门店列表
    checkArr: [],
  },
  onLoad: function(options) {
    let IsShow = wx.getStorageSync('userInfo').IsAdministrator;
    this.setData({
      Id: options.Id,
      IsShow: IsShow
    })
    console.log(this.data.IsShow)
    this.init();
  },
  //我的门店账户列表
  init: function() {
    let that = this;
    var url = 'account/storeaccount/list';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res)
      that.setData({
        List: res.Data,
      })
    })
  },
  //获取商户账户列表
  getAccountList: function() {
    let that = this;
    var url = 'account/selleraccount/list';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res)
      that.setData({
        accountList: res.Data,
      })
    })
  },
  //切换
  checkedChange: function(e) {
    // console.log(e);
    this.setData({
      checkArr: e.detail.value
    })
    console.log(this.data.checkArr)
  },
  //取消分配
  bindCancel: function() {
    this.setData({
      showSuccess: false
    })
  },
  //确认分配
  bindSure: function() {
    let that = this;
    var url = 'account/storeaccount/set';
    var params = {
      StoreId: that.data.Id,
      AccountId: that.data.checkArr
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res)
      that.setData({
        showSuccess: false
      })
    })
  },
  fenpei: function() {
    this.setData({
      showSuccess: !this.data.showSuccess
    })
    this.getAccountList();
  },
  onShareAppMessage: function() {

  }
})