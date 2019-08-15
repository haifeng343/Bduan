var netUtil = require("../../utils/request.js"); //require引入
var utilMd5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    password1: '',
    password2: '',
    Id: '',
  },
  onLoad: function(options) {
    this.setData({
      Id: options.id || ''
    })
  },
  bindpd: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  bindpd1: function(e) {
    this.setData({
      password1: e.detail.value
    })
  },
  bindpd2: function(e) {
    this.setData({
      password2: e.detail.value
    })
  },
  //从账户管理过来
  modify: function() {
    let that = this;
    var url = 'account/selleraccount/password/modify';
    var params = {
      AccountId: that.data.Id,
      Password: utilMd5.hexMD5(that.data.password1),
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      wx.showModal({
        title: '成功修改密码',
        content: '',
        showCancel: false,
        success: function() {
          let pages = getCurrentPages(); //当前页面
          let prevPage = pages[pages.length - 2]; //上一页面
          prevPage.init();
          wx / wx.navigateBack({
            delta: 1,
          })
        }
      })
    });
  },
  submit: function() {
    let that = this;
    //获取图片验证码
    if (that.data.password1.length < 6) {
      wx.showToast({
        icon: 'none',
        title: '密码不能少于6位',
      })
      return;
    }
    if (that.data.password1 != that.data.password2) {
      wx.showToast({
        icon: 'none',
        title: '密码不一致',
      })
      return;
    }
    if (!that.data.Id) {
      var url = 'account/password/modify';
      var params = {
        OldPassword: utilMd5.hexMD5(that.data.password),
        NewPassword: utilMd5.hexMD5(that.data.password1),
      }
      netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
        wx.showModal({
          title: '成功修改密码',
          content: '',
          showCancel: false,
          success: function() {
            let pages = getCurrentPages(); //当前页面
            let prevPage = pages[pages.length - 2]; //上一页面
            prevPage.init();
            wx / wx.navigateBack({
              delta: 1,
            })
          }
        })
      });
    } else {
      that.modify();
    }
  },
  onShareAppMessage: function() {

  }
})