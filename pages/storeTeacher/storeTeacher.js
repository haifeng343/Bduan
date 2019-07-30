var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLog: true,
    Id: '',
    List: [],//我的门店杭虎列表
    accountList: [],//所有门店列表
    checkArr: [],
  },
  onLoad: function (options) {
    this.setData({
      Id: options.Id
    })
    this.init();
  },
  init() {
    this.getData();
  },
  //我的师资列表
  getData: function () {
    let that = this;
    var url = 'account/storeteacher/list';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      console.log(res)
      that.setData({
        List: res.Data,
      })
    })
  },
  //获取商户账户列表
  getAccountList: function () {
    let that = this;
    var url = 'account/sellerteacher/list';
    var params = {
      Id: that.data.Id,
      Status:1
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        accountList: res.Data,
      })
    })
  },
  //切换
  checkedChange: function (e) {
    console.log(e)
    this.setData({
      checkArr: e.detail.value
    })
  },
  //取消分配
  bindCancel: function () {
    this.setData({
      showLog: true
    })
  },
  //确认分配
  bindSure: function () {
    let that = this;
    var url = 'account/storeteacher/set';
    var params = {
      StoreId: that.data.Id,
      TeacherId: that.data.checkArr
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        showLog: true
      })
      wx.showToast({
        icon: 'none',
        title: '已分配完成',
      })
      that.init();
    })
  },
  fenpei: function () {
    this.setData({
      showLog: !this.data.showLog
    })
    this.getAccountList();
  },
  onShareAppMessage: function () {

  }
})