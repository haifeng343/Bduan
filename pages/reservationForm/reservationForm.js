var netUtil = require("../../utils/request.js"); //require引入
const styleArr = [{
    month: 'current',
    day: new Date().getDate(),
    color: 'white',
    background: '#3CD5D1'
  },
  {
    month: 'current',
    day: new Date().getDate(),
    color: 'white',
    background: '#3CD5D1'
  },
];
Page({
  data: {
    name: "", //课程名称
    storeId: "", //门店Id
    itemId: "", //项目Id
    showSuccess: false, //弹窗是否显示
    dayStyle: styleArr,
    classDate: '', //获取课程排课时间
    Info: {}, //课程排课详情
    classTime: '请选择时间', //课程时间
    scheduleName: '', //排课描述
    classDuration: '', //上课时长
    remainQuota: '', //剩余名额
    Id: '', //预约表Id
    item: {}, //预约表详情
    showDialog: false, //清空预约弹窗
    batchList: [], //门店课程批量排课列表
    checkAll: false, //是否全选
    qita: "", //其他是空字符串
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
      classDate: new Date().getFullYear() + '-' + month + '-' + new Date().getDate() //初始化时间选择当前日期
    })
    wx.setNavigationBarTitle({
      title: '预约表-' + this.data.name,
    })
    this.init();
  },
  // 获取课程排课
  init: function() {
    let that = this;
    var url = 'account/storeitem/schedule/list';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      ClassDate: that.data.classDate,
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data) {
        that.setData({
          Info: res.Data
        })
      }
    })
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
      showDialog: false
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
        showDialog: false
      })
      wx.showToast({
        icon:"none",
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
      classTime: '请选择时间', //课程时间
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
      title: '提示',
      content: "您确认删除 " + e.currentTarget.dataset.schedulename + ' 的预约表吗？',
      confirmColor: "#000",
      success: function(res) {
        if (res.confirm) {
          that._delete(e.currentTarget.dataset.id)
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
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      ClassDate: that.data.classDate,
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
  //监听点击日历具体某一天的事件
  dayClick: function(e) {
    let month = e.detail.month;
    if (month < 10) {
      month = '0' + month
    }
    this.setData({
      classDate: e.detail.year + '-' + month + '-' + e.detail.day
    })
    let dd = new Date();
    if (e.detail.month != (dd.getMonth() + 1) ||
      (e.detail.month == (dd.getMonth() + 1) &&
        e.detail.year != (dd.getFullYear()))) {
      this.setData({
        dayStyle: [styleArr[0]],
      });
      let clickDay = e.detail.day;
      let changeDay = `dayStyle[0].day`;
      let changeBg = `dayStyle[0].background`;
      this.setData({
        [changeDay]: clickDay,
        [changeBg]: "#84e7d0"
      })
    } else {
      this.setData({
        dayStyle: styleArr
      });
      let clickDay = e.detail.day;
      let changeDay = `dayStyle[1].day`;
      let changeBg = `dayStyle[1].background`;
      this.setData({
        [changeDay]: clickDay,
        [changeBg]: "#84e7d0"
      })
    }
    const data = [{
        month: 10,
        day: 2
      },
      {
        month: 10,
        day: 3
      },
      {
        month: 10,
        day: 4
      },
    ]
    for (let v of data) {
      if (e.detail.day == v.day) {
        wx.showToast({
          icon: "none",
          title: '该时间暂无体验课',
        })
      } else {
        continue;
      }
    }
    this.init();
  },
  //监听点击日历标题日期选择
  dateChange: function(e) {
    let dd = new Date();
    if (e.detail.currentMonth != (dd.getMonth() + 1) ||
      (e.detail.currentMonth == (dd.getMonth() + 1) &&
        e.detail.currentYear != (dd.getFullYear()))) {
      this.setData({
        dayStyle: []
      });
    } else {
      this.setData({
        dayStyle: styleArr
      });
    }
  },
  //监听点击下个月
  next: function(e) {
    let dd = new Date();
    if (e.detail.currentMonth != (dd.getMonth() + 1) ||
      (e.detail.currentMonth == (dd.getMonth() + 1) &&
        e.detail.currentYear != (dd.getFullYear()))) {
      this.setData({
        dayStyle: []
      });
    } else {
      this.setData({
        dayStyle: styleArr
      });
    }
  },
  //监听点击上个月
  prev: function(e) {
    let dd = new Date();
    if (e.detail.currentMonth != (dd.getMonth() + 1) ||
      (e.detail.currentMonth == (dd.getMonth() + 1) &&
        e.detail.currentYear != (dd.getFullYear()))) {
      this.setData({
        dayStyle: []
      });
    } else {
      this.setData({
        dayStyle: styleArr
      });
    }
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