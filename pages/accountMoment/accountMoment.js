var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    Id:'',
    List:[],
    IsAdministrator:'',//是否为管理员
    AdminPower: '',//是否为超级管理员
    name:'',
    pageCount:20,
    page:1,
  },
  onLoad:function(){
    let IsAdministrator = wx.getStorageSync('userInfo').IsAdministrator;
    let AdminPower = wx.getStorageSync('userInfo').AdminPower
    this.setData({
      IsAdministrator: IsAdministrator,
      AdminPower: AdminPower
    })
    this.init();
  },
  init: function () {
    let that = this;
    var url = 'account/selleraccount/list';
    var params = {
      PageCount:that.data.pageCount,
      PageIndex:that.data.page,
    }
    netUtil.postRequest(url, params, function (res) {
      let arr = res.Data;
      let arr1 = that.data.List;
      if (that.data.page == 1) {
        arr1 = arr
      } else {
        arr1 = arr1.concat(arr);
      }
      that.setData({
        List: arr1
      })
    }, null, true, true, true, true);
  },
  //编辑
  edit: function (e) {
    let that = this;
    this.setData({
      Id : e.currentTarget.dataset.id,
      name:e.currentTarget.dataset.name
    })
    wx.showActionSheet({
      itemList: ['修改密码','编辑','删除'],
      success: function (e) {
        if (e.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/modifyPassword/modifyPassword?id=' + that.data.Id,
          })
        }
        if (e.tapIndex == 1) {
          wx.navigateTo({
            url: '/pages/addAccount/addAccount?id='+that.data.Id,
          })
        }
        if (e.tapIndex == 2) {
          wx.showModal({
            title: '确认删除账户  '+that.data.name+' 吗？',
            content: '',
            success:function(res) {
              if(res.confirm){
                var url = 'account/selleraccount/delete';
                var params = {
                  Id: that.data.Id
                }
                netUtil.postRequest(url, params, function (res) {
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
  bindAddAccount:function() {
    wx.navigateTo({
      url: '/pages/addAccount/addAccount',
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    this.init();
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