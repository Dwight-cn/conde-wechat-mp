import { getUserInfo } from '../../api/user'
import { daysAgo } from '../../lib/util'

const app = getApp();
Page({
    data: {
        tabBorderOffser: 0,
        _tabBorderOffser: 0,
        currentTab: 0,
        userInfo: {},
        tabText: ['最近回复', '最新发布', '话题收藏'],
        tabContent: [[], [], []],
    },
    onLoad(option) {
        let userName = option.name;

        getUserInfo(userName)
            .then(res => {
                // console.log(res)
                this.setData({
                    userInfo: this.userInfoModel(res),
                    ['tabContent[0]']: res.recent_replies,
                    ['tabContent[1]']: res.recent_topics
                })
                console.log(res)
                console.log(this.data)
            })
            .catch(err => { })
    },
    userInfoModel(res) {
        return {
            avatar_url: res.avatar_url,
            loginname: res.loginname,
            githubUsername: res.githubUsername,
            score: res.score,
            create_at: daysAgo(res.create_at)
        }
    },
    tabTap(e) {
        let index = parseInt(e.currentTarget.dataset.index);
        this.setData({ currentTab: index })
    },
    swiperChangeHandle(e) {
        // console.log(e)
        this.setData({ currentTab: e.detail.current });
        // console.log(this.data.currentTab)
    },
    animationfinishHandle(e) {
        this.setData({ _tabBorderOffser: this.data.tabBorderOffser })
    },
    swiperTransitionHandle(e) {
        let l = this.data.tabText.length;
        this.setData({ tabBorderOffser: this.data._tabBorderOffser + e.detail.dx / l })
    },

})
