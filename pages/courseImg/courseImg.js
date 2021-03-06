var netUtil = require("../../utils/request.js"); //require引入
const app = getApp().globalData;
Page({

  data: {
    Id: '',
    imgs: [],
    plusShow: true,
  },

  onLoad: function(options) {
    this.setData({
      Id: options.id
    })
    this.init();
  },
  init: function() {
    this.getTitlesList();
  },
  //失败弹窗
  clickEor: function(e) {
    wx.showModal({
      title: '审核失败',
      content: '失败原因' + e.currentTarget.dataset.content,
      showCancel: false,
      cancelText: '知道了',
      success: function() {

      }
    })
  },
  //图片列表
  getTitlesList: function() {
    let that = this;
    var url = 'account/selleritem/img/list';
    var params = {
      Id: that.data.Id
    }
    netUtil.postRequest(url, params, function(res) {
      let arr = [];
      for (let v of res.Data) {
        // if (that.data.checkedArr.indexOf(v.TypeId) != -1 || that.data.checkedArr.indexOf(v.TypeId + '') != -1) {
        //   v.checked = true;
        // } else {
        //   v.checked = false;
        // }
        arr.push(v.ImgUrl);
      }
      that.setData({
        imgs: res.Data,
        imgsArr: arr,
      })
    });
  },
  chooseImg: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let arr = that.data.imgs;
        arr.push({
          ImgShowUrl: tempFilePaths[0]
        });
        that.setData({
          imgs: arr
        });
        that.upLoadImg(tempFilePaths[0]);
        that.showHide();
      }
    });
  },
  /*
      删除图片
  */
  deleteImg: function(e) {
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
  delImg: function(id) {
    var that = this;
    var urls = 'account/selleritem/img/delete';
    var params = {
      Id: id,
    }
    netUtil.postRequest(urls, params, function(res) {

    });
  },
  /*
      预览图片
  */
  previewImg: function(e) {
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
  showHide: function(e) {
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
  upLoadImg: function(data) {
    var that = this;
    let usertoken = wx.getStorageSync('userInfo').UserToken;
    wx.uploadFile({
      url: netUtil.baseUrl + 'img/upload',
      filePath: data,
      header: {
        "Content-Type": "multipart/form-data", //记得设置
        'channelCode': 'wechat',
        'appVersion': '1.0.1',
        "userToken": usertoken,
      },
      name: 'Item.Imgs',
      success: (res) => {
        var ttt = JSON.parse(res.data);
        console.log(ttt);
        if (ttt.Data) {
          this.submit(ttt.Data.ImgPath);
        } else {
          wx.showToast({
            icon: 'none',
            title: ttt.ErrorMessage,
          })
        }
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
  submit: function(imgPath) {
    var that = this;
    var urls = 'account/selleritem/img/add';
    var params = {
      ItemId: this.data.Id,
      ImgUrl: imgPath,
    }
    netUtil.postRequest(urls, params, function(res) {
      that.init();
    }, null, false, false, false);
  },
  onShareAppMessage: function() {

  }
})