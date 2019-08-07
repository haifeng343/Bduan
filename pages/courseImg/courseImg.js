var netUtil = require("../../utils/request.js"); //require引入
let baseUrl = "https://test.guditech.com/rocketseller/";
Page({

  data: {
    Id: '',
    imgs: [],
  },

  onLoad: function (options) {
    this.setData({
      Id: options.id
    })
    this.init();
  },
  init: function () {
    this.getTitlesList();
  },
  //图片列表
  getTitlesList: function () {
    let that = this;
    var url = 'account/selleritem/img/list';
    var params = {
      Id: that.data.Id
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
      name: 'Item.Imgs',
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
  onShareAppMessage: function () {

  }
})