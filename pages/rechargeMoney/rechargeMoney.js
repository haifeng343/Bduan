const netUtil = require('../../utils/request.js');
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    money: '', //充值金额
    openId: '',
    storeId: '', //门店Id,
    rechargeId: '', //充值的Id
    hideModal: true, //控制按钮显示
  },

  onLoad: function(options) {
    this.setData({
      storeId: options.storeId || ''
    })
  },
  hasInput: function(e) {
    this.setData({
      money: e.detail.value
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
    }, null, false, false, false)
  },
  //提交订单
  submit: function() {
    let that = this;
    var url = 'recharge/order/create';
    var params = {
      StoreId: that.data.storeId,
      Money: that.data.money * 100,
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
          var setTime = setInterval(function() {
            that.isSuccess(function(item) {
              if (item.Data.IsPay == true) {
                clearInterval(setTime);
                wx.showModal({
                  title: '充值成功',
                  content: '恭喜你！您已成功充值￥' + that.data.money,
                  showCancel: false,
                  confirmText: '知道了',
                  confirmColor: '#3CD5D1',
                  success: function() {
                    that.setData({
                      hideModal: true
                    })
                    let pages = getCurrentPages(); //当前页面
                    let prevPage = pages[pages.length - 2]; //上一页面
                    wx.navigateBack({

                    })
                    prevPage.init();
                  },
                })
              }
            });
          }, 2000);
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
    if (that.data.money <= 0) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的金额',
      })
      return false;
    }
    if (that.data.money.length <= 0) {
      wx.showToast({
        icon: 'none',
        title: '充值金额不能为空',
      })
      return false;
    }
    that.setData({
      hideModal: false,
    })
    // if (that.data.hideModal==true){
    //   wx.showToast({
    //     icon:'loading',
    //     title: '正在调起支付...',
    //     duration:200000
    //   })
    // }
    // console.log(e)
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
  onShareAppMessage: function() {

  }
})