var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    storeId: '', //门店Id
    name: '', //门店名称
    money: 0, //金额
    price: '', //充值金额
    hideModal: true, //控制按钮显示
    status:'',//1门店 2商家
  },

  onLoad: function(options) {
    console.log(options)
    this.setData({
      storeId: options.Id || '',
      name: options.name || '',
      status : options.status || '',
    })
    if (options.status == 2) {
      wx.setNavigationBarTitle({
        title: '充值-商家',
      })
    }
    if (options.status==1) {
      wx.setNavigationBarTitle({
        title: '充值-' + options.name,
      })
    }
  },
  onShow:function() {
    if(this.data.status==2){
    this.init();
    }
    if(this.data.status==1){
      this.detail();
    }
  },
  init:function() {
    let money = wx.getStorageSync('userInfo').SellerAmount;
    this.setData({
      money: Number(money / 100).toFixed(2)
    })
  },
  getAccountInfo:function(){
    let that = this;
    var url = 'account/info';
    var params = {}
    netUtil.postRequest(url, params, function (res) {
      wx.setStorageSync('userInfo', res.Data);
      that.init();
    })
  },
  detail:function() {
    let that = this;
    var url = 'account/store/details';
    var params = {
      Id: that.data.storeId,
    }
    netUtil.postRequest(url, params, function (res) {
      that.setData({
        money: Number(res.Data.Money/100).toFixed(2)
      })
    }, null, false, false, false)
  },
  hasInput: function(e) {
    console.log(e)
    this.setData({
      price: e.detail.value
    })
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
    }, function(err) {
      that.loading = false;
    }, false, false, false)
  },
  //提交订单
  submit: function() {
    let that = this;
    if (this.loading) return;
    this.loading = true;
    var url = 'recharge/order/create';
    var params = {
      StoreType:that.data.status,
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
              that.loading = false;
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
                  if (that.data.status == 1) {
                    that.detail();
                  }
                  if (that.data.status == 2) {
                    that.getAccountInfo();
                  }
                },
              })
            } else {
              var setTime = setInterval(function() {
                that.isSuccess(function(item) {
                  if (item.Data.IsPay == true) {
                    that.loading = false;
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
                        if (that.data.status == 1){
                          that.detail();
                        }
                        if(that.data.status==2){
                          that.getAccountInfo();
                        }
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
          that.loading = false;
          that.setData({
            hideModal: true
          })
        },
      });
    }, function(err) {
      that.loading = false;
    })
  },
  getUserInfo: function(e) {
    let that = this;
    if (that.data.price <= 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入有效的充值金额',
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
      url: '/pages/rechargeLog/rechargeLog?storeId=' + this.data.storeId+'&status='+this.data.status+'&name='+this.data.name,
    })
  },
  bindRefundLog: function() {
    wx.navigateTo({
      url: '/pages/refundLog/refundLog?storeId=' + this.data.storeId + '&status=' + this.data.status + '&name=' + this.data.name,
    })
  },
  bindRefund: function() {
    wx.navigateTo({
      url: '/pages/refund/refund?storeId=' + this.data.storeId + '&price=' + this.data.money + '&status=' + this.data.status + '&name=' + this.data.name,
    })
  },
  onShareAppMessage: function() {

  }
})