var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    Id:'',
    items:[],
    IsAdministrator:'',
  },
  onLoad:function(){
    let IsAdministrator = wx.getStorageSync('userInfo').IsAdministrator;
    this.setData({
      IsAdministrator: IsAdministrator
    })
    this.init();
  },
  init: function () {
    let that = this;
    var url = 'account/selleraccount/list';
    var params = {
    }
    netUtil.postRequest(url, params, function (res) {
      console.log(res);
      that.setData({
        items: res.Data
      })
    });
  },
  //编辑
  edit: function (e) {
    let that = this;
    this.setData({
      Id : e.currentTarget.dataset.id
    })
    wx.showActionSheet({
      itemList: ['编辑'],
      success: function (e) {
        if (e.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/addAccount/addAccount?id='+that.data.Id,
          })
        }
        // if (e.tapIndex == 1) {
        //   var url = 'user/address/delete';
        //   var params = {
        //     Id: item.id
        //   }
        //   netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
        //     wx.showToast({
        //       icon: "none",
        //       title: '删除成功',
        //     });
        //     that.init();
        //   });
        // }
      }
    })
  },
  bindAddAccount:function() {
    wx.navigateTo({
      url: '/pages/addAccount/addAccount',
    })
  },
  onPullDownRefresh:function() {
    this.init();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function () {

  },

})