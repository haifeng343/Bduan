
App({
  onLaunch: function() {

  },
  onLoad() {
    wx.loadFontFace({ //微信小程序平方字体

      family: 'PingFangSC-Medium',

      source: 'url("https://www.your-server.com/PingFangSC-Medium.ttf")',

      success: function() {
        console.log('load font success')
      }

    })
  },
  globalData: {
    // baseUrl: 'https://qxbseller.guditech.com/',
     baseUrl : "https://test.guditech.com/rocketseller/",
    mobileReg: /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/
  },
})