const app = getApp();
const netUtil = require('../../utils/request.js');
Page({

  data: {
    storeList: [], //门店列表
    classList: [], //课程列表
    storeIndex: 0, //默认选中的门店
    selectPicker: {}, //选中的门店
    itemIndex: 0, //默认选中的课程
    selectClass: {}, //选中的课程

    sureClassRecordId: "", //确认课程记录Id
    qrCode: '', //确认课程券码

    price: "", //原价
    payAmount: "", //实付价格
    TempResult: "", //
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
        TempResult: (options.TempResult ? JSON.parse(options.TempResult) : ''),
      }),

    that._getStore();
    that.sureClass(that.data.TempResult);
    if (that.selectComponent('#pop')) {
      that.selectComponent('#pop')._showClassDialog(that.data.TempResult);
    }
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
          price: tempInfo.Price * 1.0 / 100,
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

  sureClassClick: function() {
    let that = this;
    that._basesubsidyConfirm(function(res) {
      if (res.Status == 1) {
        that.selectComponent('#pop').waitClass(res);
      } else if (res.Status == 3) {
        that.selectComponent('#pop').gotoPay(res);
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
      return;
    }

    if (!that.data.selectClass) {
      wx.showToast({
        icon: 'none',
        title: '请选择课程',
      })
      return;
    }

    if (!that.data.price) {
      wx.showToast({
        icon: 'none',
        title: '请输入课程原价',
      })
      return;
    }

    if (!that.data.payAmount) {
      wx.showToast({
        icon: 'none',
        title: '请输入实付价格',
      })
      return;
    }

    var params = {
      QrCode: that.data.qrCode,
      RecordId: that.data.sureClassRecordId,
      StoreId: that.data.selectPicker.StoreId,
      ItemId: that.data.selectClass.ItemId,
      Price: that.data.price * 100,
      PayAmount: that.data.payAmount * 100,
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
      price: that.data.classList[index].Price==0 ?'': that.data.classList[index].Price,
      payAmount: that.data.classList[index].Price==0 ?'': that.data.classList[index].Price
    })
  },

  onShareAppMessage: function() {
  }
})