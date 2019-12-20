Component({
  properties: {
    src: {
      type: String,
      value: ''
    }
  },
  data: {
    avatarLoaded: false
  },
  methods: {
    // 点击跳转用户个人主页
    onImgLoad() {
      this.setData({ avatarLoaded: true })
    }
  }
})
