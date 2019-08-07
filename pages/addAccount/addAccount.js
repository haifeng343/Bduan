var netUtil = require("../../utils/request.js"); //require引入
const baseUrl = "https://test.guditech.com/rocketseller/";
var utilMd5 = require('../../utils/md5.js');
Page({

  data: {
    Id: '',
    item: {},//页面数据
    name: '',//账户名
    mobile: '',//手机号
    password: '',//密码
    password1: '',//再次输入密码
    headerImg: '',//头像
    items:[
      {id:1,value:'普通账户',checked:true},
      // {id:2,value:'管理员'},
    ],
    IsAdministrator: '',//是否为管理员
    headerImgPath: '',//上传头像地址
  },
  onLoad: function (options) {
    this.setData({
      Id: options.id || '',
    })
    this.init();
  },
  init: function () {
    if (this.data.Id) {
      this.getData();
      wx.setNavigationBarTitle({
        title: '编辑账户',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '创建账户',
      })
    }
  },
  getData: function () {
    let that = this;
    var url = 'account/selleraccount/details';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        item: res.Data,
        name: res.Data.UserName,
        mobile: res.Data.Mobile,
        IsAdministrator: res.Data.IsAdministrator,
        headerImg: res.Data.HeadUrl,
      })
    });
  },
  //绑定姓名
  bindName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //上传图片
  bindUpload: function (e) {
    let that = this;
    wx.chooseImage({
      success(res) {
        let usertoken = wx.getStorageSync('userInfo').UserToken;
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: baseUrl + 'img/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'Admin.Header',
          header: {
            "Content-Type": "multipart/form-data", //记得设置
            'channelCode': 'wechat',
            'appVersion': '1.0.1',
            "userToken": usertoken,
          },
          success: (res) => {
            var ttt = JSON.parse(res.data);
            that.setData({
              headerImgPath: ttt.Data.ImgPath,
              headerImg: ttt.Data.ImgUrl,
            })
          },
          fail: (res) => {
            wx.showToast({
              icon: 'none',
              title: res.data.ErrorMessage,
            })
          },
        })
      }
    })
  },
  //单选框切换
  changeRadio: function (e) {
    console.log(e)
  },
  //输入密码
  bindPassword: function (e) {
    this.setData({
      password:e.detail.value
    })
  },
  //确认密码
  bindPassword1: function (e) {
    this.setData({
      password1:e.detail.value
    })
  },
  //绑定手机号
  bindMobile:function(e) {
    this.setData({
      mobile:e.detail.value
    })
  },
  //编辑账户
  edit: function () {
    let that = this;
    var url = 'account/selleraccount/modify';
    var params = {
      AccountId: that.data.Id,
      Head: that.data.headerImgPath,
      UserName: that.data.name,
      Password: utilMd5.hexMD5(that.data.password),
      Mobile: that.data.mobile,
    }
    netUtil.postRequest(url, params, function (res) {
      console.log(res)
    });
  },
  //添加账户
  add: function () {
    let that = this;
    var url = 'account/selleraccount/add';
    if (that.data.name){
      wx.showToast({
        icon:'none',
        title: '请输入用户名',
      })
      return ;
    }
    if (that.data.mobile){
      wx.showToast({
        icon:'none',
        title: '请输入手机号',
      })
      return;
    }
    if (that.data.password){
      wx.showToast({
        icon:'none',
        title: '请输入密码',
      })
      return;
    }
    if (that.data.password1){
      wx.showToast({
        icon:'none',
        title: '请再次输入密码',
      })
      return;
    }
    if (that.data.password != that.data.password1) {
      wx.showToast({
        icon: 'none',
        title: '密码不一致请重试',
      })
      return;
    }
    var params = {
      AccountId: that.data.Id,
      Head: that.data.headerImgPath,
      UserName: that.data.name,
      Password: utilMd5.hexMD5(that.data.password),
      Mobile: that.data.mobile,
    }
    netUtil.postRequest(url, params, function (res) {
   
    });
  },

  //提交
  submit: function () {
    if (this.data.Id) {
      this.edit();
    } else {
      this.add();
    }
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面
    prevPage.init();
    wx/wx.navigateBack({
      delta: 1,
    })
    wx.showToast({
      icon: 'none',
      title: this.data.Id ? '编辑成功' : '创建成功',
    })
  },
  onShareAppMessage: function () {

  }
})