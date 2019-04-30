import { getUserInfo, getUserTopicCollect } from '../../api/user'
import { daysAgo } from '../../lib/util'

const app = getApp();
Page({
    data: {
        tabBorderOffser: 0,
        _tabBorderOffser: 0,
        tabBarOffsetTop: 9999,
        currentTab: 0,
        userInfo: {},
        tabText: ['最近回复', '最新发布', '话题收藏'],
        tabContent: [[], [], []],
    },
    onLoad(option) {
        let userName = option.name;
        let userInfoPms = this._getUserInfo(userName);
        let userTopicCollectPms = this._getUserTopicCollect(userName);

        Promise.all([userInfoPms, userTopicCollectPms])
            .then(() => {
                this.getTabBarOffsetTop();
                wx.hideNavigationBarLoading();
            }).catch(() => {
                wx.hideNavigationBarLoading();
            })
    },
    // 监听页面滚动
    onPageScroll(e) {
        // 判断页面是否滚动带tabBar顶部
        if (e.scrollTop >= this.data.tabBarOffsetTop) {
            // 将scroll-view设为可滚动（实现tabBar吸顶效果）
            this.setData({
                allowScrollY: true
            });
        } else {
            // 否则scroll-view设为不可滚动（释放tabBar吸顶效果）
            this.data.allowScrollY &&
                this.setData({
                    allowScrollY: false
                });
        }
    },
    _getUserInfo(userName) {
        return new Promise((resolve, reject) => {
            wx.showNavigationBarLoading();
            getUserInfo(userName)
                .then(res => {
                    resolve(res);
                    this.setData({
                        userInfo: this.userInfoModel(res),
                        ['tabContent[0]']: res.recent_replies,
                        ['tabContent[1]']: res.recent_topics
                    })
                    // console.log(this.userInfoModel(res))
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    _getUserTopicCollect(userName) {
        return new Promise((resolve, reject) => {
            wx.showNavigationBarLoading();
            getUserTopicCollect(userName)
                .then(res => {
                    resolve(res);
                    // console.log(res)
                    this.setData({
                        ['tabContent[2]']: this.topicListModel(res)
                    })
                })
                .catch(err => {
                    reject(err);
                })
        })
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
    // 获取tabBar距离顶部的距离
    getTabBarOffsetTop() {
        let query = wx.createSelectorQuery();
        query
            .select('.top-tab')
            .boundingClientRect(res => {
                this.setData({
                    tabBarOffsetTop: res.top
                });
            })
            .exec();
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
    topicListModel(list) {
        return list.map(item => {
            return {
                id: item.id,
                title: item.title,
                // last_reply_at: getDateDiff(item.last_reply_at),
                author: item.author
            }
        })
    },
})
