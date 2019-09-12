var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLog: false,
    Id: '',
    IsShow: false,
    List: [], //我的门店杭虎列表
    accountList: [], //所有门店列表
    checkedArr: [],
    name:'',
  },
  onLoad: function(options) {
    let IsShow = wx.getStorageSync('userInfo').IsAdministrator;
    this.setData({
      Id: options.Id || '',
      IsShow: IsShow,
      name:options.name || '',
    })
    wx.setNavigationBarTitle({
      title: '门店师资-'+this.data.name,
    })
    this.init();
  },
  //我的师资列表
  init: function() {
    let that = this;
    var url = 'account/storeteacher/list';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        List: res.Data,
      })
    })
  },
  //获取商户账户列表
  getAccountList: function() {
    let that = this;
    var url = 'account/sellerteacher/list';
    var params = {
      PageCount: 100,
      PageIndex: 1,
      Status: 1
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data.length > 0) {
        let arr = [];
        res.Data.forEach(item => {
          let tempArr = that.data.List.filter(e => {
            return e.Id === item.Id;
          });
          if (tempArr.length > 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        that.setData({
          accountList: res.Data,
          checkedArr: res.Data.filter(e => {
            return e.checked == true;
          }).map(e => {
            return e.Id
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
    console.log(e)
    this.setData({
      checkedArr: e.detail.value
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
    var url = 'account/storeteacher/set';
    var params = {
      StoreId: that.data.Id,
      TeacherId: that.data.checkedArr
    }
    netUtil.postRequest(url, params, function(res) {
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