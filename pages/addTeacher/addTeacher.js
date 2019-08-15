var netUtil = require("../../utils/request.js"); //require引入
const app = getApp().globalData;
const baseUrl = app.baseUrl;
Page({
  data: {
    name: '', //教师姓名
    headImg: '', //教师头像
    headPath: '', //教师上传头像
    type: '', //授课类型
    jobTitle: [], //教师职称
    showLog: true, //教师职称弹窗
    description: '', //教师描述
    TitlesList: [], //所有教师职称列表
    checkedArr: [], //选中的教师职称
    plusShow: true,
    Id: '',
  },
  onLoad: function(options) {
    this.setData({
      Id: options.id || ''
    })
    this.init();
  },

  init() {
    if (this.data.Id) {
      wx.setNavigationBarTitle({
        title: '编辑教师',
      })
      this.getData();
    } else {
      wx.setNavigationBarTitle({
        title: '添加教师',
      })
    }
  },
  getData: function() {
    let that = this;
    var url = 'account/sellerteacher/details';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) {
      let arr = [];
      // for (let v of res.Data.ImgList) {
      //   arr.push(v.HeadUrl);
      // }
      that.setData({
        item: res.Data,
        name: res.Data.Name,
        jobTitle: res.Data.Titles,
        checkedArr: res.Data.TitlesId,
        headImg: res.Data.HeadUrl,
        headPath: res.Data.Head,
        old: res.Data.TeachingAge,
        description: res.Data.Experience,
      })
    });
  },
  //所有教师职称列表
  getTitlesList: function() {
    let that = this;
    var url = 'account/teacher/titles/list';
    var params = {

    }
    netUtil.postRequest(url, params, function(res) {
      console.log(that.data.checkedArr)
      for (let v of res.Data) {
        if (that.data.checkedArr.indexOf(v.TitlesId) != -1 || that.data.checkedArr.indexOf(v.TitlesId + '') != -1) {
          v.checked = true;
        } else {
          v.checked = false;
        }
      }
      console.log(res.Data)
      that.setData({
        TitlesList: res.Data
      })
    });
  },
  //打开教师职称弹窗
  changeTitle: function() {
    this.setData({
      showLog: false
    })
    this.getTitlesList();
  },
  //关闭教师职称弹窗
  closeCodeLog: function() {
    this.setData({
      showLog: !this.data.showLog
    })
  },
  //勾选的教师职称
  changeTitles: function(e) {
    console.log(e)
    this.setData({
      checkedArr: e.detail.value
    })
  },
  //职称弹窗的确定
  getCode: function() {
    var that = this;
    let arr = [];
    var temp = that.data.TitlesList.filter(item => {
      return that.data.checkedArr.indexOf(item.TitlesId + '') != -1;
    }).map(function(v) {
      return v.TitlesName;
    });
    that.setData({
      jobTitle: temp.toString(),
      showLog: true
    });
  },
  bindName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindNJobTitle: function(e) {
    this.setData({
      jobTitle: e.detail.value
    })
  },
  bindold: function(e) {
    this.setData({
      old: e.detail.value
    })
  },
  bindDescription: function(e) {
    this.setData({
      description: e.detail.value
    })
  },
  //上传图片
  bindUpload: function(e) {
    let that = this;
    wx.chooseImage({
      success(res) {
        let usertoken = wx.getStorageSync('userInfo').UserToken;
        const tempFilePaths = res.tempFilePaths
        let tempFiles = res.tempFiles[0].size;
        if (tempFiles > 1000000) {
          wx.showToast({
            icon: 'none',
            title: '图片不能超过1M',
          })
        } else {
          wx.uploadFile({
            url: baseUrl + 'img/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'Teacher.Main',
            header: {
              "Content-Type": "multipart/form-data", //记得设置
              'channelCode': 'wechat',
              'appVersion': '1.0.1',
              "userToken": usertoken,
            },
            success: (res) => {
              var ttt = JSON.parse(res.data);
              that.setData({
                headPath: ttt.Data.ImgPath,
                headImg: ttt.Data.ImgUrl,
              })
            },
            fail: (res) => {
              wx.showToast({
                icon: 'none',
                title: res.data.ErrorMessage,
              })
            },
          })
        }
      }
    })
  },
  //添加商户师资/编辑
  submit: function() {
    let that = this;
    var url = that.data.Id ? 'account/sellerteacher/modify' : 'account/sellerteacher/add';
    if (that.data.name) {
      wx.showToast({
        icon: 'none',
        title: '请输入教师姓名',
      })
    }
    if (that.data.headPath) {
      wx.showToast({
        icon: 'none',
        title: '请选择教师头像',
      })
    }
    var params = {
      TeacherId: that.data.Id,
      TeacherName: that.data.name,
      HeadImg: that.data.headPath,
      TeachingAge: that.data.old,
      TitlesId: that.data.checkedArr,
      Experience: that.data.description,
    }
    if (!that.data.name) {
      wx.showToast({
        icon: 'none',
        title: '内容不能为空',
      })
      return;
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showModal({
        title: that.data.Id ? '编辑成功' : '添加成功',
        content: '',
        showCancel: false,
        cancelColor: '#29d9d6',
        cancelText: '知道了',
        success: function(res) {
          let pages = getCurrentPages(); //当前页面
          let prevPage = pages[pages.length - 2]; //上一页面
          prevPage.init();
          wx.navigateBack({
            delta: 1
          })
        }
      })
    });
  },
  onShareAppMessage: function() {

  }
})