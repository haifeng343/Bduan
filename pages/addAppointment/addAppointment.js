var netUtil = require("../../utils/request.js"); //require引入
//当前总样式
let styleArr = [], tempStyleArr = [];
Page({
  data: {
    storeId: '',//门店id
    itemId:'',//课程id
    bathName:'',//预约表名称
    type:1,//1添加 2编辑 
    currentYear: new Date().getFullYear(),
    currentMonth: (new Date().getMonth() + 1),
    showSuccess: false, //添加预约弹窗
    appointList: [], //本地预约列表
    classTime: '', //课程时间
    scheduleName: '', //排课描述
    classDuration: '', //上课时长
    remainQuota: '', //剩余名额
    popIndex: "", //点击下标（添加为-1）
    startTime: "", //开始时间
    endTime: "", //结束时间
    IntervalList: [{ //间隔类型
      Id: 1,
      name: '日'
    }, {
      Id: 2,
      name: '周'
    }, {
      Id: 3,
      name: '月'
    }],
    showId: 2, //间隔类型默认选择
    intervalDays: '', //时间间隔天数
    weekList: [ //星期几列表
      {
        Id: 1,
        name: '周一',
        check: false,
      },
      {
        Id: 2,
        name: '周二',
        check: false,
      },
      {
        Id: 3,
        name: '周三',
        check: false,
      },
      {
        Id: 4,
        name: '周四',
        check: false,
      },
      {
        Id: 5,
        name: '周五',
        check: false,
      },
      {
        Id: 6,
        name: '周六',
        check: false,
      },
      {
        Id: 0,
        name: '周日',
        check: false,
      }
    ],
    monthList: [], //月份数组
    showDateDialog: false, //排除日期弹窗
    dayStyle: styleArr, //自定义日期样式
    excludeDateList: [], //排除日期列表
    excludeDateList1: [], //排除日期列表1
  },
  onLoad: function(options) {
    let that = this;
    let arr = [];
    for (var i = 1; i < 32; i++) { //循环月份
      arr.push({
        Id: i,
        name: i,
        check: false
      })
    }
    arr.push({
      Id: 0,
      name: '最后一天',
      check: false,
    })
    that.setData({
      monthList: arr,
      storeId:options.storeId || '',
      itemId: options.itemId || '',
    })
  },
  //获取预约表名字
  hasName:function(e){
    this.setData({
      bathName:e.detail.value
    })
  },
  //添加预约课程
  classAdd: function(e) {
    this.setData({
      type:e.currentTarget.dataset.type,
      showSuccess: true,
      popIndex: -1,
      classTime: '', //课程时间
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
    let index = that.data.popIndex;
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
    if (index == -1) {
      arr.push({
        scheduleName: that.data.scheduleName,
        classTime: that.data.classTime,
        classDuration: that.data.classDuration,
        remainQuota: that.data.remainQuota,
      })
    } else if (index >= 0 && arr.length > index) {
      arr[index].scheduleName = that.data.scheduleName;
      arr[index].classTime = that.data.classTime;
      arr[index].classDuration = that.data.classDuration;
      arr[index].remainQuota = that.data.remainQuota;
    }
    that.setData({
      appointList: arr,
      showSuccess: false,
    })
  },
  //编辑本地预约表
  edit: function(e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    let tempArr = that.data.appointList;

    that.setData({
      type:e.currentTarget.dataset.type,
      showSuccess: true,
      popIndex: index,
      scheduleName: item.scheduleName,
      classTime: item.classTime,
      classDuration: item.classDuration,
      remainQuota: item.remainQuota,
    })
  },
  // 本地删除预约表
  delete: function(e) {
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let tempArr = that.data.appointList;
    wx.showModal({
      content: '您确认删除 "' + e.currentTarget.dataset.schedulename + '" 的预约表吗？',
      confirmColor: "#000",
      success: function(res) {
        if (res.confirm) {
          if (tempArr.indexOf(index) == -1) {
            tempArr.splice(index, 1);
          }
          that.setData({
            appointList: tempArr
          })
        }
      }
    })
  },
  // 有效期开始时间
  startChange: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  // 有效期开结束时间
  endChange: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  //改变时间间隔类型
  intervalChange: function(e) {
    this.setData({
      showId: e.currentTarget.dataset.id,
    })
  },
  // showId=1 间隔天数
  intervalInput: function(e) {
    this.setData({
      intervalDays: e.detail.value
    })
  },
  //选中的星期几列表
  weekChange: function(e) {
    let that = this;
    let Id = e.currentTarget.dataset.id;
    let tempArr = that.data.weekList;
    tempArr.forEach(x => {
      if (x.Id == Id) {
        x.check = !x.check
      }
    })
    that.setData({
      weekList: tempArr
    })
    //选中的周几列表
    // weekList.filter(e=>{
    //   return e.check==true;
    // }).map(e=>{
    //   return e.Id;
    // });
  },

  //月份选择天数 
  monthChange: function(e) {
    let that = this;
    let Id = e.currentTarget.dataset.id;
    let tempArr = that.data.monthList;
    tempArr.forEach(item => {
      if (item.Id == Id) {
        item.check = !item.check
      }
    })
    // let arr1 = tempArr.filter(x=>{
    //   return x.check ==true
    // }).map(x=>{
    //   return x.Id
    // })
    // console.log(arr1)
    that.setData({
      monthList: tempArr
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
  //排除日期操作
  exclideAdd: function() {
    let that = this;
    let arr = [];
    that.setData({
      showDateDialog: true,
      excludeDateList1: arr.concat(that.data.excludeDateList)
    })
    console.log(that.data.excludeDateList)
    //1设置总样式为空
    that.resetDate();
    //4.打开弹窗
  },
  resetDate: function() {
    let that = this;
    styleArr = [];
    let dd = new Date();
    if (that.data.currentYear == dd.getFullYear() && that.data.currentMonth == (dd.getMonth() + 1)) {
      styleArr.push({
        month: 'current',
        day: new Date().getDate(),
        color: '#fff',
        background: "#f4f4f4"
      })
    }
    let arr = that.data.excludeDateList1;
    for (let v of arr) {
      let arr1 = v.split('-');
      if (arr1[0] == that.data.currentYear && arr1[1] == that.data.currentMonth) {
        styleArr.push({
          month: 'current',
          day: arr1[2],
          color: '#fff',
          background: "#29D9D6"
        })
      }
    }
    this.edArr = [...arr];
    this.sArr = [...styleArr];
    that.setData({
      dayStyle: styleArr
    })
  },
  //切换下一月份
  next: function(e) {
    let that = this;
    that.setData({
      currentYear: e.detail.currentYear,
      currentMonth: e.detail.currentMonth,
    });
    this.resetDate();
  },
   //切换上一月份
  prev: function(e) {
    let that = this;
    that.setData({
      currentYear: e.detail.currentYear,
      currentMonth: e.detail.currentMonth,
    });
    this.resetDate();
  },
  //年份月份切换
  dateChange: function(e) {
    console.log(e)
    let that = this;
    that.setData({
      currentYear: e.detail.currentYear,
      currentMonth: e.detail.currentMonth,
    });
    this.resetDate();
  },

  //监听点击日历具体某一天的事件
  dayClick: function(e) {
    let that=this;
    let month = e.detail.month;
    if (month < 10) {
      month = '0' + month
    }
    let classDate = e.detail.year + '-' + month + '-' + e.detail.day;
    let arr = this.data.excludeDateList1;
    
    console.log(this.edArr, this.sArr);
    let indexTemp = arr.indexOf(classDate);
    //不存在则添加
    if (indexTemp==-1){
      arr.push(classDate); 
      styleArr.push({
        month: 'current',
        day: e.detail.day,
        color: 'white',
        background: '#29D9D6'
      });
      console.log(styleArr)
    }else{
      arr.splice(indexTemp,1);
      let styleIndex;
      styleArr.forEach((item,index)=>{
        if (item.day == e.detail.day){
          styleIndex = index;
          return;
        }
      });
      styleArr.splice(styleIndex,1);
    }
    that.setData({
      excludeDateList1: arr,
      dayStyle: styleArr
    });
  },

  //关闭排除日期弹窗
  excludeDateCancel: function() {
    styleArr = this.sArr;
    this.setData({
      showDateDialog: false,
      excludeDateList1: this.edArr,
      // excludeDateList: this.edArr,
      dayStyle: this.sArr,
    })
  },
  //确定添加排除日期
  excludeDateSure: function() {
    this.setData({
      showDateDialog: false,
      excludeDateList: this.data.excludeDateList1
    })
  },
  //删除排除日期
  deleteDate: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let tempArr = that.data.excludeDateList;
    if (tempArr.indexOf(index) == -1) {
      tempArr.splice(index, 1);
    }
    that.setData({
      excludeDateList:tempArr
    })
  },
  //确认添加
  btnClick:function() {
    let that = this;
    var url = 'account/storeitem/schedule/batch/add';
    if (!that.data.bathName){
      wx.showToast({
        icon:"none",
        title: '请给预约表输入名称，不可重复',
      })
      return;
    }
    if (that.data.appointList.length<=0){
      wx.showToast({
        icon: "none",
        title: '请添加预约表',
      })
      return;
    }
    if (!that.data.startTime){
      wx.showToast({
        icon:"none",
        title: '请选择有效期的开始时间',
      })
      return;
    }
    if (!that.data.endTime){
      wx.showToast({
        icon:"none",
        title: '请选择有效期的结束时间',
      })
      return;
    }
    if (that.data.showId == 1 && !that.data.intervalDays) {
      wx.showToast({
        icon: "none",
        title: '请输入间隔天数',
      })
      return;
    }
    var params = {
      StoreId:that.data.storeId,
      ItemId:that.data.itemId,
      BatchName:that.data.bathName,
      BatchStartTime:that.data.startTime + ' 00:00:00',
      BatchEndTime: that.data.endTime + ' 00:00:00',
      List:that.data.appointList,
      IntervalType:that.data.showId,
      IntervalDays: that.data.showId == 1 ? that.data.intervalDays:'',
      WeekList:that.data.showId == 2? that.data.weekList.filter(e=>{
        return e.check==true;
      }).map(e=>{
        return e.Id
      }) : [],
      MonthList:that.data.showId == 3 ? that.data.monthList.filter(e=>{
        return e.check == true;
      }).map(e=>{
        return e.Id
      }) : [],
      ExcludeDateList: that.data.excludeDateList
    }
    netUtil.postRequest(url, params, function (res) {
      wx.showModal({
        title: '添加成功',
        confirmText:"知道了",
        showCancel:false,
        confirmColor:"#000",
        success:function(e){
          if (e.confirm) {
            let pages = getCurrentPages();
            let befoPage = pages[pages.length - 2];
            befoPage.init();
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    });
  },
  onShareAppMessage: function() {

  }
})