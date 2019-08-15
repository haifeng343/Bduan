var netUtil = require("../../utils/request.js"); //require引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    status:'订单号搜索',
    show:false,
    List:[],
    pageCount:20,
    page:1,
    showHistory:true,
    searchRecord:[],//缓存
    Id:'',
    name:'',
  },
  onLoad:function(options) {
    this.setData({
      Id:options.id || '',
      name:options.name || '',
    })
    if(this.data.name){
      wx.setNavigationBarTitle({
        title: '搜索 - '+this.data.name,
      })
    }
  },
  init: function () {
    this.search();
  },
  hideFixed:function() {
    this.setData({
      show:false
    })
  },
  //取本地缓存的搜索历史
  getSearch: function () {
    this.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [], //若无缓存取空
    })
  },
  //清空输入框
  clear: function () {
    this.setData({
      value: '',
      showHistory: true,
    })
    this.getSearch();
  },
  bindSearch:function(e){
    this.setData({
      value : e.detail.value
    })
    if(e.detail.cursor == 0){
      this.getSearch();
    }
    if(e.detail.value){
      this.setData({
        List: [],
        showHistory:true,
      })
    }
  },
  changeVal:function() {
    this.setData({
      show: !this.data.show
    })
  },
  change1:function() {
    this.setData({
      status: '订单号搜索',
      show:false,
      value:'',
    })
  },
  change2:function() {
    this.setData({
      status: '账户名搜索',
      show: false,
      value: '',
    })
  },
  //点击历史记录
  searchTo: function (e) {
    console.log(e)
    this.setData({
      value: e.currentTarget.dataset.item.value,
      showHistory: false
    })
    this.search();
  },
  //点击搜索
  search: function () {
    let that = this;
    var url = 'order/list';
    let inputVal = that.data.value;
    let searchRecord = that.data.searchRecord;
    var params = {
      OrderSn: that.data.status == '订单号搜索' ? that.data.value:'',
      BuyAccountName: that.data.status == '账户名搜索' ? that.data.value : '',
      SheetId: that.data.Id=="" ? 0 : that.data.Id,
      PageCount: that.data.pageCount,
      PageIndex: that.data.page,
    }
    if (that.data.value == '') {
      wx.showToast({
        icon: 'none',
        title: "请输入搜索内容"
      })
      return;
    }

    for (let item of searchRecord) {
      if (item.value == inputVal) {
        var indexTemp = searchRecord.indexOf(item);
        searchRecord.splice(indexTemp, 1);
        break;
      }
    }
    if (searchRecord.length > 20) {
      searchRecord.pop()
    }
    searchRecord.unshift({
      value: inputVal,
      id: searchRecord.length
    })
    wx.setStorageSync('searchRecord', searchRecord);

    netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
      let arr = that.data.List;
      wx.setStorageSync('search', that.data.value);
      let arr1 = res.Data;
      if(that.data.page==1){
        arr = arr1
      }else{
        arr = arr.concat(arr1)
      }
      that.setData({
        List:arr
      })
      if (that.data.List.length <= 0) {
        wx.showToast({
          icon: 'none',
          title: '暂无相关信息',
        })
      }
    }); //调用get方法情就是户数
  },
  //删除历史搜索
  deleteHistory: function () {
    wx.removeStorageSync('searchRecord');
    this.setData({
      searchRecord: [],
    })
  },
  getData: function () {
    let that = this;
    var url = 'order/list';
    var params = {
      OrderSn: '',
      BuyAccountName: '',
      SheetId: '',
      PageCount: that.data.pageCount,
      PageIndex: that.data.page,
    }
    netUtil.postRequest(url, params, function (res) {
      let arr = res.Data;
      let arr1 = [];
      if (that.data.page == 1) {
        arr1 = arr
      } else {
        arr1 = that.data.List;
        arr1 = arr1.concat(res.Data)
      }
      that.setData({
        List: arr1,
      })
    })
  },
  bindDetail: function (e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
    })
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

  }
})