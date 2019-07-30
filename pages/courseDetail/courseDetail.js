var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    Id:'',//sellid
    List:{},
    autoplay: true, //是否自动播放
    indicatorDots: false, //指示点
    circular: true,
    interval: 5000, //图片切换间隔时间
    duration: 500, //每个图片滑动速度,
    current: 0, //初始化时第一个显示的图片 下标值（从0）index
  }, 
  onLoad:function(options) {
    console.log(options)
    let that = this;
    that.setData({
      Id : options.id
    })
    that.getData();
  },
  callPhone:function() {
    let that = this;
    // wx.makePhoneCall({
    //   phoneNumber: that.data.mobile,
    // })
  },
  getData:function(){
    var that = this;
    var url = 'account/item/details';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调、
      that.setData({
        List : res.Data,
      })
    }, function (msg) { //onFailed失败回调
      wx.hideLoading();
      if (msg) {
        wx.showToast({
          title: msg,
        })
      }
    }); //调用get方法情就是户数
  },
  swiperChange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  allTeacher:function(e) {
    wx.navigateTo({
      url: '/pages/allTeacher/allTeacher?Id='+e.currentTarget.dataset.id,
    })
  },
  onShareAppMessage: function() {

  }
})