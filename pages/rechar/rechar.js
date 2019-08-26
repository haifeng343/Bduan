var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    storeId: '', //门店Id
    name: '', //门店名称
    money: 0, //金额
    price: '', //充值金额
    hideModal: true, //控制按钮显示
  },

  onLoad: function(options) {
    this.setData({
      storeId: options.Id || '',
      nmae: options.name || '',
      money: options.money || 0,
    })
    wx.setNavigationBarTitle({
      title: '充值-' + options.name,
    })
    this.init();
  },
  hasInput: function(e) {
    console.log(e)
    this.setData({
      price: e.detail.value
    })
  },
  init: function() {
    let that = this;
    var url = 'account/store/details';
    var params = {
      Id: that.data.storeId
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        money: res.Data.Money,
      })
    }, null, false, false, false)
  },
  //支付是否成功
  isSuccess: function(onsuccess) {
    let that = this;
    var url = 'recharge/pay/issuccess';
    var params = {
      RechargeId: that.data.rechargeId,
    }
    netUtil.postRequest(url, params, function(res) {
      onsuccess(res);
    }, null, false, false, false)
  },
  //提交订单
  submit: function() {
    let that = this;
    var url = 'recharge/order/create';
    var params = {
      StoreId: that.data.storeId,
      Money: that.data.price * 100,
      OpenId: that.data.openId,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        rechargeId: res.Data.RechargeId,
        hideModal: false,
      });
      wx.requestPayment({
        timeStamp: res.Data.TimeStamp,
        nonceStr: res.Data.NonceStr,
        package: res.Data.Package,
        signType: res.Data.SignType,
        paySign: res.Data.PaySign,
        'success': function(res) {
          that.isSuccess(function(item) {
            if (item.Data.IsPay == true) {
              wx.showModal({
                title: '充值成功',
                content: '您已成功充值 ' + that.data.price + ' 元',
                showCancel: false,
                confirmText: '知道了',
                confirmColor: '#3CD5D1',
                success: function() {
                  that.setData({
                    hideModal: true,
                    price: '',
                  })
                  that.init();
                },
              })
            } else {
              var setTime = setInterval(function () {
                that.isSuccess(function(item) {
                  if (item.Data.IsPay == true) {
                    clearInterval(setTime);
                    wx.showModal({
                      title: '充值成功',
                      content: '您已成功充值 ' + that.data.price + ' 元',
                      showCancel: false,
                      confirmText: '知道了',
                      confirmColor: '#3CD5D1',
                      success: function() {
                        that.setData({
                          hideModal: true,
                          price: '',
                        })
                        that.init();
                      },
                    })
                  }
                });
              }, 2000);
            }
          });
        },
        'fail': function(res) {
          wx.showToast({
            title: '用户取消支付',
            image: '../../img/cancel.png',
          });
          that.setData({
            hideModal: true
          })
        },
      });
    })
  },
  getUserInfo: function(e) {
    let that = this;
    if (that.data.price <= 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的金额',
      })
      return false;
    }
    if (that.data.price.length <= 0) {
      wx.showToast({
        icon: 'none',
        title: '充值金额不能为空',
      })
      return false;
    }
    that.setData({
      hideModal: false,
    })
    // 获取用户信息
    wx.login({
      success: function(res2) {
        if (res2.code) {
          wx.getSetting({
            success(e) {
              if (e.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success(res1) {
                    //微信解密接口
                    var url = 'account/wechatdecrypt';
                    var params = {
                      Code: res2.code,
                      EncryptedData: res1.encryptedData,
                      Iv: res1.iv,
                      RawData: res1.rawData,
                      Signature: res1.signature,
                    }
                    netUtil.postRequest(url, params, function(res3) { //onSuccess成功回调
                      that.setData({
                        openId: res3.Data.openId,
                      })
                      that.submit();
                    })
                  },
                  fail(res1) {
                    console.log("获取用户信息失败", res1)
                  }
                })
              } else {
                console.log("未授权=====")
                // that.showSettingToast("请授权")
              }
            }
          })
        }
      }
    })
  },
  paybtn: function() {
    wx.navigateTo({
      url: '/pages/rechargeMoney/rechargeMoney?storeId=' + this.data.storeId,
    })
  },
  bindRechargeLog: function() {
    wx.navigateTo({
      url: '/pages/rechargeLog/rechargeLog?storeId=' + this.data.storeId,
    })
  },
  bindRefundLog: function() {
    wx.navigateTo({
      url: '/pages/refundLog/refundLog?storeId=' + this.data.storeId,
    })
  },
  bindRefund: function() {
    wx.navigateTo({
      url: '/pages/refund/refund?storeId=' + this.data.storeId + '&price=' + this.data.money,
    })
  },
  onShareAppMessage: function() {

  }
})