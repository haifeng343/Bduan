var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLog: true,
    IsShow:'',
    Id: '',
    List: [], //我的门店杭虎列表
    accountList: [], //所有门店列表
    checkArr: [],//勾选中的checkbox
  },
  onLoad: function(options) {
    let IsShow = wx.getStorageSync('userInfo').IsAdministrator;
    this.setData({
      Id: options.Id,
      IsShow: IsShow
    })
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
      that.setData({
        List: res.Data,
      })
      // that.data.List.forEach(item=>{
      //   that.data.checkedArr = that.data.checkedArr.concat(item.AccountId)
      //   console.log(that.data.checkedArr)
      // })
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
      that.setData({
        accountList: res.Data,
      })
    })
  },
  //切换
  checkedChange: function(e) {
    this.setData({
      checkArr: e.detail.value
    })
  },
  //取消分配
  bindCancel: function() {
    this.setData({
      showLog: true
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
  fenpei: function() {
    this.setData({
      showLog: !this.data.showLog
    })
    this.getAccountList();
  },
  onShareAppMessage: function() {

  }
})