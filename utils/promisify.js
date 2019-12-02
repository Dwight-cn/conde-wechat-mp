// 将小程序异步回调接口 Promise 化
const _promisify = name => option =>
  new Promise((resolve, reject) =>
    wx[name]({
      ...option,
      success: resolve,
      fail: reject,
    })
  )

const _pro = new Proxy(wx, {
  get(target, prop) {
    return _promisify(prop)
  }
})

export default _pro
