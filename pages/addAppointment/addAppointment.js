Page({

  data: {
    showSuccess: false, //添加预约弹窗
    appointList: [{
      'classDuration': "43",
      'classTime': "02:00:00",
      'remainQuota': "34",
      'scheduleName': "21"
    }], //本地预约列表
    classTime: '请选择时间', //课程时间
    scheduleName: '', //排课描述
    classDuration: '', //上课时长
    remainQuota: '', //剩余名额
  },
  onLoad: function(options) {

  },
  classAdd: function() {
    this.setData({
      showSuccess: true,
      classTime: '请选择时间', //课程时间
      scheduleName: '', //排课描述
      classDuration: '', //上课时长
      remainQuota: '', //剩余名额
    })
  },
  //关闭添加预约弹窗
  clickCancel: function() {
    this.setData({
      showSuccess: false
    })
  },
  // 确定添加预约表
  clickSure: function() {
    let that = this;
    let arr = that.data.appointList;
    arr.push({
      scheduleName: that.data.scheduleName,
      classTime: that.data.classTime,
      classDuration: that.data.classDuration,
      remainQuota: that.data.remainQuota,
    })
    that.setData({
      appointList: arr,
      showSuccess: false,
    })
    console.log(arr)
  },
  //编辑预约表
  edit: function (e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    console.log(e);
    that.setData({
      showSuccess: true,
      scheduleName: item.scheduleName,
      classTime: item.classTime,
      classDuration: item.classDuration,
      remainQuota: item.remainQuota,
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
  onShareAppMessage: function() {

  }
})