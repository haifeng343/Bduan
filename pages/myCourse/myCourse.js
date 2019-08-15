var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    Id: '',
    items: [],
    IsAdministrator: '',
    name:'',
    pageCount:20,
    page:1,
    status:'',
  },
  onLoad: function () {
    let IsAdministrator = wx.getStorageSync('userInfo').IsAdministrator;
    this.setData({
      IsAdministrator: IsAdministrator
    })
    this.init();
  },
  init: function () {
    let that = this;
    var url = 'account/selleritem/list';
    var params = {
      Status: 0,
      PageCount:that.data.pageCount,
      PageIndex: that.data.page
    }
    netUtil.postRequest(url, params, function (res) {
      let arr = res.Data;
      let arr1 = that.data.items;
      if (that.data.page == 1) {
        arr1 = arr
      } else {
        arr1 = arr1.concat(arr);
      }
      that.setData({
        items: arr1
      })
    });
  },
  //错误弹窗
  clickEor: function (e) {
    wx.showModal({
      title: '审核失败',
      content: '失败原因' + e.currentTarget.dataset.content,
      showCancel: false,
      cancelText: '知道了',
      success: function () {

      }
    })
  },
  //编辑
  edit: function (e) {
    let that = this;
    this.setData({
      Id: e.currentTarget.dataset.id,
      name:e.currentTarget.dataset.name,
      status: e.currentTarget.dataset.status
    });
    let state = that.data.status == 2;
    wx.showActionSheet({
      itemList: state ? ['课程图片', '刪除'] : ['课程图片', '编辑', '刪除'],
      success: function (e) {
        if (state) {
          if (e.tapIndex == 0) {
            fn2();
          }
          if (e.tapIndex == 1) {
            fn3();
          }
        } else {
          if (e.tapIndex == 0) {
            fn2();
          }
          if (e.tapIndex == 1) {
            fn1();
          }
          if (e.tapIndex == 2) {
            fn3();
          }
        }

        function fn1() {
          wx.navigateTo({
            url: '/pages/addCourse/addCourse?id=' + that.data.Id,
          })
        }
        function fn2() {
          wx.navigateTo({
            url: '/pages/courseImg/courseImg?id=' + that.data.Id,
          })
        }
        function fn3() {
          wx.showModal({
            title: '确认删除课程 ' + that.data.name + ' 吗？',
            content: '',
            success: function (res) {
              if (res.confirm) {
                var url = 'account/selleritem/delete';
                var params = {
                  Id: that.data.Id
                }
                netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
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
  bindAddTeacher: function () {
    wx.navigateTo({
      url: '/pages/addCourse/addCourse',
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    this.init();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    let temp = this.data.page;
    temp++;
    this.setData({
      page: temp
    })
    this.init();
  },
  onShareAppMessage: function () {

  },

})