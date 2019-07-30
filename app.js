
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
})