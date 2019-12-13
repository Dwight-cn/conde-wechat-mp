const app = getApp()

Page({
  onShow() {
    app.checkLogin()
  },

  logout() {
    app.logout()
  }
})
