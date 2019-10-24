const netUtil = require('../../utils/request.js');
const app = getApp();
Page({

  data: {
    showStore: false, //门店列表是否显示
    Info: {}, //券码信息
    storeList: [],
    checkStore: {}, //选中的门店
    index:0,//选中数据
    Amount:0,//面值
    selectPicker:'请选择门店',
  },
  showClick: function() {
    this.setData({
      showStore: !this.data.showStore
    })
  },
  onLoad: function(options) {
    let that = this;
    console.log(options)
    console.log(JSON.parse(options.Info))
    let tempInfo = JSON.parse(options.Info);
    that.setData({
      Info: tempInfo|| {},
      Amount: Number(tempInfo.Amount *1.0 / 100).toFixed(2),
    })
    that.getStore();
  },
  //获取所有门店列表
  getStore: function() {
    let that = this;
    var url = 'account/store/list';
    var params = {}
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        storeList: res.Data,
        checkStore: res.Data.length == 1 ? res.Data[0] : {},
      })
    })
  },
  bindPickerChange:function(e) {
    console.log(e);
    let that = this;
    let index = e.detail.value;
    let arr = that.data.storeList;
    that.setData({
      checkStore: {
        StoreId: that.data.storeList[index].StoreId,
        StoreName: that.data.storeList[index].StoreName,
      },
      selectPicker: that.data.storeList[index].StoreName,
    })
    console.log(that.data.checkStore)
  },
  //确定提交 订单/代金券验券
  sure: function() {
    let that = this;
    if (!that.data.checkStore.StoreId) {
      wx.showToast({
        icon: "none",
        title: '请选择门店',
      })
      return;
    }
    var url = 'account/order/check';
    var params = {
      TicketNumber: that.data.Info.CardQrCode,
      RelId: that.data.checkStore.StoreId,
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showModal({
        title: '您已成功验券',
        showCancel: false,
        confirmText: "确定",
        success: function(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    })
  },
  changeCheck: function(e) {
    let StoreId = e.detail.value;
    this.setData({
      checkStore: {
        StoreId: StoreId,
        StoreName: '',
      }
    })
  },
  onShareAppMessage: function() {

  }
})