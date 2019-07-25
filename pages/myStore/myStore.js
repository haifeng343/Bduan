var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    List:[],
    usertoken:'',
  },
  onLoad:function() {
    this.setData({
      usertoken: wx.getStorageSync('userInfo').UserToken || ''
    })
    this.init();
  },
  init:function() {
    if (this.data.usertoken) {
      this.getData();
    }
  },
  getData:function() {
    let that = this;
    var url = 'account/store/list';
    var params = {
      
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      console.log(res)
      that.setData({
        List:res.Data
      })
    })
  },
  bindStoreManag:function(e) {
    if(this.data.usertoken){
      wx.navigateTo({
        url: '/pages/storeManag/storeManag?Id='+e.currentTarget.dataset.id,
      })
    }
  },
  onShareAppMessage: function () {

  }
})