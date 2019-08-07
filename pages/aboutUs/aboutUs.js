var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    html: ''
  },
  onLoad(options) {
    this.init();
  },
  init: function () {
    let that = this;
    var url = 'account/page/content';
    var params = {
      Code: 'AboutUs_Seller'
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      that.setData({
        html:res.Data.Content
      })
    });
  },
  onShareAppMessage: function (res) {

  },
})