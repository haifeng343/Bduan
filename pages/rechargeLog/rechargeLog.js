var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    date: '', //不填写默认今天日期，填写后是默认日期
    dataStart: '', //有效日期
    dataEnd: '', //
    storeId: '', //门店Id
    pagecount: 20,
    page: 1,
    year: '全部',
    date2: [],
    month: '全部',
    array: [],
    statusdes: '',
    List: [],
    showEor: false,
    status: '', //1门店 2商家
    name:'',
  },
  initPicker: function() {
    var date = new Date();
    let arr = [],
      arr1 = [];

    var year = date.getFullYear();
    arr.push('全部');
    for (var i = year; i > 1970; i--) {
      arr.push(i)
    }

    arr1 = ['全部', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    this.setData({
      array: [arr, arr1],
      now: (this.data.year == '全部' && this.data.month == '全部') ? '全部' : (this.data.year + '-' + this.data.month),
      date2: [arr.indexOf(this.data.year), arr1.indexOf(this.data.month + '')],
    })
  },
  onLoad: function(options) {
    this.setData({
      storeId: options.storeId || '',
      status: options.status || '',
      name:options.name || '',
    })
    if(this.data.status==1){
      wx.setNavigationBarTitle({
        title: '充值记录-'+this.data.name,
      })
    }
    if(this.data.status==2){
      wx.setNavigationBarTitle({
        title: '充值记录-商家',
      })
    }
    this.initPicker();
    this.init();
  },
  init: function() {
    this.getData();
  },
  getData: function() {
    let that = this;
    var url = 'recharge/record/list';
    var params = {
      StoreId: that.data.storeId,
      Year: that.data.year,
      Month: that.data.month,
      PageCount: that.data.pagecount,
      PageIndex: that.data.page,
      StoreType: that.data.status
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let arr = res.Data;
      var arr1 = [];
      arr.forEach(item => {
        item.RechargeAmount = Number(item.RechargeAmount / 100).toFixed(2)
      })
      if (that.data.page == 1) {
        arr1 = arr;
      } else {
        arr1 = that.data.List;
        arr1 = arr1.concat(res.Data);
      }
      that.setData({
        List: arr1
      })
    })
  },
  bindDateChange: function(e) {

    let index = e.detail.value;
    if (index[0] == 0 && index[1] == 0) {
      this.setData({
        date: '全部',
        year: '全部',
        month: '全部',
        page: 1,
      })
    } else {
      this.setData({
        date: this.data.array[0][index[0]] + '-' + this.data.array[1][index[1]],
        year: this.data.array[0][index[0]],
        month: this.data.array[1][index[1]],
        page: 1,
      })
    }
    this.getData();
  },
  bindShowEor: function(e) {
    wx.showModal({
      title: '验券失败',
      content: '失败原因:',
      cancelColor: '#29d9d6',
      showCancel: false,
      cancelText: '知道了',
      success: function(res) {

      }
    })
  },
  closeds: function() {
    this.setData({
      showEor: false
    })
  },
  //上拉加载更多
  onReachBottom: function() {
    let that = this;
    wx.showLoading({
      title: '玩命加载中',
    });
    var temp_page = this.data.page;
    temp_page++;
    this.setData({
      page: temp_page
    });
    that.getData();

  },
  //下拉刷新
  onPullDownRefresh: function() {
    wx.showLoading({
      title: "玩命加载中",
    });
    this.setData({
      page: 1
    });
    this.getData();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function() {

  }
})