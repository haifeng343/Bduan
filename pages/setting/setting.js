
Page({

  data: {
    name:'修改手机号',
    mobile:'',
  },
  onLoad: function (options) {
    let Mobile = wx.getStorageSync('userInfo').Mobile
    if (Mobile) {
      this.setData({
        mobile: Mobile,
        name:'修改手机号'
      })
    }else{
      this.setData({
        mobile: '',
        name: '绑定手机号'
      })
    }
  },
  modifyPhone:function(){
    wx.navigateTo({
      url: '/pages/modifyPhone/modifyPhone?mobile='+this.data.mobile,
    })
  },
  modifyPassword:function() {
    wx.navigateTo({
      url: '/pages/modifyPassword/modifyPassword',
    })
  },
  //清空本地缓存退出登录
  clearStore:function() {
    wx.clearStorageSync('userInfo');
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },
  onShareAppMessage: function () {

  }
})