var netUtil = require("../../utils/request.js"); //require引入
Page({
  data: {
    date: '', //不填写默认今天日期，填写后是默认日期
    year: '全部',
    date2: [],
    month: '全部',
    array: [],
    storeList: [], //门店列表
    showId: 0, //选中门店下标
    storeName: "全部门店", //默认
    showSelect: false, //门店弹窗
    Id:'',//预约记录Id
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
      pageIndex: 1,
      navbarActiveIndex: 0,
      isFinish: true, //数据加载是否完成
    }, {
      list: [],
      status: 0,
      pageIndex: 1,
      navbarActiveIndex: 1,
      isFinish: true, //数据加载是否完成
    }, {
      list: [],
      status: 0,
      pageIndex: 1,
      navbarActiveIndex: 2,
      isFinish: true, //数据加载是否完成
    }, {
      list: [],
      status: 0,
      pageIndex: 1,
      navbarActiveIndex: 3,
      isFinish: true, //数据加载是否完成
    }, {
      list: [],
      status: 0,
      pageIndex: 1,
      navbarActiveIndex: 4,
      isFinish: true, //数据加载是否完成
    }],
    usertoken: '',
    showCancel: false, //取消预约弹窗
    reason: '', //弹窗内容
  },

  onLoad: function(options) {
    let that = this;
    that._getStore();
    that.initPicker();
    that.getData(1);
  },
  //type:1.获取最新 2.获取更多
  getData: function(type) {
    let that = this;
    let tempModelList = that.data.modelList;
    //判断上一次操作是否完成,未完成直接返回
    if (tempModelList[that.data.navbarActiveIndex].isFinish!=true){
      return;
    }
    tempModelList[that.data.navbarActiveIndex].isFinish=false;
    that.setData({
      modelList: tempModelList
    });
    var url = 'appointment/record/list';
    var params = {
      AppointmentStatus: that.data.navbarActiveIndex,
      Year: that.data.year,
      Month: that.data.month,
      StoreId: that.data.showId,
      PageCount: 20,
      PageIndex: type==1?1:(that.data.modelList[that.data.navbarActiveIndex].pageIndex+1),
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      tempModelList = that.data.modelList;
      tempModelList[that.data.navbarActiveIndex].status = 1; //设置状态为已刷新
      let arr = res.Data; //返回数据
      //1.判断是刷新还是加载更多
      //a.如果刷新，设置页码数为1
      //b.如果加载更多且数据列表不为空，设置页码数+1
      if (type == 1) {
        tempModelList[that.data.navbarActiveIndex].list = arr;
        tempModelList[that.data.navbarActiveIndex].list.pageIndex=1;
      } else {
        if (arr.length > 0) {
          tempModelList[that.data.navbarActiveIndex].list = tempModelList[that.data.navbarActiveIndex].list.concat(arr)
          tempModelList[that.data.navbarActiveIndex].pageIndex++;
        }
      }
      tempModelList[that.data.navbarActiveIndex].isFinish = true;
      that.setData({
        modelList: tempModelList
      })
    });
  },

  initPicker: function() {
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
  _getStore: function() {
    let that = this;
    var url = 'account/store/list';
    var params = {}
    netUtil.postRequest(url, params, function(res) {
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
  changeSelect: function() {
    this.setData({
      showSelect: !this.data.showSelect
    })
  },
  //点击全部门店
  allStore: function() {
    this.setData({
      storeId: 0,
      storeName: '全部门店',
      showSelect: false
    })
  },
  //更换门店
  changeStore: function(e) {
    let that = this;
    that.setData({
      showId: e.currentTarget.dataset.id,
      storeId: e.currentTarget.dataset.id,
      storeName: e.currentTarget.dataset.name,
      showSelect: false
    })
    this.getData(1);
  },
  bindDateChange: function(e) {
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
    this.getData(1);
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
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })
    if (this.data.modelList[navbarTapIndex].status == 0) {
      this.getData(1);
    }
  },

  //下拉刷新
  onPullDownRefresh: function() {
    let that = this;
    that.getData(1);
    wx.stopPullDownRefresh();
  },
  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    that.getData(2);
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
  //打开取消预约弹窗
  appointCancel: function(e) {
    this.setData({
      showCancel: true,
      reason: '',
      Id:e.currentTarget.dataset.id
    })
  },

  //关闭取消预约弹窗
  clickCancel: function() {
    this.setData({
      showCancel: false
    })
  },
  //确定发送预约弹窗内容
  clickConfirm: function() {
    this._appointmentCancel();
    if (this.data.reason) {
      this.setData({
        showCancel: false
      })
    }
  },
  //获取取消预约内容
  hasReason: function(e) {
    this.setData({
      reason: e.detail.value
    })
  },
  _appointmentCancel: function() {
    let that = this;
    if (!that.data.reason) {
      wx.showToast({
        icon: 'none',
        title: '请输入取消原因',
      })
      return;
    }
    var url = 'appointment/cancel';
    var params = {
      RecordId: that.data.Id,
      Reason: that.data.reason,
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showToast({
        icon: 'none',
        title: '发送成功',
      })
      that.getData(1)
    })
  },
  onShareAppMessage: function() {},
})