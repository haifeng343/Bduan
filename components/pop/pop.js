// components/pop/pop.js
const netUtil = require('../../utils/request.js');
var utilMd5 = require('../../utils/md5.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showSureClass: false, //提交课程信息
    showClass: false, //等待确认课程成交
    showPassword: false, //输入支付密码
    showPay: false, //支付
    showPaySuccess: false, //支付成功

    storeList: [], //门店列表
    classList: [], //课程列表
    storeIndex: 0, //默认选中的门店
    selectPicker: {}, //选中的门店
    itemIndex: 0, //默认选中的课程
    selectClass: {}, //选中的课程
    price: "", //原价
    payAmount: "", //实付金额

    sureClassRecordId: "", //确认课程记录Id
    qrCode: '', //确认课程券码

    waitClassRecordId: "", //等待支付记录Id

    gotoPayRecordId: "", //去支付记录Id
    gotoPayAmount: "", //去支付金额
    gotoPayClassName: '', //去支付的课程名称
    gotoPayCanalAmount: "", //需支付取到金额

    num: '', //支付密码
    true:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //等待家张确认课程  showSureClass
    closeClassClick: function() {
      this.setData({
        showSureClass: false,
      })
    },
    sureClassClick: function() {
      let that = this;
      that._basesubsidyConfirm(function(res) {
        if (res.Status == 1) {
          that.waitClass(res);
        } else if (res.Status == 3) {
          that.gotoPay(res);
        }
        that.setData({
          showSureClass: false
        })
      });
    },
    // 补贴宝确认课程信息
    _basesubsidyConfirm: function(onSuccess) {
      let that = this;
      var url = 'account/basesubsidy/confirm';
      if (!that.data.selectPicker) {
        wx.showToast({
          icon: 'none',
          title: '请选择门店',
        })
        return
      }
      if (!that.data.selectClass) {
        wx.showToast({
          icon: 'none',
          title: '请选择课程',
        })
        return
      }
      if (!that.data.price) {
        wx.showToast({
          icon: 'none',
          title: '请输入课程原价',
        })
        return
      }
      if (!that.data.payAmount) {
        wx.showToast({
          icon: 'none',
          title: '请输入实付价格',
        })
        return
      }
      var params = {
        QrCode: that.data.qrCode,
        RecordId: that.data.sureClassRecordId,
        StoreId: that.data.selectPicker.StoreId,
        ItemId: that.data.selectClass.ItemId,
        Price: that.data.price * 100,
        PayAmount: that.data.payAmount*100,
      }
      netUtil.postRequest(url, params, function(res) {
        if (onSuccess) {
          onSuccess(res.Data);
        }
      })
    },
    //获取课程原价
    bindChangePrice: function(e) {
      this.setData({
        price: e.detail.value
      })
    },

    //获取课程原价
    bindChangeAmount: function(e) {
      this.setData({
        payAmount: e.detail.value
      })
    },

    //等待确认课程成交  showClass
    closeWaitClass: function() {
      this.setData({
        showClass: false,
      })
    },
    sureWaitClass: function() {
      let that = this;
      that._basesubsidyDealConfirm(function(res) {
        if (res.Status == 0) {
          that.sureClass(res);
        } else if (res.Status == 3) {
          that.gotoPay(res);
        }
        that.setData({
          showClass: false,
        })
      });
    },
    // 补贴宝确认成交信息
    _basesubsidyDealConfirm: function(onSuccess) {
      let that = this;
      var url = 'account/basesubsidy/deal/confirm';
      var params = {
        Id: that.data.waitClassRecordId,
      }
      netUtil.postRequest(url, params, function(res) {
        if (onSuccess) {
          onSuccess(res.Data)
        }
      })
    },

    // 是否支付 showPay
    payEor: function() {
      this.setData({
        showPay: false
      })
    },
    payOK: function() {
      this.setData({
        showPay: false,
        showPassword: true,
        num: '',
      })
    },
    // 关闭支付页面
    closePayDialog: function() {
      this.setData({
        showPassword: false
      })
      wx.showToast({
        icon: "none",
        title: '支付已取消',
      })
    },
    // 支付成功课程成交 showPaySuccess
    payOkEor: function() {
      this.setData({
        showPaySuccess: false
      })
    },
    payOkRes: function() {

    },

    //获取支付密码
    hasPassword: function(e) { //等于六位时直接调取支付接口
      let that = this;
      that.setData({
        num: e.detail.value
      })
      if (that.data.num.length == 6) {
        that._basesubsidyPay();
      }
    },
    // 补贴宝商家支付
    _basesubsidyPay: function() {
      let that = this;
      var url = 'account/basesubsidy/pay';
      var params = {
        RecordId: that.data.gotoPayRecordId,
        PayPassword: utilMd5.hexMD5(that.data.num)
      }
      netUtil.postRequest(url, params, function(res) {
        that.setData({
          showPassword: false,
          showPaySuccess: true,
        })
      },function(){
        that.setData({
          num: '',
        })
      })
    },


    //弹出选择课程
    _showClassDialog: function(temp) {
      let that=this;
      if (!temp) {
        return;
      }
      if (temp.Status == 0) {
        that.sureClass(temp);
      } else if (temp.Status == 1) {
        that.waitClass(temp);
      } else if (temp.Status == 3) {
        that.gotoPay(temp);
      }else{
        wx.showToast({
          icon:'none',
          title: '已成交',
        })
      }
    },


    //去支付初始化
    gotoPay: function(tempInfo) {
      let that = this;
      if (!tempInfo) {
        return;
      }
      that.setData({
        showPay: true
      });
      that.setData({
        gotoPayRecordId: tempInfo.RecordId,
        gotoPayAmount: tempInfo.PayAmount,
        gotoPayCanalAmount: tempInfo.CanalAmount,
        gotoPayClassName: tempInfo.ItemName
      });
    },

    //等待课程确认初始化
    waitClass: function(tempInfo) {
      let that = this;
      if (!tempInfo) {
        return;
      }
      that.setData({
        showClass: true
      });
      that.setData({
        waitClassRecordId: tempInfo.RecordId
      });
    },

    //成交课表信息弹出框初始化
    sureClass: function(tempInfo) {
      let that = this;
      that._getStore(tempInfo.StoreIdList, function(res) {
        if (tempInfo.RecordId != 0) {
          let tempIndex = 0;
          let storeName = "";
          res.forEach((e, index) => {
            if (e.StoreId == tempInfo.StoreId) {
              tempIndex = index;
              storeName = e.StoreName
            }
          });
          that.setData({
            selectPicker: {
              StoreId: tempInfo.StoreId,
              StoreName: storeName
            },
            storeIndex: tempIndex,
            price: tempInfo.Price*1.0/100,
            payAmount: tempInfo.PayAmount * 1.0 / 100,
          });
          that._getClass(tempInfo.StoreId, function(res) {
            if (res && res.length > 0) {
              let tempItemIndex = 0;
              let itemName = "";
              res.forEach((e, itemIndex) => {
                if (e.ItemId == tempInfo.ItemId) {
                  tempItemIndex = itemIndex;
                  itemName = e.ItemName;
                }
              });
              that.setData({
                selectClass: {
                  ItemId: tempInfo.ItemId,
                  ItemName: itemName
                },
                itemIndex: tempItemIndex
              });
            }
          });
        } else {
          that.setData({
            storeIndex: 0,
            itemIndex: 0,
            selectClass: {},
            selectPicker: {},
            price: '',
            payAmount: '',
          })
        }
      });
      that.setData({
        sureClassRecordId: tempInfo.RecordId,
        qrCode: tempInfo.QrCode,
        showSureClass: true
      });
    },
    //获取所有门店列表
    _getStore: function(storeIdList, onSuccess) {
      let that = this;
      var url = 'account/store/list';
      var params = {}
      netUtil.postRequest(url, params, function(res) {
        let arr = res.Data;
        if (storeIdList && storeIdList.length > 0) {
          arr = arr.filter(e => {
            return storeIdList.indexOf(e.StoreId) != -1;
          });
        }
        that.setData({
          storeList: arr
        })
        if (onSuccess) {
          onSuccess(arr);
        }
      })
    },
    //改变picker值
    bindPickerStoreChange: function(e) {
      let that = this;
      let index = e.detail.value;
      if (that.data.storeList[index].StoreId == that.data.selectPicker.StoreId) {
        return;
      }
      that.setData({
        selectPicker: that.data.storeList[index],
        selectClass: {}
      })
      let storeId = that.data.selectPicker.StoreId;
      that._getClass(storeId);
    },
    //获取所有门店课程
    _getClass: function(storeId, onSuccess) {
      let that = this;
      var url = 'account/storeitem/list';
      var params = {
        Id: storeId
      }
      netUtil.postRequest(url, params, function(res) {
        that.setData({
          classList: res.Data,
        })
        if (onSuccess) {
          onSuccess(res.Data);
        }
      })
    },
    bindPickeClassrChange: function(e) {
      let that = this;
      let index = e.detail.value;
      that.setData({
        selectClass: that.data.classList[index],
        price: that.data.classList[index].Price
      })
    }
  },
})