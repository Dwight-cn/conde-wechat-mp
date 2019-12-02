import { checkAccesstoken } from "../../api/user";

Page({
  data: {
    accessToken: ''
  },
  bindKeyInput(e) {
    let value = e.detail
    this.data.accessToken = value
  },
  login() {
    let { accessToken } = this.data
    wx.showLoading()
    checkAccesstoken(accessToken)
      .then((res) => {
        console.log(res)
        wx.hideLoading()
      })
  }
})
