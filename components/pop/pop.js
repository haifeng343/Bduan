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
    onStatus:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
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

    showDlgErrorInfo: function() {
      wx.showModal({
        content: '成交课程信息有误，请确认',
        showCancel: false,
        confirmColor: "#000",
        confirmText: "知道了"
      })
    },

    statusCallback: function (status){
      if (this.data.onStatus != null) {
        this.data.onStatus(status);
      }
    },

    sureWaitClass: function(onStatus) {
      let that = this;
      that._basesubsidyDealConfirm(function(res) {
        console.log(res)
        let data1 = { waitClassRecordId: res.RecordId };
        that.triggerEvent("getRecordId", data1);
        
        if (res.Status == 2) {
          that.showDlgErrorInfo();
        } else if (res.Status == 3) {
          that.gotoPay(res);
        }

        that.setData({
          showClass: false,
        })

        that.statusCallback(res.Status);
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
    _showClassDialog: function(temp, onStatus) {
      let that = this;
      that.setData({
         onStatus: onStatus,
      });

      if (temp.Status == 0) {

      } else if (temp.Status == 1) {
        that.waitClass(temp);
      } else if (temp.Status == 2) {
        that.showDlgErrorInfo();
      } else if (temp.Status == 3) {
        that.gotoPay(temp);
      } else if (temp.Status == 4) {
        wx.showToast({
          icon:'none',
          title: '已成交',
        })
      }
    },

    //去支付初始化
    gotoPay: function (tempInfo) {
      let that = this;
      that.setData({
        gotoPayRecordId: tempInfo.RecordId,
        gotoPayAmount: tempInfo.PayAmount,
        gotoPayCanalAmount: tempInfo.CanalAmount,
        gotoPayClassName: tempInfo.ItemName,
        showPay: true,
      });
    },

    //等待课程确认初始化
    waitClass: function (tempInfo) {
      let that = this;
      that.setData({
        waitClassRecordId: tempInfo.RecordId, 
        showClass: true,
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