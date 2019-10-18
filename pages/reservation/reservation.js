var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    storeId: '', //门店Id
    name: '', //门店名称
    check: true, //是否开启预约
    List: [], //列表数据
  },
  onLoad: function(options) {
    this.setData({
      name: options.name || "",
      storeId: options.Id || "",
    })
    wx.setNavigationBarTitle({
      title: '预约管理-' + this.data.name,
    })
    this.init();
  },
  init: function() {
    let that = this;
    var url = 'account/storeappointment/list';
    var params = {
      Id: that.data.storeId,
    }
    netUtil.postRequest(url, params, function(res) {
      let arr = res.Data;
      let arr1 = that.data.List;
      if (that.data.page == 1) {
        arr1 = arr
      } else {
        arr1 = that.data.List;
        arr1 = arr1.concat(res.Data)
      }
      that.setData({
        List: arr1,
      })
    })
  },
  swichChange: function(e) {
    console.log(e);
    let Id = e.currentTarget.dataset.id;
    this.setData({
      check: e.detail.value
    })
    this.modify(Id, this.data.check);
  },
  //是否开启预约
  modify: function(Id, check) {
    let that = this;
    var url = 'account/storeappointment/status/modify';
    var params = {
      Id: Id,
      IsAppointment: check
    }
    netUtil.postRequest(url, params, function(res) {
      if (check == true) {
        wx.showToast({
          icon: "none",
          title: '成功开启预约',
        })
      } else {
        wx.showToast({
          icon: "none",
          title: '成功关闭预约',
        })
      }
    })
  },
  navtoExtra: function(e) {
    wx.navigateTo({
      url: '/pages/extraInfomation/extraInfomation?storeId=' + this.data.storeId + '&itemId=' + e.currentTarget.dataset.itemid + '&name=' + e.currentTarget.dataset.name,
    })
  },
  navtoForm: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/reservationForm/reservationForm?storeId=' + this.data.storeId + '&itemId=' + e.currentTarget.dataset.itemid + '&name=' + e.currentTarget.dataset.name,
    })
  },
  onShareAppMessage: function() {

  }
})