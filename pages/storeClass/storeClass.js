var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    storeId: '', //门店Id
    storeItemList: [], //门店课程列表
    sellerItemList: [], //商户课程列表
    IsAdministrator: '', //是否管理员
    checkedArr: [], //分配课程勾选
    showLog: false, //分配课程弹出框
    showTag: false, //分配课程标签弹出框
    storeItemTagList: [], //门店课程标签
    tagItemList: [], //获取所有标签列表
    checkedArr1: [], //标签选择
    itemId: '', //项目Id
    name:'',//项目名称
    showTeacher: false, //门店师资弹窗
    checkedArr2: [], //选择的课程师资
    storeItemTeacherList: [], //获取所有课程师资
    storeTeacherList: [], //门店师资列表
    move:false,//是否滚动屏幕
  },
  onLoad: function(options) {
    let IsAdministrator = wx.getStorageSync('userInfo').IsAdministrator;
    this.setData({
      IsAdministrator: IsAdministrator,
      storeId: options.Id || ''
    })
    this.init();
  },
  init: function() {
    this.getStoreItemList();
  },
  //获取门店课程列表
  getStoreItemList: function() {
    let that = this;
    var url = 'account/storeitem/list';
    var params = {
      Id: that.data.storeId
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        storeItemList: res.Data
      })
    });
  },
  //获取商户课程列表
  getSellerItemList: function() {
    let that = this;
    var url = 'account/selleritem/list';
    var params = {
      PageCount: 100,
      PageIndex: 1,
      Status: 1
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data.length > 0) {
        res.Data.forEach(item => {
          let tempArr = that.data.storeItemList.filter(e => {
            return e.ItemId === item.ItemId;
          });
          if (tempArr.length > 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        that.setData({
          sellerItemList: res.Data,
          checkedArr: res.Data.filter(e => {
            return e.checked == true;
          }).map(e=>{
            return e.ItemId
          }),
          showLog: true,
          move:true
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '暂无可分配课程',
        })
      }
    })
  },
  //获取所有标签列表
  getTagItemList: function() {
    let that = this;
    var url = 'account/tag/list';
    var params = {}
    netUtil.postRequest(url, params, function(res) {
      if (res.Data.length > 0) {
        res.Data.forEach(item => {
          let tempArr = that.data.storeItemTagList.filter(e => {
            return e.TagId === item.TagId;
          });
          if (tempArr.length > 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        that.setData({
          tagItemList: res.Data,
          checkedArr1: res.Data.filter(e => {
            return e.checked == true;
          }).map(e=>{
            return e.TagId
          }),
          showTag: true,
          move:true,
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '暂无可分配标签',
        })
      }
    })
  },
  //门店师资
  getStoreTeacherList: function() {
    let that = this;
    var url = 'account/storeteacher/list';
    var params = {
      Id: this.data.storeId
    }
    netUtil.postRequest(url, params, function(res) {
      if (res.Data.length > 0) {
        res.Data.forEach(item => {
          let tempArr = that.data.storeItemTeacherList.filter(e => {
            return e.Id === item.Id;
          });
          if (tempArr.length > 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        that.setData({
          storeTeacherList: res.Data,
          checkedArr1: res.Data.filter(e => {
            return e.checked == true;
          }).map(e=>{
            return e.Id
          }),
          showTeacher: true,
          move:true
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '暂无可分配师资',
        })
      }
    })
  },
  //错误弹窗
  clickEor: function(e) {
    wx.showModal({
      title: '审核失败',
      content: '失败原因' + e.currentTarget.dataset.content,
      showCancel: false,
      cancelText: '知道了',
      success: function() {

      }
    })
  },
  //编辑
  edit: function(e) {
    let that = this;
    that.setData({
      itemId: e.currentTarget.dataset.id, //项目Id
      name: e.currentTarget.dataset.name, //项目name
    })
    wx.showActionSheet({
      itemList: ['活动组','课程师资', '课程标签'],
      success: function(e) {
        if (e.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/groupClass/groupClass?id=' + that.data.itemId + '&storeId=' + that.data.storeId+'&name='+that.data.name,
          })
        }
        if (e.tapIndex == 1) {
          that.getStoreItemTeacherList();
        }
        if (e.tapIndex == 2) {
          that.getStoreTagList();

        }
        if (e.tapIndex == 3) {

        }
      }
    })
  },

  //取消分配
  bindCancel: function() {
    this.setData({
      showLog: false,
      move:false
    })
  },
  //分配门店课程
  bindSure: function() {
    let that = this;
    var url = 'account/storeitem/set';
    var params = {
      StoreId: that.data.storeId,
      ItemIdList: that.data.checkedArr
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        showLog: false,
        move:false
      })
      wx.showToast({
        icon: 'none',
        title: '已分配完成',
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
  //分配课程
  fenpei: function() {
    this.getSellerItemList();
  },
  //课程标签选择
  checkedChange1: function(e) {
    this.setData({
      checkedArr1: e.detail.value
    })
  },
  //门店课程标签 
  getStoreTagList: function() {
    let that = this;
    var url = 'account/storeitem/tag/list';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        storeItemTagList: res.Data
      })
      that.getTagItemList();
    });
  },
  //分配课程标签
  tagSure: function() {
    let that = this;
    var url = 'account/storeitem/tag/set';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      TagIdList: that.data.checkedArr1
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        showTag: false,
        move:false
      })
      wx.showToast({
        icon: 'none',
        title: '已分配完成',
      })
      that.init();
    })
  },
  //关闭选择标签弹窗
  tagCancel: function() {
    this.setData({
      showTag: false,
      move: false
    })
  },
  //选择课程师资
  checkedChange2: function(e) {
    this.setData({
      checkedArr2: e.detail.value
    })
  },
  //门店项目师资
  getStoreItemTeacherList: function() {
    let that = this;
    var url = 'account/storeitem/teacher/list';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        storeItemTeacherList: res.Data
      })
      that.getStoreTeacherList();
    });
  },

  //分配门店项目师资
  teacherSure: function() {
    let that = this;
    var url = 'account/storeitem/teacher/set';
    var params = {
      StoreId: that.data.storeId,
      ItemId: that.data.itemId,
      TeacherIdList: that.data.checkedArr2
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        showTeacher: false,
        move: false
      })
      wx.showToast({
        icon: 'none',
        title: '已分配完成',
      })
      that.init();
    })
  },
  //关闭选择门店项目师资
  teacherCancel: function() {
    this.setData({
      showTeacher: false,
      move: false
    })
  },
  onPullDownRefresh: function() {
    this.init();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function() {

  },

})