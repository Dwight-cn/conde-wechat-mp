Component({
    properties: {
        author: {
            type: Object,
            value: {}
        },
        createAt: {
            type: String,
            value: ''
        }
    },
    methods: {
        // 点击跳转用户个人主页
        tapJumpUserProfile() {
            wx.navigateTo({
                url: `/pages/user/user?name=${this.data.author.loginname}`
            });
        }
    }
})
