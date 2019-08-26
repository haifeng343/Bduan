var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLog: false, //弹窗是否显示
    IsShow: false,
    Id: '',
    List: [], //我的门店杭虎列表
    accountList: [], //所有门店列表
    checkArr: [], //勾选中的checkbox
    AdminPower: '', //0 普通账户 1 管理员 2 超级管理员
  },
  onLoad: function(options) {
    let IsShow = wx.getStorageSync('userInfo').IsAdministrator;
    let AdminPower = wx.getStorageSync('userInfo').AdminPower
    this.setData({
      Id: options.Id,
      AdminPower: AdminPower,
      IsShow: IsShow
    })
    this.init();
  },
  hideFixed: function() {
    this.setData({
      showLog: false
    })
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
    })
  },
  //获取商户账户列表
  getAccountList: function() {
    let that = this;
    var url = 'account/selleraccount/list';
    var params = {
      Status:1,
      PageCount: 100,
      PageIndex: 1
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data.length > 0) {
        let arr = [];
        res.Data.forEach(item => {
          let tempArr = that.data.List.filter(e => {
            return e.AccountId === item.AccountId;
          });
          if (tempArr.length > 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        that.setData({
          accountList: res.Data,
          checkArr: res.Data.filter(e => {
            return e.checked == true;
          }).map(e => {
            return e.AccountId
          }),
          showLog: true
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '暂无可分配师资',
        })
      }
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
      showLog: false
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
        showLog: false
      })
      wx.showToast({
        icon: 'none',
        title: '已分配完成',
      })
      that.init();
    })
  },
  fenpei: function() {
    this.getAccountList();
  },
  onPullDownRefresh: function() {
    this.init();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function() {

  }
})