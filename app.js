//app.js
import Towxml from './components/towxml/main'     //引入towxml库
import Store from "./lib/store"
import { checkAccesstoken } from "./api/user";


// 全局状态管理
let store = new Store({
  state: {
    isLogin: false,     //登录状态
    userInfo: {},
    messageCount: 0,     //未读消息数
  }
})

App({
  onLaunch() {

  },
  checkLogin() {
    const accessToken = wx.getStorageSync('accessToken') || ''
    const userInfo = wx.getStorageSync('userInfo') || null
    let isLogin = !!(accessToken && userInfo)
    this.store.setState({
      isLogin,
      userInfo,
    })
    return isLogin
  },

  login(accessToken) {
    wx.showLoading()

    return checkAccesstoken(accessToken)
      .then((res) => {
        // console.log(res)
        wx.setStorageSync('accessToken', accessToken)
        wx.setStorageSync('userInfo', res)
        app.store.setState({
          isLogin: true,
          userInfo: res
        })
        wx.hideLoading()
      })
      .catch(() => {
        wx.hideLoading()
      })
  },

  towxml: new Towxml(),                   //创建towxml对象，供小程序页面使用
  store: store,
})
