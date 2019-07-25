var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSuccess: false,
    Id: '',
    List: [], //我的门店杭虎列表
    accountList: [], //所有门店列表
    checkArr: [],
  },
  onLoad: function(options) {
    this.setData({
      Id: options.Id
    })
    this.init();
  },
  init() {
    this.getData();
  },
  //我的门店账户列表
  getData: function() {
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