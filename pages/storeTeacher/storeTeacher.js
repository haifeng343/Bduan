var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLog: true,
    Id: '',
    IsShow:false,
    List: [],//我的门店杭虎列表
    accountList: [],//所有门店列表
    checkedArr: [],
  },
  onLoad: function (options) {
    let IsShow = wx.getStorageSync('userInfo').IsAdministrator;
    this.setData({
      Id: options.Id,
      IsShow: IsShow
    })
    this.init();
  },
  //我的师资列表
  init: function () {
    let that = this;
    var url = 'account/storeteacher/list';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function (res) {
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
      let arr = [];
      for (let v of res.Data) {
        let obj = that.data.List.find(x => {
          return x.Id == v.Id;
        });
        if (obj) {
          arr.push(v.Id);
        } else {
          arr.push(0);
        }
      }
      that.setData({
        accountList: res.Data,
        checkedArr: arr,
      })
    })
  },
  //切换
  checkedChange: function (e) {
    console.log(e)
    this.setData({
      checkedArr: e.detail.value
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
      TeacherId: that.data.checkedArr
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
  onPullDownRefresh:function(){
    this.init();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function () {

  }
})