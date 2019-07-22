// var netUtil = require("../../utils/request.js"); //require引入
Page({

  data: {
    date: '', //不填写默认今天日期，填写后是默认日期
    dataStart: '', //有效日期
    dataEnd: '', //
    pagecount: 20,
    page: 1,
    year: '',
    month: '',
    array: [],
    statusdes: '',
    List: [],
    showEor:false,
  },
  onShow: function () {
    var date = new Date();
    let arr = [],
      arr1 = [];
    this.setData({
      year: date.getFullYear(),
      month: date.getMonth() + 1
    })

    var year = date.getFullYear();
    arr.push('全部');
    for (var i = year; i > 1970; i--) {
      arr.push(i)
    }
    arr1 = ['全部', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    this.setData({
      array: [arr, arr1],
      now: this.data.month + '月'
    })
    // this.getData();
  },
  onLoad: function () { },
  // getData: function () {
  //   let that = this;
  //   var url = 'user/cash/record/list';
  //   var params = {
  //     Year: that.data.year,
  //     Month: that.data.month,
  //     PageCount: that.data.pagecount,
  //     PageIndex: that.data.page
  //   }
  //   netUtil.postRequest(url, params, function (res) { //onSuccess成功回调
  //     let arr = res.Data;
  //     var arr1 = [];
  //     arr.forEach(item => {
  //       item.Amount = Number(item.Amount / 100).toFixed(2)
  //     })
  //     if (that.data.page == 1) {
  //       arr1 = arr;
  //     } else {
  //       arr1 = that.data.List;
  //       arr1 = arr1.concat(res.Data);
  //     }
  //     that.setData({
  //       List: arr1
  //     })
  //     wx.hideLoading();
  //   }, function (msg) { //onFailed失败回调
  //     wx.hideLoading();
  //     if (msg) {
  //       wx.showToast({
  //         title: msg,
  //       })
  //     }
  //   }); //调用get方法情就是户数
  // },
  bindDateChange: function (e) {
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
    // this.getData();
  },
  bindShowEor: function () {
    this.setData({
      showEor: true
    })
  },
  closeds: function () {
    this.setData({
      showEor: false
    })
  },
  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title: '玩命加载中',
    });
    var temp_page = this.data.page;
    temp_page++;
    this.setData({
      page: temp_page
    });
    // that.getData();

  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: "玩命加载中",
    });
    this.setData({
      page: 1
    });
    // this.getData();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function () {

  }
})