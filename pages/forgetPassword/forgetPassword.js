var netUtil = require("../../utils/request.js"); //require引入
var utilMd5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    mobile: '',
    code:'',
    InputType: 'password',
    InputType1: 'password',
    eyesImg: '../../img/eyes.png',
    eyeImg: '../../img/eye.png',
    password1:'',//新密码
    password2:'',//确认密码
    btntext:'获取验证码',
    coden:60,//倒计时
    ActionCode:'',//操作码
    sendPhone:'',//发送验证码的手机
    imgCodeShow:false,//验证码弹窗
    IsShow:false,//两部分切换
  },
  onLoad:function() {

  },
  changeEyeImg: function () {
    let t = this.data.InputType == 'password' ? 'text' : 'password';
    this.setData({ InputType: t });
  },
  changeEyeImg1: function () {
    let t = this.data.InputType1 == 'password' ? 'text' : 'password';
    this.setData({ InputType1: t });
  },
  //获取图片验证码
  codeyan: function () {
    let that = this;
    var url = 'account/picverifycode';
    var params = {
      Phone: that.data.mobile,
      CodeType:1,
    }
    netUtil.postRequest(url, params, function (res) {
      console.log(res)
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
  // 点击获取验证码
  codetime() { 
    var _this = this
    var coden = this.data.coden
    var codeV = setInterval(function () {
      _this.setData({
        btntext: '重新获取',
        coden: coden--
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
  getSMSCode: function () {
    //检查图片验证码是否正确
    let that = this;
    var url = 'account/picverifycode/check';
    var params = {
      Phone: that.data.mobile,
      CodeType: 1,
      PicVerifycode: that.data.PicVerifycode
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      console.log(res);
      if (res.ErrorCode == 0) {
        wx.showToast({
          icon: 'none',
          title: "验证码已发送",
        })
        that.setData({
          imgCodeShow: false,
          sendPhone:that.data.mobile
        })
        that.codetime();
        that.sendCode();
      }
    });
  },
  //发送验证码
  sendCode() {
    let that = this;
    var url = 'account/sendverifycode';
    var params = {
      Phone: that.data.mobile,
      CodeType:1,
      PicVerifycode: that.data.PicVerifycode
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      that.setData({
        ActionCode: res.Data
      })
    });
  },
  bindName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhone: function (e) {
    this.setData({
      mobile: e.detail.value,
    })
  },
  bindCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  bindPassword1:function(e){
    this.setData({
      password1:e.detail.value
    })
  },
  bindPassword2: function (e) {
    this.setData({
      password2: e.detail.value
    })
  },
  codeText:function(e){
    this.setData({
      PicVerifycode:e.detail.value
    })
  },
  closeAlert: function () {
    let that = this;
    that.setData({
      imgCodeShow: false,
    })
  },
  //下一步 验证操作码是否正确
  nextBtn:function() {
    let that = this;
    var url = 'account/verifycode/check';
    var params = {
      UserName: that.data.name,
      Phone: that.data.mobile,
      CodeType: 1,
      Verifycode: that.data.code
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      that.setData({
        IsShow:true
      })
    });
  },
  //找回密码
  bindBack:function() {
    let that = this;
    var url = 'account/password/forget';
    if(!that.data.password1==that.data.password2){
      wx.showToast({
        icon:'none',
        title: '密码不一致',
      })
      return;
    }
    var params = {
      UserName: that.data.name,
      Mobile: that.data.mobile,
      ActionCode: that.data.ActionCode,
      Verifycode: that.data.code,
      NewPassword: utilMd5.hexMD5(this.data.password2)
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      wx.showModal({
        title: '成功找回密码',
        content: '',
        showCancel:false,
        cancelColor:'#29d9d6',
        cancelText:'知道了',
        success:function(res){
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      })
    });
  },
  onShareAppMessage: function () {

  }
})