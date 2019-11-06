var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    storeId: '', //门店Id
    rellId: '', //关系Id
    name: '', //课程名称 
    sheetList: [], //门店课程参与的团单列表
    storeItemList: [], //门店课程列表
    sellerItemList: [], //商户课程列表
    IsAdministrator: '', //是否管理员
    checkedArr: [], //分配课程勾选
    showLog: false, //分配课程弹出框
    sheetId: '', //团单Id
    pageCount: 20,
    page: 1,
    status: '', //团单状态
    Id:'',//自己的Id
  },
  onLoad: function(options) {
    let IsAdministrator = wx.getStorageSync('userInfo').IsAdministrator;
    this.setData({
      IsAdministrator: IsAdministrator,
      rellId: options.rellId || '',
      name: options.name || ''
    })
    wx.setNavigationBarTitle({
      title: '去招生-' + options.name,
    })
    this.init();
  },
  init: function() {
    this.getStoreItemList();
  },
  //获取门店课程列表
  getStoreItemList: function() {
    let that = this;
    var url = 'account/storeitem/sheet/list';
    var params = {
      RelId: that.data.rellId,
      Type: 1,
      PageCount: that.data.pageCount,
      PageIndex: that.data.page
    }
    netUtil.postRequest(url, params, function(res) {
      let arr = res.Data;
      let arr1 = that.data.sheetList;
      if (that.data.page == 1) {
        arr1 = arr
      } else {
        arr1 = arr1.concat(arr);
      }
      that.setData({
        sheetList: arr1
      })
    },null,true,true,true,true);
  },
  onPullDownRefresh: function() {
    this.setData({
      page: 1
    });
    this.init();
  },
  //上拉刷新
  onReachBottom: function() {
    let temp = this.data.page;
    temp++
    this.setData({
      page: temp
    })
    this.init();
  },
  //错误弹窗
  clickEor: function(e) {
    wx.showModal({
      title: '审核失败',
      content: '失败原因' + e.currentTarget.dataset.content,
      showCancel: false,
      cancelText: '知道了',
      success: function() {

      }
    })
  },
  //获取商户课程列表
  getSellerItemList: function() {
    let that = this;
    var url = 'account/storeitem/sheet/list';
    var params = {
      RelId: that.data.rellId,
      Type: 0,
      PageCount: 100,
      PageIndex: 1
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data.length > 0) {
        res.Data.forEach(item => {
          if (item.IsChecked == true) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        that.setData({
          sellerItemList: res.Data,
          checkedArr: res.Data.filter(e => {
            return e.checked == true;
          }).map(e => {
            return e.SheetId;
          }),
          showLog: true
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '暂无可分配招生栏目',
        })
      }
    })
  },
  //错误弹窗
  clickEor: function(e) {
    wx.showModal({
      title: '审核失败',
      content: '失败原因' + e.currentTarget.dataset.content,
      showCancel: false,
      cancelText: '知道了',
      success: function() {

      }
    })
  },
  //编辑
  edit: function(e) {
    console.log(e)
    let that = this;
    that.setData({
      status: e.currentTarget.dataset.status, //团单状态
      Id: e.currentTarget.dataset.myid,//自己的Id
    })
    wx.showActionSheet({
      itemList: that.data.status == 2 ? ['恢复招生'] : ['暂停招生'],
      success: function(e) {
        if (e.tapIndex == 0) {
          if (that.data.status == 1){//暂停招生
            let statu =2;
            that.modify(statu);
          }
          if (that.data.status == 2) {//恢复招生
            let statu = 1;
            that.modify(statu);
          }
        }
      }
    })
  },
  //暂停恢复招生
  modify: function (statu) {
    let that = this;
    var url = 'account/storeitem/sheet/status/modify';
    var params = {
      Id: that.data.Id,
      Status: statu
    }
    netUtil.postRequest(url, params, function (res) {
      wx.showModal({
        title: that.data.status==2?'已恢复招生':'已暂停招生',
        content: '',
        showCancel:false,
        confirmText:'知道了',
        confirmColor:'#29d9d6',
        success:function() {
          that.init();
        }
      })
    })
  },
  //取消分配
  bindCancel: function() {
    this.setData({
      showLog: false
    })
  },
  //分配门店课程
  bindSure: function() {
    let that = this;
    var url = 'account/storeitem/sheet/add';
    var params = {
      RelId: that.data.rellId,
      SheetIdList: that.data.checkedArr
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
  //课程选择
  checkedChange: function(e) {
    this.setData({
      checkedArr: e.detail.value
    })
  },
  //分配课程
  fenpei: function() {
    this.getSellerItemList();
  },
  onShareAppMessage: function() {

  },

})