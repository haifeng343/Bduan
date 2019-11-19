var netUtil = require("../../utils/request.js"); //require引入
Page({
  data: {
    date: '', //不填写默认今天日期，填写后是默认日期
    dataStart: '', //有效日期
    dataEnd: '', //
    pagecount: 20,
    page: 1,
    year: '全部',
    date2: [],
    month: '全部',
    array: [],
    statusdes: '',
    List: [],
    showSelect: false, //是否显示门店弹窗
    storeList: [], //门店列表
    showId: 0, //选中门店下标
    storeName: "全部门店", //默认
    recordId:"",
    status:'',
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
  onLoad: function() {
    this.initPicker();
    this.init();
    this.getStore();
  },

  onChangeStatus: function (recordId, status) {
    console.log(recordId + "___" + status);

    let that = this;
    let tempArr = that.data.List;
    tempArr.forEach(item=>{
      if (item.RecordId==recordId){
        item.Status=status;
        return;
      }
    })
    that.setData({
      List: tempArr
    })
  },

  //获取所有门店列表
  getStore: function() {
    let that = this;
    var url = 'account/store/list';
    var params = {}
    netUtil.postRequest(url, params, function(res) {
      let arr = res.Data;
      arr.unshift({
        StoreId: 0,
        StoreName: "全部门店"
      })

      that.setData({
        storeList: arr
      })
    })
  },

  //弹出门店下拉选择
  changeSelect: function() {
    this.setData({
      showSelect: true
    })
  },

  //点击全部门店
  allStore: function() {
    this.setData({
      storeId: 0,
      storeName: '全部门店',
      showSelect: false
    })
  },

  //更换门店
  changeStore: function(e) {
    let that = this;
    that.setData({
      showId: e.currentTarget.dataset.id,
      storeId: e.currentTarget.dataset.id,
      storeName: e.currentTarget.dataset.name,
      showSelect: false
    })

    this.getData();
  },

  init: function() {
    this.getData();
  },

  getData: function() {
    let that = this;
    var url = 'account/basesubsidy/record/list';
    var params = {
      Year: that.data.year,
      Month: that.data.month,
      StoreId: that.data.showId,
      PageCount: that.data.pagecount,
      PageIndex: that.data.page
    }
    netUtil.postRequest(url, params, function(res) { //onSuccess成功回调
      let arr = res.Data;
      var arr1 = [];
      arr.forEach(item => {
        item.Amount = Number(item.Amount / 100).toFixed(2)
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
    }, null, true, true, true, true);
  },

  getCode: function(e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/qrClassPage/qrClassPage?TempResult=' + JSON.stringify(item) +'&fromRecord=true',
    })
  },

  bindDateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value;
    if (index[0] == 0 && index[1] == 0) {
      this.setData({
        date: '全部',
        year: '全部',
        month: '全部',
        page: 1
      })
    } else {
      this.setData({
        date: this.data.array[0][index[0]] + '-' + this.data.array[1][index[1]],
        year: this.data.array[0][index[0]],
        month: this.data.array[1][index[1]],
        page: 1
      })
    }

    this.getData();
  },

  //上拉加载更多
  onReachBottom: function() {
    let that = this;
    var temp_page = this.data.page;
    temp_page++;
    this.setData({
      page: temp_page
    });

    that.getData();
  },

  //下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      page: 1
    });
    
    this.getData();
  },

  onShareAppMessage: function() {
  }
})