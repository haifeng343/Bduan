var netUtil = require("../../utils/request.js"); //require引入
Page({
  data: {
    date: '', //不填写默认今天日期，填写后是默认日期
    year: '全部',
    date2: [],
    month: '全部',
    array: [],
    storeList:[],//门店列表
    showId: 0, //选中门店下标
    storeName: "全部门店", //默认
    showSelect:false,//门店弹窗
    navbarActiveIndex: 0,
    navbarTitle: [
      "全部",
      "未处理",
      "已预约",
      "已过期",
      "被取消"
    ],
    modelList: [{
      list: [],
      status: 0, //是否需要刷新0是 1否
      pageIndex: 0,
      wantIndex: 0,
      navbarActiveIndex: 0
    }, {
      list: [],
      status: 0,
      pageIndex: 0,
      wantIndex: 0,
      navbarActiveIndex: 1
    }, {
      list: [],
      status: 0,
      pageIndex: 0,
      wantIndex: 0,
      navbarActiveIndex: 2
    }, {
      list: [],
      status: 0,
      pageIndex: 0,
      wantIndex: 0,
      navbarActiveIndex: 3
    }, {
      list: [],
      status: 0,
      pageIndex: 0,
      wantIndex: 0,
      navbarActiveIndex: 3
    }],
    usertoken:'',
  },

  onLoad: function (options) {
    let that = this;
    that._getStore();
    that.initPicker();
  },
  onShow: function() {
    this.setData({
      usertoken: wx.getStorageSync('usertoken')
    });
    this.getData(false, false);
  },

  getData: function(isForceData, isRefreshData) {
    if ((isForceData || this.data.modelList[this.data.navbarActiveIndex].status == 0) && this.data.usertoken) {
      this._getData(isRefreshData ? 1 : this.data.modelList[this.data.navbarActiveIndex].pageIndex + 1);
    }
  },

  _getData: function(wantIndex) {
    let that = this;
    if (that.data.modelList[that.data.navbarActiveIndex].wantIndex > 0) {
      return;
    }

    let tempModelList = that.data.modelList;
    tempModelList[that.data.navbarActiveIndex].wantIndex = wantIndex;
    that.setData({
      modelList: tempModelList
    })

    var url = 'appointment/record/list';
    var params = {
      AppointmentStatus:that.data.navbarActiveIndex + 1,
      Year:that.data.year,
      Month:that.data.month,
      StoreId: that.data.showId,
      PageCount: 20,
      PageIndex: 1,
    }
    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      let arr = [];
      if (tempModelList[that.data.navbarActiveIndex].wantIndex == 1) {
        arr = res.Data;
      } else {
        arr = tempModelList[that.data.navbarActiveIndex].list;
        arr = arr.concat(res.Data);
      }

      if (res.Data.length > 0) {
        tempModelList[that.data.navbarActiveIndex].pageIndex = tempModelList[that.data.navbarActiveIndex].wantIndex;
      }
      tempModelList[that.data.navbarActiveIndex].status = 1; //设置状态为已刷新
      tempModelList[that.data.navbarActiveIndex].wantIndex = 0;
      tempModelList[that.data.navbarActiveIndex].list = arr;
      that.setData({
        modelList: tempModelList
      })
    }, function (error) {
      tempModelList[that.data.navbarActiveIndex].wantIndex = 0;
      that.setData({
        modelList: tempModelList
      })
    });
  },

  initPicker: function () {
    var date = new Date();
    let arr = [],
      arr1 = [];
    var year = date.getFullYear();
    arr.push('全部');
    for (var i = year; i > 1970; i--) {
      arr.push(i)
    }
    arr1 = ['全部', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    this.setData({
      array: [arr, arr1],
      now: (this.data.year == '全部' && this.data.month == '全部') ? '全部' : (this.data.year + '-' + this.data.month),
      date2: [arr.indexOf(this.data.year), arr1.indexOf(this.data.month + '')],
    })
  },
  //获取所有门店列表
  _getStore: function () {
    let that = this;
    var url = 'account/store/list';
    var params = {}
    netUtil.postRequest(url, params, function (res) {
      let arr = res.Data;
      arr.unshift({
        StoreId: 0,
        StoreName: "全部门店"
      })
      that.setData({
        storeList: arr
      })
    })
  },
  //弹出门店下拉选择
  changeSelect: function () {
    this.setData({
      showSelect: true
    })
  },
  //点击全部门店
  allStore: function () {
    this.setData({
      storeId: 0,
      storeName: '全部门店',
      showSelect: false
    })
  },
  //更换门店
  changeStore: function (e) {
    let that = this;
    that.setData({
      showId: e.currentTarget.dataset.id,
      storeId: e.currentTarget.dataset.id,
      storeName: e.currentTarget.dataset.name,
      showSelect: false
    })
    this._getData();
  },
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value;
    if (index[0] == 0 && index[1] == 0) {
      this.setData({
        date: '全部',
        year: '全部',
        month: '全部',
        page: 1
      })
    } else {
      this.setData({
        date: this.data.array[0][index[0]] + '-' + this.data.array[1][index[1]],
        year: this.data.array[0][index[0]],
        month: this.data.array[1][index[1]],
        page: 1
      })
    }
    this._getData();
  },
  //取消退款
  cancelOrder: function(e) {
    let that = this;
    var url = 'order/refund/cancel';
    var params = {
      Id: e.currentTarget.dataset.id,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      wx.showToast({
        icon: "none",
        title: '取消退款成功',
      })
      let tempList = that.data.modelList;
      tempList.forEach(x => {
        x.list.forEach(item => {
          if (e.currentTarget.dataset.id == item.OrderId) {
            if (x.navbarActiveIndex == 3) {
              item.UseStatus = 9;
            } else {
              item.UseStatus = 1;
            }
          }
        })
      })
      that.setData({
        modelList: tempList
      })
    });
  },

  // 点击导航栏
  onNavBarTap: function(event) {
    this.setData({
      navbarActiveIndex: event.currentTarget.dataset.navbarIndex
    })

    this._getData(false, false);
  },

  //下拉刷新
  onPullDownRefresh: function() {
    this._getData(true, true);
    wx.stopPullDownRefresh();
  },

  //上拉加载更多
  onReachBottom: function() {
    this._getData(true, false);
  },

  //删除
  delete: function(e) {
    let that = this;
    console.log(e)
    let orderid = e.currentTarget.dataset.orderid;
    let orderindex = e.currentTarget.dataset.orderindex;
    wx.showModal({
      title: '',
      content: '确定删除此订单吗？',
      success: function(sm) {
        if (sm.confirm) {
          var url = 'order/delete';
          var params = {
            Id: e.currentTarget.dataset.orderid,
          }
          netUtil.postRequest(url, params, function(res) {
            wx.showToast({
              icon: 'none',
              title: '成功删除',
            })

            let tempList = that.data.modelList;
            tempList[that.data.navbarActiveIndex].list.splice(orderindex, 1);
            that.setData({
              modelList: tempList
            });
          });
        } else if (sm.cancel) {

        }
      }
    })
  },

  onShareAppMessage: function() {},
})