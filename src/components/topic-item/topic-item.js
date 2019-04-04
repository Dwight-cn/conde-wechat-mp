
import computedBehavior from '../../lib/behavior';
import { filterHTMLTag, formatTime, getDateDiff } from '../../lib/util'

Component({
    behaviors: [computedBehavior],
    properties: {
        data: {
            type: Object,
            value: {}
        }
    },
    data: {},
    computed: {
        // 过滤HTML标签、截取长度
        content() {
            return filterHTMLTag(this.data.data.content).slice(0, 60);
        },
        create_at() {
            return formatTime(this.data.data.create_at);
        },
        last_reply_at() {
            console.log(getDateDiff(this.data.data.last_reply_at))
            return getDateDiff(this.data.data.last_reply_at);
        }
    },
    methods: {
        // 点击跳转话题详情
        tapJumpTopicDetail() {
            wx.navigateTo({
                url: `/pages/topic/topic?id=${this.data.data.id}`
            });
        },
        // 点击跳转用户个人主页
        tapJumpUserProfile() {
            wx.navigateTo({
                url: `/pages/user/user?name=${this.data.data.loginname}`
            });
        }
    }
});
