var netUtil = require("../../utils/request.js"); //require引入
const app = getApp().globalData;
const baseUrl = app.baseUrl;
Page({
  data: {
    imgs: [],
    text: '',
    storeId: '', //门店Id
    price: 0, //最大金额
    plusShow: true,
    orderId: '', //Id
    kmd: '', //状态码
    kd: '',
    lpm: {},
    urlImgs: [],//图片列表
  },
  onLoad: function(options) {
    this.setData({
      storeId: options.storeId || '',
      price: options.price || 0,
      kmd: options.kmd || '',
      kd: options.kd || '',
    });
    this.init();
  },
  init: function() {
    
  },
  hasMoney: function(e) {
    this.setData({
      money: e.detail.value
    })
  },
  hasText: function(e) {
    this.setData({
      text: e.detail.value
    })
  },
  allMoney: function() {
    this.setData({
      money: Number(this.data.price / 100)
    })
  },
  getData: function() {
    let that = this;
    var url = 'recharge/refund/apply';
    if(!that.data.money){
      wx.showToast({
        icon:'none',
        title: '请输入正确金额',
      })
      return false;
    }
    var params = {
      StoreId:that.data.storeId,
      RefundMoney: Number(that.data.money * 100),
      RefundReason: that.data.text,
      ImgList: that.data.urlImgs,
    }
    netUtil.postRequest(url, params, function(res) {
      wx.showModal({
        title: '申请退款成功',
        content: '我们将在1-3个工作日处理',
        showCancel:false,
        confirmText: '知道了',
        confirmColor: '#29d9d6',
        success: function() {
          wx.navigateBack({
            
          })
        }
      })
      that.setData({
        List: res.Data
      })
    });
  },
  chooseImg: function(e) {
    var that = this;
    var imgs = that.data.imgs; //存图片地址的变量
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(res)
        imgs.push(tempFilePaths[0]);
        that.upLoadImg(tempFilePaths[0]);
        that.setData({
          imgs: imgs
        });
        that.showHide();
      }
    });
  },
  /*
      删除图片
  */
  deleteImg: function(e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
    this.showHide();
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
  /*提交*/
  submit: function() {
    this.getData();
  },
  //上传图片
  upLoadImg: function(data) {
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
      name: 'Recharge.Refund',
      success: (res) => {
        var ttt = JSON.parse(res.data)
        var temp = that.data.urlImgs;
        temp.push(ttt.Data.ImgPath);
        that.setData({
          urlImgs: temp
        })
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: res.data.ErrorMessage,
        })
      },
    });
  },
  bindPickerChange: function(e) {
    let index = e.detail.value;
    // console.log('picker发送选择改变，携带值为', this.data.array[index])
    this.setData({
      index: e.detail.value,
      Reason: this.data.array[index]
    })
  },
  onShareAppMessage: function() {

  },
})