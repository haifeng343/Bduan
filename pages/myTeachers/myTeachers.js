var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    Id: '',
    items: [],
    IsAdministrator: '',
    name:'',
    status:'',
    pageCount:20,
    page:1,
  },
  onLoad: function(options) {
    let IsAdministrator = wx.getStorageSync('userInfo').IsAdministrator;
    this.setData({
      IsAdministrator: IsAdministrator,
    })
    this.init();
  },
  init: function() {
    let that = this;
    var url = 'account/sellerteacher/list';
    var params = {
      Status: 0,
      PageCount:that.data.pageCount,
      PageIndex: that.data.page
    }
    netUtil.postRequest(url, params, function(res) {
      that.setData({
        items: res.Data
      })
    });
  },
  //编辑
  edit: function(e) {
    let that = this;
    this.setData({
      Id: e.currentTarget.dataset.id,
      name:e.currentTarget.dataset.name,
      status: e.currentTarget.dataset.status
    })
    wx.showActionSheet({
      itemList: (that.data.status == 2 || that.data.status == 4) ? ['师资图片', '刪除'] : ['编辑', '师资图片', '刪除'],
      success: function(e) {
        if (e.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/addTeacher/addTeacher?id=' + that.data.Id,
          })
        }
        if (e.tapIndex == 1) {
          wx.navigateTo({
            url: '',
          })
        }
        if (e.tapIndex == 2) {
          wx.showModal({
            title: '确认删除 ' + that.data.name + ' 老师？',
            content: '',
            success: function(res) {
              if (res.confirm) {
                var url = 'account/sellerteacher/delete';
                var params = {
                  Id: that.data.Id
                }
                netUtil.postRequest(url, params, function(res) {
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
  bindAddTeacher: function() {
    wx.navigateTo({
      url: '/pages/addTeacher/addTeacher',
    })
  },
  onPullDownRefresh: function() {
    this.init();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function() {

  },

})