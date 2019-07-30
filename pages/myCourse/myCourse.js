var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    List:[],
    SheetList:'',
  },
  onLoad:function() {
    this.init();
  },
  bindCourseDetail:function(e) {
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  init() {
    this.getData();
  },
  //我的师资列表
  getData: function () {
    let that = this;
    var url = 'account/item/list';
    var params = {
      
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      console.log(res)
      that.setData({
        List: res.Data,
        SheetList: (res.Data[0].SheetList).toString().replace(/,/g, '/')
      })
      console.log(that.data.SheetList)
    })
  },
  onShareAppMessage: function () {

  }
})