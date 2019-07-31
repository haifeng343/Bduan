var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PicUrl: '',
    Mobile: '',
    ids: '',
    isShow: false,
    imgCodeShow: false,
    NumberCountDown: 0,
    Remark: '',
    imgUrl: '',
    VerifyCode: '', //发送验证码
    PicVerifycode: '', //验证码
    btntext: '获取验证码',
    notEdit: false,
    ActionCode: '', //操作码
  },
  onLoad: function(options) {
    if (options.mobile) {
      wx.setNavigationBarTitle({
        title: '修改手机号',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '绑定手机号',
      })
    }
  },
  clear: function() {
    this.setData({
      Mobile: ''
    })
  },
  getCode: function(e) {
    this.setData({
      Mobile: e.detail.value
    })
  },
  init: function() {

  },
  codeyan: function() {
    let that = this;

    //获取图片验证码
    var url = 'account/picverifycode';
    var params = {
      Phone: that.data.Mobile,
      CodeType: that.data.Mobile?2:1,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      if (res.ErrorCode == 0) {
        that.setData({
          PicUrl: res.Data.replace(/\\/, '/')
        })
        that.setData({
          imgCodeShow: true,
        })
      }
    }); //调用get方法情就是户数
  },
  //图片验证码 
  codeText: function(e) {
    let that = this;
    var val = e.detail.value;
    that.setData({
      PicVerifycode: val,

    })
  },
  //获取验证码
  cendCode: function(e) {
    let that = this;
    var val = e.detail.value;
    that.setData({
      VerifyCode: val
    })
  },

  codetime() { // 点击获取验证码

    var _this = this
    var coden = 60
    var codeV = setInterval(function() {
      _this.setData({
        btntext: '重新获取' + (--coden) + 's'
      })
      if (coden >= 0) {
        _this.setData({
          notEdit: true
        })
      } else {
        _this.setData({
          notEdit: false
        })
      }
      if (coden == -1) { // 清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
        clearInterval(codeV)
        _this.setData({
          btntext: '获取验证码'
        })
      }
    }, 1000) //  1000是1秒
  },
  //发送验证码
  sendCode() {
    let that = this;
    var url = 'account/sendverifycode';
    var params = {
      Phone: that.data.Mobile,
      CodeType: that.data.Mobile?2:1,
      PicVerifycode: that.data.PicVerifycode
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      that.setData({
        ActionCode: res.Data
      })
    });
  },
  getSMSCode: function() {
    //检查图片验证码是否正确
    let that = this;
    var url = 'account/picverifycode/check';
    var params = {
      Phone: that.data.Mobile,
      CodeType: that.data.Mobile ? 2 : 1,
      PicVerifycode: that.data.PicVerifycode
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      console.log(res);
      if (res.ErrorCode == 0) {
        wx.showToast({
          icon: 'none',
          title: "验证码已发送",
        })
        that.setData({
          imgCodeShow: false,
        })
        that.codetime();
        that.sendCode();
      }
    });
  },
  //绑定
  SMSVerifyCodeLogin: function() {
    let that = this;
    var url = 'account/phone/bind';
    var params = {
      Phone: that.data.Mobile,
      VerifyCode: that.data.VerifyCode,
      ActionCode: that.data.ActionCode
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      wx.showModal({
        title: that.data.Mobile ? "成功修改手机号" : "成功绑定手机号",
        content: '',
        showCancel: false,
        success: function(res) {
          let pages = getCurrentPages(); //当前页面
          let prevPage = pages[pages.length - 2]; //上一页面
          prevPage.setData({
            mobile: that.data.Mobile,
          })
          let userInfo = wx.getStorageSync('userInfo');
          userInfo.Mobile = that.data.Mobile;
          wx.setStorageSync('userInfo', userInfo);
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }); //调用get方法情就是户数
  },
  closeAlert: function() {
    let that = this;
    that.setData({
      imgCodeShow: false,
    })
  },
  closed: function() {
    let that = this;
    that.setData({
      isShow: false,
    })
  },
  onShareAppMessage: function() {

  }
})