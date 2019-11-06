var netUtil = require("../../utils/request.js"); //require引入
Page({


  data: {
    Id:"",//Id，
    page:1,
    pageCount:5,
    teacherList:[],
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      Id: options.Id
    })
    that.getData();
  },
  getData: function () {
    var that = this;
    //获取项目全部师资信息
    var url = 'account/item/teachers';
    var params = {
      Id: that.data.Id,
      PageCount:that.data.pageCount,
      PageIndex:that.data.page,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      let arr = res.Data;
      let arr1 = that.data.teacherList;
      if(that.data.page ==1){
        arr1 = arr
      } else{
        arr1 = arr1.concat(arr);
      }
      that.setData({
        teacherList: arr1
      })
    }, null, true, true, true, true);
  },
  onPullDownRefresh:function() {
    this.setData({
      page: 1
    });
    this.getData();
  },

  onReachBottom: function () {
    let temp = this.data.page;
    temp++
    this.setData({
      page: temp
    })
    this.getData();
  },
  onShareAppMessage: function () {

  }
})