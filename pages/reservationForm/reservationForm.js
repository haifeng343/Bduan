var netUtil = require("../../utils/request.js"); //require引入
Page({
  data: {
    name: "", //课程名称
    showSuccess: false, //弹窗是否显示
    dayStyle: [],
    Info: {}, //课程排课详情
    classTime: '', //课程时间
    scheduleName: '', //排课描述
    classDuration: '', //上课时长
    remainQuota: '', //剩余名额
    Id: '', //预约表Id
    item: {}, //预约表详情
    showDialog: false, //清空预约弹窗
    batchList: [], //门店课程批量排课列表
    checkAll: false, //是否全选
    qita: "", //其他是空字符串




    storeId: "", //门店Id
    itemId: "", //项目Id
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
    dayStyle: [], //默认选中当天日期样式
    excludeStyleArr: [], //无效样式
    excludeDateList: [], //排除日期列表
  },
  onLoad: function(options) {
    let month = new Date().getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    this.setData({
      name: options.name || '',
      storeId: options.storeId || '',
      itemId: options.itemId || '',
      popItem: {
        Year: new Date().getFullYear(),
        Month: new Date().getMonth() + 1,
      },
      clickItem: {
        Year: new Date().getFullYear(),
        Month: new Date().getMonth() + 1,
        Day: new Date().getDate()
      }
    })
    wx.setNavigationBarTitle({
      title: '预约表-' + this.data.name,
    })
    this.init();
  },
  // 初始加载
  init: function() {
    let that = this;
    that._getExcludeDateList();
  },
  //获取排除日期列表
  _getExcludeDateList: function() {
    let that = this;
    var url = 'appointment/item/date/list';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
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
        Info: {}
      })
      that._setExcludeDateStyle();
    },null,false,true,true)
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
        background: '#f4f4f4'
      });
    }
    that.setData({
      dayStyle: arr
    });
    if (that.data.popItem.Year == that.data.clickItem.Year && that.data.popItem.Month == that.data.clickItem.Month) {
      that._getDayClass();
    }
  },
  // 点击某一天获取课程列表 且选中
  _getDayClass: function() {
    let that = this;
    let monthTemp = that.data.clickItem.Month;
    let datTemp = that.data.clickItem.Day;

    if (that.data.clickItem.Month < 10) {
      monthTemp = '0' + monthTemp;
    }
    if (that.data.clickItem.Day < 10) {
      datTemp = '0' + datTemp;
    }
    var url = 'account/storeitem/schedule/list';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      ClassDate: that.data.clickItem.Year + '-' + monthTemp + '-' + datTemp,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        Info: res.Data
      })
      that._setCheckday();
    },null,false,true,true);
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
  //监听点击日历具体某一天的事件
  dayClick: function(e) {
    let that = this;
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
  //监听点击日历标题日期选择
  dateChange: function(e) {
    let that = this;
    if (e.detail.currentYear == that.data.popItem.Year && e.detail.currentMonth == that.data.popItem.Month){
      return;
    }
    that.setData({
      popItem: {
        Year: e.detail.currentYear,
        Month: e.detail.currentMonth
      },
      clickItem: {}
    });
    that._getExcludeDateList();
  },
  //监听点击下个月
  next: function(e) {
    let that = this;
    that.setData({
      popItem: {
        Year: e.detail.currentYear,
        Month: e.detail.currentMonth
      },
      clickItem: {}
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
      },
      clickItem:{}
    });
    that._getExcludeDateList();
  },

  // 获取门店课程批量排课列表
  _getBatchList: function() {
    let that = this;
    var url = 'account/storeitem/schedule/batch/list';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
    }
    netUtil.postRequest(url, params, function(res) {
      let arr = res.Data;
      arr.unshift({
        BatchName: "",
        BatchEndTime: null,
        BatchStartTime: null,
        CreateTime: null
      })
      that.setData({
        batchList: arr,
      })
    })
  },
  // 打开清空预约弹窗
  emptyClick: function() {
    this.setData({
      showDialog: true,
    })
    this._getBatchList();
  },
  //关闭清空预约弹窗
  batchCancel: function() {
    this.setData({
      showDialog: false,
      checkAll: false
    })
  },
  //确定清空操作
  batchSure: function() {
    this._batchDelete();
  },
  // 批量清空课程排课
  _batchDelete: function() {
    let that = this;
    var url = 'account/storeitem/schedule/batch/delete';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      BatchNameList: that.data.checkAll == true ? null : that.data.batchList.filter(item => {
        return item.check == true
      }).map(item => {
        return item.BatchName
      })
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        showDialog: false,
        checkAll: false
      })
      that.init();
      wx.showToast({
        icon: "none",
        title: '清空成功',
      })
    })
  },
  changeQita: function(e) {
    let that = this;
    let tempArr = that.data.batchList;
    let arr = e.detail.value;
    let checkAll = true;

    tempArr.forEach(item => {
      let indexTemp = arr.indexOf(item.BatchName);
      if (indexTemp == -1) {
        item.check = false;
        checkAll = false;
      } else {
        item.check = true;
      }
    });

    that.setData({
      batchList: tempArr,
      checkAll: checkAll
    });
  },
  allChange: function() {
    let that = this;
    let tempArr = that.data.batchList;
    tempArr.forEach(item => {
      if (that.data.checkAll == true) {
        item.check = false
      } else {
        item.check = true
      }
    })
    that.setData({
      checkAll: !that.data.checkAll,
      batchList: tempArr
    })
    // if(e.value.)
  },
  //添加预约表弹窗
  classAdd: function() {
    this.setData({
      Id: '',
      showSuccess: true,
      classTime: '', //课程时间
      scheduleName: '', //排课描述
      classDuration: '', //上课时长
      remainQuota: '', //剩余名额
    })
  },
  // 编辑预约表
  edit: function(e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    that.setData({
      Id: item.Id,
      showSuccess: true,
      scheduleName: item.ScheduleName,
      classTime: item.ClassTime,
      classDuration: item.ClassDuration,
      remainQuota: item.RemainQuota,
    })
  },
  //删除
  delete: function(e) {
    console.log(e)
    let that = this;
    this.setData({
      Id: e.currentTarget.dataset.id
    })
    wx.showModal({
      content: '您确认删除 "' + e.currentTarget.dataset.schedulename + '" 的预约表吗？',
      confirmColor: "#000",
      success: function(res) {
        if (res.confirm) {
          that._delete(e.currentTarget.dataset.id);
          that.init();
        }
      }
    })
  },
  //修改预约表
  _modidy: function() {
    let that = this;
    var url = 'account/storeitem/schedule/modify';

    if (!that.data.scheduleName) {
      wx.showToast({
        icon: "none",
        title: '请输入预约描述',
      })
      return;
    }
    if (!that.data.classTime) {
      wx.showToast({
        icon: "none",
        title: '请选择上课时间',
      })
      return;
    }
    if (!that.data.classDuration) {
      wx.showToast({
        icon: "none",
        title: '请输入上课时长',
      })
      return;
    }
    if (!that.data.remainQuota) {
      wx.showToast({
        icon: "none",
        title: '请输入剩余名额',
      })
      return;
    }
    var params = {
      Id: that.data.Id,
      ClassTime: that.data.classTime,
      ScheduleName: that.data.scheduleName,
      ClassDuration: that.data.classDuration,
      RemainQuota: that.data.remainQuota,
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        showSuccess: false
      })
      that.init();

      wx.showToast({
        icon: 'none',
        title: '预约修改成功',
      })
    })
  },
  // 添加课程排课
  _add: function() {
    let that = this;
    var url = 'account/storeitem/schedule/add';

    if (!that.data.scheduleName) {
      wx.showToast({
        icon: "none",
        title: '请输入预约描述',
      })
      return;
    }
    if (!that.data.classTime) {
      wx.showToast({
        icon: "none",
        title: '请选择上课时间',
      })
      return;
    }
    if (!that.data.classDuration) {
      wx.showToast({
        icon: "none",
        title: '请输入上课时长',
      })
      return;
    }
    if (!that.data.remainQuota) {
      wx.showToast({
        icon: "none",
        title: '请输入剩余名额',
      })
      return;
    }

    let monthTemp = that.data.clickItem.Month;
    let datTemp = that.data.clickItem.Day;

    if (that.data.clickItem.Month < 10) {
      monthTemp = '0' + monthTemp;
    }
    if (that.data.clickItem.Day < 10) {
      datTemp = '0' + datTemp;
    }

    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      ClassDate: that.data.clickItem.Year + '-' + monthTemp + '-' + datTemp,
      ClassTime: that.data.classTime,
      ScheduleName: that.data.scheduleName,
      ClassDuration: that.data.classDuration,
      RemainQuota: that.data.remainQuota,
    }
    netUtil.postRequest(url, params, function(res) {

      that.setData({
        showSuccess: false
      })
      that.init();
      wx.showToast({
        icon: 'none',
        title: '预约添加成功',
      })
    })
  },
  // 删除课程排课
  _delete: function(Id) {
    let that = this;
    var url = 'account/storeitem/schedule/delete';
    var params = {
      Id: Id,
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showToast({
        icon: 'none',
        title: '预约删除成功',
      })
      that.init();
    })
  },

  //关闭弹窗'
  clickCancel: function() {
    this.setData({
      showSuccess: false
    })
  },
  // 排课描述
  scheduleChange: function(e) {
    this.setData({
      scheduleName: e.detail.value
    })
  },
  // 课程时间
  timeChange: function(e) {
    this.setData({
      classTime: e.detail.value + ':00'
    })
  },
  // 上课时长
  durationChange: function(e) {
    this.setData({
      classDuration: e.detail.value
    })
  },
  // 剩余名额
  remainChange: function(e) {
    this.setData({
      remainQuota: e.detail.value
    })
  },
  //确认添加
  clickSure: function() {
    let that = this;
    if (!that.data.Id) {
      that._add();
    } else {
      that._modidy();
    }
  },
  //添加预约表
  addPoint: function() {
    wx.navigateTo({
      url: '/pages/addAppointment/addAppointment?storeId=' + this.data.storeId + '&itemId=' + this.data.itemId
    })
  },
  onShareAppMessage: function() {

  }
})