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
    showId:1,
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
    QuanInfo: {}, //订单信息
    checked: false,
    checkList: [], //勾选的数组
    groupList:[],
  },
  onLoad: function (options) {
  },
  //正在参与的活动
  getGroupList:function() {
    let that = this;
    var url = 'account/activitygroup/list';
    var params = {
      Type: 2,
      PageCount:5,
      PageIndex:1,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调

      that.setData({
        QuanInfo: res.Data,
        showSure: true,
        showLog: false,
      })
    })
  },
  navtoVercation: function () {
    wx.navigateTo({
      url: '/pages/vercationLog/vercationLog',
    })
  },
  //点击切换选中样式
  changeShowId:function(e) {
    this.setData({
      showId : e.currentTarget.dataset.id
    })
  },
  //弹窗隐藏
  toggleDialog: function () {
    this.setData({
      showSuccess: !this.data.showSuccess
    })
  },
  //输入扫码
  bindInputCode: function () {
    this.setData({
      showLog: !this.data.showLog
    })
  },
  getCode:function() {
    this.bindOrderCode(this.data.code);
  },
  //输入订单号搜索
  bindOrderCode: function (code) {
    let that = this;
    var url = 'order/info/ticketnumber';
    var params = {
      TicketNumber: code,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      that.setData({
        QuanInfo: res.Data,
        showSure: false,
        showLog: true,
      })
    })
  },
  //勾选
  checkdChange: function (e) {
    let arrs = []
    this.setData({
      checkList: e.detail.value
    })

    console.log(this.data.checkList)
  },
  //关闭订单验券弹窗
  closeCodeLog: function () {
    this.setData({
      showLog: !this.data.showLog,
      code: '',
    })
  },
  //关闭确认订单信息弹出框
  closeCodeSure: function () {
    this.setData({
      showSure: !this.data.showSure
    })
  },
  //发送订单信息确定
  submitSure: function () {
    let that = this;
    var url = 'account/order/check';
    var params = {
      TicketNumber: that.data.code,
      RelId: this.data.checkList[0]
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      that.setData({
        showSure: true,
        code:'',
      })
      wx.showModal({
        title: '验券成功',
        cancelColor:'#29d9d6',
        showCancel:false,
        cancelText:'知道了',
        success:function() {

        }
      })
    })
  },
  //关闭成功弹窗
  closeds: function () {
    this.setData({
      showSuccessd: !this.data.showSuccessd
    })
  },
  //设置券码
  setCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  //开始时间
  bindDateChange1: function (e) {
    this.setData({
      date1: e.detail.value
    })
    if (this.data.date1 && this.data.date2){

    }
  },
  //结束时间 
  bindDateChange2: function (e) {
    this.setData({
      date2: e.detail.value
    })
    if (this.data.date1 && this.data.date2) {
      
    }
  },
  //弹出门店下拉选择
  changeSelect: function () {
    this.setData({
      showSelect: !this.data.showSelect
    })
  },
  //扫描二维码
  clickSaoma: function () {
    let that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        console.log(res)
        that.setData({
          code: res.result
        });
        that.bindOrderCode(res.result);

      }
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
  binddetail: function () {
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail',
    })
  },
  bindGroup: function () {
    wx.navigateTo({
      url: '/pages/myGroup/myGroup',
    })
  },
  bindNavtoOrder: function () {
    wx.switchTab({
      url: '/pages/order/order',
    })
  },
  bindOrderDetail: function () {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail',
    })
  },
})