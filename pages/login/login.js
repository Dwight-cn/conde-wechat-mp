
import WX from "../../utils/promisify";


const app = getApp()
Page({
  data: {
    accessToken: ''
  },
  bindKeyInput(e) {
    let value = e.detail.value
    this.data.accessToken = value
  },
  // 扫码
  handleScanCode() {
    WX.scanCode()
      .then((res) => {
        let value = res.result
        this.data.accessToken = value
        this.login()
      })
  },
  // 校验accsssToken
  login() {
    let { accessToken } = this.data
    app.login(accessToken)
      .then(() => {
        wx.switchTab({
          url: '/pages/mine/mine'
        })
      })
  },
})
