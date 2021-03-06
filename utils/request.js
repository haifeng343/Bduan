/**
 * 供外部post请求调用
 */
function post(url, params, onSuccess, onFailed, isShowLoading = true, isShowError = true, isnavigateToLogin = true, isStopPullDown=false) {
  request(url, params, "POST", onSuccess, onFailed, isShowLoading, isShowError, isnavigateToLogin, isStopPullDown);
}

/**
 * 供外部get请求调用
 */
function get(url, params, onSuccess, onFailed, isShowLoading = true, isShowError = true, isnavigateToLogin = true, isStopPullDown = false) {
  request(url, params, "GET", onSuccess, onFailed, isShowLoading, isShowError, isnavigateToLogin, isStopPullDown);
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onStart 开始请求,初始加载loading等处理
 * @onSuccess 成功回调
 * @onFailed  失败回调
 */

const baseUrl = "https://qxbseller.guditech.com/";
// const baseUrl = "https://test.guditech.com/rocketseller/";

function request(url, params, method, onSuccess, onFailed, isShowLoading, isShowError, isnavigateToLogin, isStopPullDown) {
  if (isShowLoading) {
    wx.showLoading({
      title: '玩命加载中...',
    });
  }

  let moment = {};
  var that = this;
  let usertoken = '';
  var userInfo = wx.getStorageSync('userInfo'); //wx.getStorageSync(key)，获取本地缓存
  if (userInfo) {
    usertoken = userInfo.UserToken;
  }

  wx.request({
    url: baseUrl + url,
    data: dealParams(params),
    method: method,
    header: {
      'content-type': 'application/json', // 默认值
      'channelCode': 'wechat',
      'appVersion': '1.0.1',
      'userToken': usertoken,
    },
    success: function(res) {
      if (isShowLoading) {
        wx.hideLoading();
      }

      if (res.data) {
        /** start 根据需求 接口的返回状态码进行处理 */
        if (res.data.ErrorCode == 0) {
          if (onSuccess) {
            onSuccess(res.data); //request success
          }
        } else if (res.data.ErrorCode == 301) {
          if (isnavigateToLogin) {
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }
        } else {
          if (isShowError) {
            wx.showToast({
              icon: 'none',
              title: res.data.ErrorMessage,
            })
          }
          if (onFailed) {
            onFailed();
          }

        }
        /** end 处理结束*/
      }

      if (isStopPullDown) {
        wx.stopPullDownRefresh();
      }
    },

    fail: function(error) {
      if (isShowLoading) {
        wx.hideLoading();
      }

      if (isShowError) {
        wx.showToast({
          icon: 'none',
          title: '网络错误',
        }) //failure for other reasons
      }

      if (onFailed) {
        onFailed(error);
      }

      if (isStopPullDown) {
        wx.stopPullDownRefresh();
      }
    }
  })
}

/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
  return params;
}

module.exports = {
  postRequest: post,
  getRequest: get,
  baseUrl: baseUrl
}


//https://www.cnblogs.com/denluoyia/p/9428570.html链接地址