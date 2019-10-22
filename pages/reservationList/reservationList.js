var netUtil = require("../../utils/request.js"); //require引入
Page({
  data: {
    year1: '2018', //定位的年
    month1: '1', //定位的月
    day1: '1', //定位的日
    date: '', //不填写默认今天日期，填写后是默认日期
    year: '全部',
    date2: [],
    month: '全部',
    array: [],
    storeList: [], //门店列表
    showId: 0, //选中门店下标
    storeName: "全部门店", //默认
    showSelect: false, //门店弹窗
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
    showConfirm: false, //确认预约弹窗
    type: '', // 1修改 2确认
    excludeDateList: [], //排除日期列表
    classList: [], //课程列表
    //点击确认预约/修改预约 传参
    item: {
      Id: "",
      StoreId: "",
      ItemId: ""
    },
    //弹窗年月参数
    popItem: {
      Year: "",
      Month: ""
    },
    //日期点击参数
    clickItem: {
      Year: "",
      Month: "",
      Day: ""
    },
    checkedAppointmentId: "", //选中课程Id
    dayStyle: [], //默认选中当天日期样式
    excludeStyleArr: [], //无效样式
  },

  // 打开确认预约弹窗
  bindReserSure: function(e) {
    let that = this;
    let itemPar = e.currentTarget.dataset.item;
    let year;
    let month;
    let day;
    //与老师协商没有具体日期
    if (itemPar.AppointmentType == 1) {
      const dd = new Date();
      year = dd.getFullYear();
      month = dd.getMonth() + 1;
      day = dd.getDate();
    } else {
      let arr = itemPar.ClassDate.split('-');
      year = arr[0];
      month = arr[1];
      day = arr[2];
    }
    this.setData({
      showConfirm: true,
      type: e.currentTarget.dataset.type, // 1修改 2确认
      item: {
        Id: itemPar.Id,
        StoreId: itemPar.StoreId,
        ItemId: itemPar.ItemId
      },
      popItem: {
        Year: year,
        Month: month
      },
      clickItem: {
        Year: year,
        Month: month,
        Day: day
      },
      year1: year,
      month1: month,
      day1: day,
      checkedAppointmentId: itemPar.AppointmentId
    })
    that._getExcludeDateList();
  },

  // 点击某一天获取课程列表 且选中
  _getDayClass: function() {
    let that = this;
    let monthTemp = that.data.clickItem.Month;
    let datTemp = that.data.clickItem.Day;

    if (that.data.excludeDateList.indexOf(Number(datTemp)) != -1) {
      return;
    }
    if (that.data.clickItem.Month < 10) {
      monthTemp = '0' + monthTemp;
    }
    if (that.data.clickItem.Day < 10) {
      datTemp = '0' + datTemp;
    }
    var url = 'appointment/item/list';
    var params = {
      RecordId: that.data.item.Id,
      ClassDate: that.data.clickItem.Year + '-' + monthTemp + '-' + datTemp,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        classList: res.Data
      })
      that._setCheckday();
    });
  },
  //设置日期样式
  _setCheckday: function() {
    let that = this;
    let arr = [];
    arr = arr.concat(that.data.excludeStyleArr);
    if (Number(that.data.popItem.Year) == Number(that.data.clickItem.Year) && Number(that.data.popItem.Month) == Number(that.data.clickItem.Month)) {
      arr.push({
        month: 'current',
        day: that.data.clickItem.Day,
        color: '#fff',
        background: '#3CD5D1'
      });
    }
    that.setData({
      dayStyle: arr
    });
  },
  //设置无效日期样式
  _setExcludeDateStyle: function() {
    let that = this;
    let arr = [];
    that.data.excludeDateList.forEach(item => {
      arr.push({
        month: 'current',
        day: item,
        color: '#ccc'
      });
    });
    that.setData({
      excludeStyleArr: arr
    });
    let dd = new Date();
    if (Number(that.data.popItem.Year) == dd.getFullYear() && Number(that.data.popItem.Month) == (dd.getMonth() + 1)) {
      arr.push({
        month: 'current',
        day: dd.getDate(),
        background: '#89edeb'
      });
    }
    that.setData({
      dayStyle: arr
    });
    if (that.data.popItem.Year == that.data.clickItem.Year && that.data.popItem.Month == that.data.clickItem.Month) {
      that._getDayClass();
    }
  },
  //获取排除日期列表
  _getExcludeDateList: function() {
    let that = this;
    var url = 'appointment/item/date/list';
    var params = {
      StoreId: that.data.item.StoreId,
      ItemId: that.data.item.ItemId,
      Year: that.data.popItem.Year,
      Month: that.data.popItem.Month,
    }
    netUtil.postRequest(url, params, function(res) {
      let excludeDateList = [];
      for (var i = 1; i <= 31; i++) {
        if (res.Data.indexOf(i) == -1) {
          excludeDateList.push(i);
        }
      }
      that.setData({
        excludeDateList: excludeDateList,
        classList: []
      })
      that._setExcludeDateStyle();
    })
  },

  //监听点击下个月
  next: function(e) {
    let that = this;
    that.setData({
      popItem: {
        Year: e.detail.currentYear,
        Month: e.detail.currentMonth
      }
    });
    that._getExcludeDateList();
  },

  //监听点击上个月
  prev: function(e) {
    let that = this;
    that.setData({
      popItem: {
        Year: e.detail.currentYear,
        Month: e.detail.currentMonth
      }
    });
    that._getExcludeDateList();
  },
  //监听点击日历标题日期选择
  dateChange: function(e) {
    let that = this;
    that.setData({
      popItem: {
        Year: e.detail.currentYear,
        Month: e.detail.currentMonth
      }
    });
    that._getExcludeDateList();
  },
  //点击某一天
  dayClick: function(e) {
    let that = this;
    if (that.data.excludeDateList.indexOf(e.detail.day) != -1) {
      return;
    }
    that.setData({
      popItem: {
        Year: e.detail.year,
        Month: e.detail.month,
      },
      clickItem: {
        Year: e.detail.year,
        Month: e.detail.month,
        Day: e.detail.day
      }
    });
    that._getDayClass();
  },

  //课程改变
  classChange: function (e) {
    let that = this;
    that.setData({
      checkedAppointmentId: e.detail.value
    });
  },

  onLoad: function(options) {
    let that = this;
    //选中日期
    that._getStore();
    that.initPicker();
    that.getData(1);
  },
  //type:1.获取最新 2.获取更多
  getData: function(type) {
    let that = this;
    let tempModelList = that.data.modelList;
    //判断上一次操作是否完成,未完成直接返回
    if (tempModelList[that.data.navbarActiveIndex].isFinish != true) {
      return;
    }
    tempModelList[that.data.navbarActiveIndex].isFinish = false;
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
      PageIndex: type == 1 ? 1 : (that.data.modelList[that.data.navbarActiveIndex].pageIndex + 1),
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
        tempModelList[that.data.navbarActiveIndex].pageIndex = 1;
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
    }, function() {
      tempModelList[that.data.navbarActiveIndex].isFinish = true;
      that.setData({
        modelList: tempModelList
      });
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
  //改变日期
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
  onReachBottom: function() {
    let that = this;
    that.getData(2);
  },

  // 调取确认预约
  _appointmentConfirm: function(type) {
    let that = this;
    var url = 'appointment/confirm';
    var params = {
      RecordId: that.data.item.Id,
      AppointmentId: that.data.checkedAppointmentId,
      IsShift: type == 1 ? true : false
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showToast({
        icon: 'none',
        title: type == 1 ? '插班操作成功' : '预约操作成功',
      })
      //找到当前数据 修改状态值
      let tempList = that.data.modelList;
      tempList.forEach(x => {
        x.list.forEach(item => {
          if (Number(that.data.item.Id) == Number(item.Id)) {
            item.AppointmentStatus = res.Data.AppointmentStatus;
            item.ClassDate = res.Data.ClassDate;
            item.ClassTime = res.Data.ClassTime;
            item.ScheduleName = res.Data.ScheduleName;
            item.AppointmentStatusDes = res.Data.AppointmentStatusDes;
            item.AppointmentId = res.Data.AppointmentId;
          }
        })
      })

      that.setData({
        showConfirm: false,
        modelList: tempList
      })
    });
  },

  //关闭确认预约弹窗
  closeConfirm: function() {
    this.setData({
      showConfirm: false,
    })
  },

  //确认插班
  sureTransfer: function() {
    this._appointmentConfirm(1);
  },

  //确认预约
  sureReservation: function() {
    this._appointmentConfirm(2);
  },

  //打开取消预约弹窗
  appointCancel: function(e) {
    this.setData({
      showCancel: true,
      reason: '',
      Id: e.currentTarget.dataset.id
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
    if (this.data.reason) {
      this.setData({
        showCancel: false
      })
    }
    this._appointmentCancel();
  },
  //获取取消预约内容
  hasReason: function(e) {
    this.setData({
      reason: e.detail.value
    })
  },
  //取消预约
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
      //找到当前数据 修改状态值
      let tempList = that.data.modelList;
      tempList.forEach(x => {
        x.list.forEach(item => {
          if (that.data.item.Id == item.Id) {
            item.AppointmentStatus = res.Data.AppointmentStatus;
            item.ClassDate = res.Data.ClassDate;
            item.CancelTime = res.Data.CancelTime;
            item.AppointmentStatusDes = res.Data.AppointmentStatusDes;
          }
        })
      })
      that.setData({
        modelList: tempList,
      })
      wx.showToast({
        icon: 'none',
        title: '取消成功',
      })
    })
  },

  onShareAppMessage: function() {},
})