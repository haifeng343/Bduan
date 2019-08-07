var netUtil = require("../../utils/request.js"); //require引入
let baseUrl = "https://test.guditech.com/rocketseller/";
Page({
  data: {
    name: '', //课程姓名
    headImg: '', //课程头像
    headPath: '',//课程上传头像
    type: '', //授课类型
    jobTitle: [], //课程职称
    showLog: true, //课程职称弹窗
    TitlesList: [], //所有课程职称列表
    checkedArr: [], //选中的课程职称
    imgs: [],
    plusShow: true,
    Id: '',
    imgsArr: [],
  },
  onLoad: function (options) {
    this.setData({
      Id: options.id || ''
    })
    this.init();
  },

  init() {
    if (this.data.Id) {
      wx.setNavigationBarTitle({
        title: '编辑课程',
      })
      this.getData();
    } else {
      wx.setNavigationBarTitle({
        title: '创建课程',
      })
    }
  },
  getData: function () {
    let that = this;
    var url = 'account/selleritem/details';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function (res) {
      let arr = [];
      for (let v of res.Data.ItemImgList) {
        arr.push(v.ImgShowUrl);
      }
      that.setData({
        item: res.Data,
        name: res.Data.ItemName,
        jobTitle: res.Data.ItemTypeDes,
        checkedArr: res.Data.TitlesId,
        headImg: res.Data.ItemCoverImg,
        headPath: res.Data.Head,
        old: res.Data.ItemDescription,
        imgs: res.Data.ItemImgList,
        imgsArr: arr,
      })
    });
  },
  //所有课程类型列表
  getTitlesList: function () {
    let that = this;
    var url = 'account/selleritem/type/list';
    var params = {

    }
    netUtil.postRequest(url, params, function (res) {
      for (let v of res.Data) {
        // if (that.data.checkedArr.indexOf(v.TypeId) != -1 || that.data.checkedArr.indexOf(v.TypeId + '') != -1) {
        //   v.checked = true;
        // } else {
        //   v.checked = false;
        // }
      }
      that.setData({
        TitlesList: res.Data
      })
    });
  },
  //打开课程类型弹窗
  changeTitle: function () {
    this.setData({
      showLog: false
    })
    this.getTitlesList();
  },
  //关闭课程类型弹窗
  closeCodeLog: function () {
    this.setData({
      showLog: !this.data.showLog
    })
  },
  //勾选的课程类型
  changeTitles: function (e) {
    console.log(e)
    this.setData({
      checkedArr: e.detail.value
    })
  },
  //职称弹窗的确定
  getCode: function () {
    var that = this;
    let arr = [];
    var temp = that.data.TitlesList.filter(item => {
      return that.data.checkedArr.indexOf(item.TypeId + '') != -1;
    }).map(function (v) {
      return v.TypeName;
    });
    that.setData({
      jobTitle: temp.toString(),
      showLog: true
    });
  },
  bindName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindNJobTitle: function (e) {
    this.setData({
      jobTitle: e.detail.value
    })
  },
  bindold: function (e) {
    this.setData({
      old: e.detail.value
    })
  },
  bindDescription: function (e) {
    this.setData({
      description: e.detail.value
    })
  },
  //上传图片
  bindUpload: function (e) {
    let that = this;
    wx.chooseImage({
      success(res) {
        let usertoken = wx.getStorageSync('userInfo').UserToken;
        const tempFilePaths = res.tempFilePaths
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
    })
  },
  chooseImg: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let arr = that.data.imgs;
        arr.push({ HeadUrl: tempFilePaths[0] });
        that.setData({ imgs: arr });
        that.upLoadImg(tempFilePaths[0]);
        that.showHide();
      }
    });
  },
  /*
      删除图片
  */
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var arr = this.data.imgsArr;
    var index = e.currentTarget.dataset.index;
    if (imgs[index].ImgId) {
      this.delImg(imgs[index].ImgId);
    }
    imgs.splice(index, 1);
    arr.splice(index, 1);
    this.setData({
      imgs: imgs,
      imgsArr: arr,
    });
    this.showHide();
  },
  //删除
  delImg: function (id) {
    var that = this;
    var urls = 'account/sellerteacher/img/delete';
    var params = {
      Id: id,
    }
    netUtil.postRequest(urls, params, function (res) {

    });
  },
  /*
      预览图片
  */
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  /*
      控制添加图片按钮是否显示出来
  */
  showHide: function (e) {
    if (this.data.imgs.length == 1) {
      this.setData({
        plusShow: true
      });
    } else if (this.data.imgs.length < 6) {
      this.setData({
        plusShow: true
      });
    } else if (this.data.imgs.length == 6) {
      this.setData({
        plusShow: false
      });
    }
  },
  //上传图片
  upLoadImg: function (data) {
    var that = this;
    let usertoken = wx.getStorageSync('userInfo').UserToken;
    wx.uploadFile({
      url: baseUrl + 'img/upload',
      filePath: data,
      header: {
        "Content-Type": "multipart/form-data", //记得设置
        'channelCode': 'wechat',
        'appVersion': '1.0.1',
        "userToken": usertoken,
      },
      name: 'Teacher.Imgs',
      success: (res) => {
        var ttt = JSON.parse(res.data)
        that.addImg(ttt.Data.ImgPath);
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: res.data.ErrorMessage,
        })
      },
    });
  },
  //添加
  addImg: function (url) {
    var that = this;
    var urls = 'account/sellerteacher/img/add';
    var params = {
      TeacherId: this.data.Id,
      ImgUrl: url,
    }
    netUtil.postRequest(urls, params, function (res) {
      var temp = that.data.imgsArr || [];
      temp.push(url);
      that.setData({
        imgsArr: temp
      })
    });
  },
  //添加商户师资/编辑
  submit: function () {
    let that = this;
    var url = that.data.Id ? 'account/sellerteacher/modify' : 'account/sellerteacher/add';
    if (that.data.name) {
      wx.showToast({
        icon: 'none',
        title: '请输入课程名称',
      })
    }
    if (that.data.headPath) {
      wx.showToast({
        icon: 'none',
        title: '请选择课程图片',
      })
    }
    var params = {
      TeacherId: that.data.Id,
      TeacherName: that.data.name,
      HeadImg: that.data.headPath,
      TeachingAge: that.data.old,
      TitlesId: that.data.checkedArr,
      Experience: that.data.description,
      ImgUrlList: that.data.imgsArr
    }
    if (!that.data.name || !that.data.jobTitle || !that.data.old || !that.data.headPath || !that.data.description) {
      wx.showToast({
        icon: 'none',
        title: '内容不能为空',
      })
      return;
    }
    netUtil.postRequest(url, params, function (res) {
      wx.showModal({
        title: that.data.Id ? '编辑成功' : '添加成功',
        content: '',
        showCancel: false,
        cancelColor: '#29d9d6',
        cancelText: '知道了',
        success: function (res) {
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
  onShareAppMessage: function () {

  }
})