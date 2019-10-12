var netUtil = require("../../utils/request.js"); //require引入
Page({
  data: {
    storeId:"",//门店Id
    itemId:"",//项目Id
    title:'',//标题
    content:'',//内容
    Id:"",//编辑

  },
  
  onLoad: function (options) {
    this.setData({
      storeId: options.storeId || '',
      itemId: options.itemId || '',
      Id: options.Id || '',
      title:options.title || '',
      content: options.content || '',
    })
    if(this.data.Id){
      wx.setNavigationBarTitle({
        icon:"none",
        title: '编辑额外信息',
      })
    }
  },
  hasTitle:function(e){
    console.log(e)
    this.setData({
      title:e.detail.value
    })
  },
  hasContent:function(e){
    console.log(e)
    this.setData({
      content:e.detail.value
    })
  },
  //确认按钮点击
  btnClick:function() {
    if (this.data.Id) {
      this._modifyExtra();
    } else {
      this._addExtra();
    }
  },
  _addExtra:function() {
    let that = this;
    var url = 'account/storeitem/othercontent/add';
    if (!that.data.title){
      wx.showToast({
        icon:"none",
        title: '请输入信息名称',
      })
      return false;
    }
    if (!that.data.content){
      wx.showToast({
        icon:"none",
        title: '请输入信息内容',
      })
      return false;
    }
    var params = {
      StoreId:that.data.storeId,
      ItemId: that.data.itemId,
      Title: that.data.title,
      Content: that.data.content,
    }
    netUtil.postRequest(url, params, function (res) {
      wx.showModal({
        title: '添加成功',
        showCancel:false,
        confirmColor:'#000',
        confirmText:"确定",
        success:function(){
          let pages = getCurrentPages();
          let beforePage = pages[pages.length-2];
          beforePage.init();
          wx.navigateBack({
            delta:1
          })
        },
      })
    });
  },
  _modifyExtra: function () {
    let that = this;
    var url = 'account/storeitem/othercontent/modify';
    if (!that.data.title) {
      wx.showToast({
        icon: "none",
        title: '请输入信息名称',
      })
      return false;
    }
    if (!that.data.content) {
      wx.showToast({
        icon: "none",
        title: '请输入信息内容',
      })
      return false;
    }
    var params = {
      Id: that.data.Id,
      Title: that.data.title,
      Content: that.data.content,
    }
    netUtil.postRequest(url, params, function (res) {
      wx.showModal({
        title: '编辑成功',
        showCancel: false,
        confirmColor: '#000',
        confirmText: "确定",
        success: function () {
          let pages = getCurrentPages();
          let beforePage = pages[pages.length - 2];
          beforePage.init();
          wx.navigateBack({
            delta: 1
          })
        },
      })
    });
  },
  onShareAppMessage: function () {

  }

})