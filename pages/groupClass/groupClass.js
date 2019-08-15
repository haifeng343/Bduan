const netUtil = require('../../utils/request.js');
Page({

  data: {
    IsAdministrator: '',
    storeId: '', //门店Id,
    itemId: '', //项目Id
    activityGroupId: '', //活动组Id
    groupList: [], //活动组列表
    page: 1, //页码数
    pageCount: 20, //每页条数
    showDetail: false, //参与详情弹窗
    showLog: false, //选择活动组弹窗弹窗
    money: '', //课程原价
    number: '', //课程数量
    timer: '', //单节课时
    relief: '', //成交后减免
    purchase: '', //单人购买数量
    people: '', //预计招生人数
    confimText: '确认', //弹窗确认的文字和事件
    Item: {}, //项目详情
    name: '', //穿过来的课程名称
    peoText:'',//预计剩余招生人数
  },

  onLoad: function(options) {
    console.log(options)
    let IsAdministrator = wx.getStorageSync('userInfo').IsAdministrator;
    this.setData({
      IsAdministrator: IsAdministrator,
      storeId: options.storeId || '',
      itemId: options.id || '',
      name: options.name
    })
    wx.setNavigationBarTitle({
      title: '活动组-' + options.name,
    })
    this.init();
  },
  init: function() {
    var that = this;
    //获取项目全部师资信息
    var url = 'account/storeitem/activitygroup/list';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      Type: 1,
      PageCount: that.data.pageCount,
      PageIndex: that.data.page,
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调、
      let arr = res.Data;
      let arr1 = that.data.groupList;
      if (that.data.page == 1) {
        arr1 = arr
      } else {
        arr1 = arr1.concat(arr);
      }
      that.setData({
        groupList: arr1
      })
    });
  },
  bindDetailSure: function() {
    if (this.data.money == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入课程原价',
      });
      return false;
    }
    if (this.data.number == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入课程数量',
      });
      return false;
    }
    if (this.data.timer == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入课程单节课时',
      });
      return false;
    }
    if (this.data.relief == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入课程成交后减免',
      });
      return false;
    }
    if (this.data.purchase == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入课程单人购买数量',
      });
      return false;
    }
    if (this.data.people == '') {
      if (this.data.peoText == '剩余招生人数') {
        wx.showToast({
          icon: 'none',
          title: '请输入剩余招生人数',
        });
        return false;
      }
      if (this.data.peoText == '预计招生人数') {
        wx.showToast({
          icon: 'none',
          title: '请输入剩余预计人数',
        });
        return false;
      }
    }
    if (this.data.confimText == '下一步') {
      this.setData({
        showDetail: false,
      })
      this.getGroupList();
    } else { //执行参与详情的设置
      this.modify();
    }
  },
  //修改门店课程参与到活动组详情
  modify: function() {
    let that = this;
    var url = 'account/storeitem/activitygroup/modify';
    var params = {
      RelId: that.data.Item.RelId,
      Price: that.data.money * 100,
      CoursesNumber: that.data.number,
      SingleTime: that.data.timer,
      Reduction: that.data.relief * 100,
      MaxBuyCount: that.data.purchase,
      RemainNumber:that.data.people
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showToast({
        icon: 'none',
        title: '修改成功',
      })
      that.setData({
        showDetail: false
      })
    })
  },
  onPullDownRefresh: function() {
    this.setData({
      page: 1
    });
    this.init();
    wx.stopPullDownRefresh();
  },
  //上拉刷新
  onReachBottom: function() {
    let temp = this.data.page;
    temp++
    this.setData({
      page: temp
    })
    this.init();
    wx.stopPullDownRefresh();
  },
  //编辑
  edit: function(e) {
    let that = this;
    that.setData({
      activityGroupId: e.currentTarget.dataset.id, //项目Id
      Item: e.currentTarget.dataset.item, //项目
    })
    wx.showActionSheet({
      itemList: ['去招生', '参与详情', '删除'],
      success: function(e) {
        if (e.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/enrollment/enrollment?rellId=' + that.data.Item.RelId + '&name=' + that.data.name,
          })
        }
        if (e.tapIndex == 1) {
          that.setData({
            showDetail: true,
            confimText: '确定',
            peoText:'剩余招生人数',
            money: Number(that.data.Item.Price / 100),
            number: that.data.Item.CoursesNumber,
            timer: that.data.Item.SingleTime,
            people: that.data.Item.RemainNumber,
            relief: Number(that.data.Item.Reduction / 100),
            purchase: that.data.Item.MaxBuyCount,
          })
        }
        if (e.tapIndex == 2) {
          wx.showModal({
            title: '确认删除 ' + that.data.Item.ActivityGroupName + ' ？',
            content: '',
            success: function(res) {
              if (res.confirm) {
                var url = 'account/storeitem/activitygroup/delete';
                var params = {
                  Id: that.data.Item.RelId
                }
                netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
                  wx.showToast({
                    icon: "none",
                    title: '删除成功',
                  });
                  that.init();
                });
              }
            }
          })
        }
      }
    })
  },
  //课程原价
  hasMonry: function(e) {
    this.setData({
      money: e.detail.value
    })
  },
  //单节课时
  hasTimer: function(e) {
    this.setData({
      timer: e.detail.value
    })
  },
  //单人购买数量
  hasNumber: function(e) {
    this.setData({
      number: e.detail.value
    })
  },
  //成交后减免
  hasRelief: function(e) {
    this.setData({
      relief: e.detail.value
    })
  },
  //单人购买数量
  hasPurchase: function(e) {
    this.setData({
      purchase: e.detail.value
    })
  },
  //预计招生人数
  hasPeople: function(e) {
    this.setData({
      people: e.detail.value
    })
  },
  //关闭参与详情弹窗
  bindDetail: function() {
    this.setData({
      showDetail: false,
      money: '',
      number: '',
      timer: '',
      relief: '',
      purchase: '',
      people:'',
    })
  },
  //下一步，获取可参与活动组列表
  getGroupList: function() {
    let that = this;
    var url = 'account/storeitem/activitygroup/list';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      PageCount: 100,
      PageIndex: 1,
      Status: 2
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data.length > 0) {
        res.Data.forEach(item => {
          let tempArr = that.data.groupList.filter(e => {
            return e.ActivityGroupId === item.ActivityGroupId;
          });
          if (tempArr.length > 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        that.setData({
          canGroupList: res.Data,
          checkedArr: res.Data.filter(e => {
            return e.checked == true;
          }),
          showLog: true
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '暂无可参与活动组',
        })
      }
    })
  },
  //关闭活动组
  bindCancel: function() {
    this.setData({
      showLog: false,
      money: '',
      number: '',
      timer: '',
      relief: '',
      purchase: '',
      people:'',
    })
  },
  //门店课程参与到活动组
  bindSure: function() {
    let that = this;
    var url = 'account/storeitem/activitygroup/add';
    var params = {
      Price: that.data.money * 100,
      CoursesNumber: that.data.number,
      SingleTime: that.data.timer,
      Reduction: that.data.relief * 100,
      MaxBuyCount: that.data.purchase,
      ActivitygroupList: that.data.checkedArr,
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      MaxNumber:that.data.people
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        showLog: false,
        money: '',
        number: '',
        timer: '',
        relief: '',
        purchase: '',
        people: '',
      })
      wx.showToast({
        icon: 'none',
        title: '门店课程已添加到活动组',
      })
      that.init();
    })
  },
  //课程选择
  checkedChange: function(e) {
    this.setData({
      checkedArr: e.detail.value
    })
  },
  //参加活动
  addActive: function() {
    this.setData({
      showDetail: true,
      confimText: '下一步',
      peoText:'预计招生人数',
    })
  },
  onShareAppMessage: function() {

  }
})