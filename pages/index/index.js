const app = getApp();
const netUtil = require('../../utils/request.js');
Page({
  data: {
    date1: '', //开始时间
    date2: '', //结束时间 
    showSuccess: false, //扫码成功
    showLog: true, //输码弹窗
    code: '', //券码
    showSure: true, //确认订单信息
    showSuccessd: false, //验券成功
    showSelect: false, //门店选择
    showId: 1,
    navTabs: [{
        id: 1,
        name: '今天'
      },
      {
        id: 2,
        name: '昨天'
      },
      {
        id: 3,
        name: '最近7天'
      },
      {
        id: 4,
        name: '最近1月'
      },
      {
        id: 5,
        name: '自定义'
      },
    ],
    storeList: [], //门店列表
    showStoreId: 0, //默认选择门店
    QuanInfo: {}, //订单信息
    activeList: [], //正在参与的活动
    checked: false,
    checkList: [], //勾选的数组
    groupList: [], //活动组列表
    orderList: [], //订单列表
    storeId: '0', //门店Id
    storeName: '全部门店', //门店名称
    arrivalCount: '', //到店数
    buyCount: '', //购买数
    usertoken: '',
    count: "", //获取未处理预约数量
    num: '', //输入密码,
  },
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      usertoken: userInfo.UserToken || ''
    })
    this.init();
  },
  // 禁止屏幕滚动
  preventTouchMove: function() {

  },
  hideFixed: function() {
    this.setData({
      showSelect: false,
    })
  },
  //获取支付密码
  hasPassword: function(e) {
    console.log(e);
    this.setData({
      num: e.detail.value
    })
  },
  init: function() {
    this.getStore();
    this.getGroupList();
    this.getOrderList();
    this.getOperating();
    this._getCount();
  },
  //获取所有门店列表
  getStore: function() {
    let that = this;
    var url = 'account/store/list';
    var params = {}
    netUtil.postRequest(url, params, function(res) {
      let arr = res.Data;
      arr.unshift({
        StoreId: 0,
        StoreName: "全部门店"
      })
      that.setData({
        storeList: arr
      })
    })
  },
  //获取未处理预约数量
  _getCount: function() {
    let that = this;
    var url = 'appointment/count';
    var params = {}
    netUtil.postRequest(url, params, function(res) {
      if (res.Data) {
        that.setData({
          count: res.Data.AppointmentCount
        })
      }
    })
  },

  //更换门店
  changeStore: function(e) {
    this.setData({
      showStoreId: e.currentTarget.dataset.id,
      storeId: e.currentTarget.dataset.id,
      storeName: e.currentTarget.dataset.name,
      showSelect: false
    })
    this.getOperating();
  },
  //点击全部门店
  allStore: function() {
    this.setData({
      storeId: 0,
      storeName: '全部门店',
      showSelect: false
    })
    this.getOperating();
  },
  //获取经营统计数据
  getOperating: function() {
    let that = this;
    var url = 'account/operating/statistics';
    var params = {
      Type: that.data.showId,
      StartTime: that.data.date1,
      EndTime: that.data.date2,
      StoreId: that.data.storeId
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        buyCount: res.Data.BuyCount,
        arrivalCount: res.Data.ArrivalCount,
        date1: res.Data.StartTime,
        date2: res.Data.EndTime,
      })
    })
  },
  //正在参与的活动
  getGroupList: function() {
    let that = this;
    var url = 'account/activitygroup/list';
    var params = {
      Type: 2,
      PageCount: 5,
      PageIndex: 1,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        activeList: res.Data,
      })
    })
  },
  //订单列表
  getOrderList: function() {
    let that = this;
    var url = 'order/list';
    var params = {
      OrderSn: '',
      BuyAccountName: '',
      SheetId: '',
      PageCount: 5,
      PageIndex: 1,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        orderList: res.Data,
      })
    })
  },

  //验证记录
  navtoVercation: function() {
    wx.navigateTo({
      url: '/pages/yanzheng/yanzheng',
    })
  },
  //预约记录
  navtoVercation: function() {
    wx.navigateTo({
      url: '/pages/yanzheng/yanzheng',
    })
  },
  //点击切换选中样式
  changeShowId: function(e) {
    this.setData({
      showId: e.currentTarget.dataset.id,
      date1: '',
      date2: '',
    })
    this.getOperating();
  },
  //弹窗隐藏
  toggleDialog: function() {
    this.setData({
      showSuccess: !this.data.showSuccess
    })
  },

  //输入扫码
  bindInputCode: function() {
    this.setData({
      showLog: false,
      code:'',
    })
  },
  //扫描二维码
  clickSaoma: function() {
    let that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        that.setData({
          code: res.result
        });
        that.getCode();
      }
    })
  },
  //获取到二维码确定
  getCode: function() {
    let that = this;
    if (that.data.code.indexOf('R') == 0) {
      that.bindOrderCode(that.data.code);
    } else if (that.data.code.indexOf('T') == 0 || that.data.code.indexOf('SB') == 0) {
      that._getCheckInfo(function(res) {
        //代金券
        if (res.Data.CardType == 3) {
          wx.navigateTo({
            url: '/pages/yancode/yancode?Info=' + JSON.stringify(res.Data),
          })
        } else{
          if (that.selectComponent('#pop')) {
            that.selectComponent('#pop')._showClassDialog(res.Data.TempResult);
          }
        }
      });
    }else {
      wx.showToast({
        icon: 'none',
        title: '券码有误',
      })
    }
    that.setData({
      showLog: true
    })
  },
  //获取代金券验券详情
  _getCheckInfo: function(onSuccess) {
    let that = this;
    var url = 'account/ticket/check/info';
    var params = {
      TicketNumber: that.data.code,
    }
    netUtil.postRequest(url, params, function(res) {
      onSuccess(res);
    })
  },
  //输入订单号搜索
  bindOrderCode: function(code) {
    let that = this;
    var url = 'order/info/ticketnumber';
    var params = {
      TicketNumber: code,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        QuanInfo: res.Data,
        showSure: false,
        showLog: true,
      })
    })
  },
  //勾选
  checkdChange: function(e) {
    let arrs = []
    this.setData({
      checkList: e.detail.value
    })
  },
  //关闭订单验券弹窗
  closeCodeLog: function() {
    this.setData({
      showLog: true,
      code: '',
    })
  },
  //关闭确认订单信息弹出框
  closeCodeSure: function() {
    this.setData({
      showSure: !this.data.showSure
    })
  },
  //发送订单信息确定
  submitSure: function() {
    let that = this;
    var url = 'account/order/check';
    var params = {
      TicketNumber: that.data.code,
      RelId: this.data.checkList[0]
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        showSure: true,
        code: '',
        checkList: [],
      })
      wx.showModal({
        title: '验券成功',
        cancelColor: '#29d9d6',
        showCancel: false,
        cancelText: '知道了',
        success: function() {

        }
      })
    })
  },
  //关闭成功弹窗
  closeds: function() {
    this.setData({
      showSuccessd: !this.data.showSuccessd
    })
  },
  //设置券码
  setCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //开始时间
  bindDateChange1: function(e) {
    this.setData({
      date1: e.detail.value
    })
    if (this.data.date1 && this.data.date2) {
      this.getOperating();
    }
  },
  //结束时间 
  bindDateChange2: function(e) {
    this.setData({
      date2: e.detail.value
    })
    if (this.data.date1 && this.data.date2) {
      this.getOperating();
    }
  },
  //弹出门店下拉选择
  changeSelect: function() {
    this.setData({
      showSelect: true
    })
  },

  //获取用户信息
  // getData:function() {
  //   let that = this;
  //   var url = 'account/info';
  //   var params = {
  //   }
  //   netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
  //       console.log(res)

  //   })
  // },
  binddetail: function(e) {
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  bindGroup: function() {
    wx.navigateTo({
      url: '/pages/myGroup/myGroup?type=1',
    })
  },
  bindNavtoOrder: function() {
    wx.switchTab({
      url: '/pages/order/order',
    })
  },
  bindOrderDetail: function(e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  reservation: function() {
    wx.navigateTo({
      url: '/pages/reservationList/reservationList',
    })
  },
  onPullDownRefresh: function() {
    this.init();
    wx.stopPullDownRefresh();
  }
})