

import { getTopicsList } from '../../api/topic'


//index.js
//获取应用实例
const app = getApp()


Page({
    data: {
        currentTopic: 0,
        topicTabFixed: false,
        touchMoving: true,
        tabBorderOffser: 0,
        _tabBorderOffser: 0,
        topicText: ['全部', '精华', '分享', '问答', '招聘'],
        topicTabs: ['', 'good', 'share', 'ask', 'job'],
        topicPages: [1, 1, 1, 1],
        topicContent: [[], [], [], [], []],
        defaultTopicParams: {
            tab: '', // 主题分类。目前有 ask share job good
            page: 1, // 页数
            limit: 10, // 每一页的主题数量
            mdrender: true // 当为 'false' 时，不渲染。默认为 'true'，渲染出现的所有 markdown 格式文本。
        },
        moreLoading: false
    },


    onLoad() {
        this.update();
    },

    // 获取主题列表
    _getTopicsList() {
        let { currentTopic, topicTabs, topicPages, defaultTopicParams } = this.data;
        let params = {
            ...defaultTopicParams,
            page: topicPages[currentTopic],
            tab: topicTabs[currentTopic]
        }

        wx.showNavigationBarLoading();
        this.setData({ moreLoading: true });

        return new Promise((resolve, reject) => {
            getTopicsList(params)
                .then(res => {
                    wx.stopPullDownRefresh();
                    wx.hideNavigationBarLoading();
                    this.setData({ moreLoading: false })
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    update() {
        if (this.data.moreLoading) return
        let { currentTopic, topicPages, topicContent } = this.data;
        let _topicPages = [...topicPages];
        let _topicContent = [...topicContent];
        _topicPages[currentTopic] = 1;
        this.setData({ topicPages: _topicPages });
        this._getTopicsList()
            .then(res => {
                _topicContent[currentTopic] = res;
                this.setData({
                    topicContent: _topicContent
                })
            })
    },
    loadMore() {
        let { currentTopic, topicPages, topicContent } = this.data;
        let _topicPages = [...topicPages];
        let _topicContent = [...topicContent];
        _topicPages[currentTopic] += 1;
        this.setData({ topicPages: _topicPages });
        this._getTopicsList()
            .then(res => {
                _topicContent[currentTopic] = [..._topicContent[currentTopic], ...res];
                this.setData({
                    topicContent: _topicContent
                })
            })
    },

    tabTap(e) {
        let index = parseInt(e.currentTarget.dataset.index);
        this.setData({ currentTopic: index })
    },


    // scrollHandle
    onPageScroll(e) {
        console.log(1231)
        if (e.scrollTop >= 0) {
            this.setData({ topicTabFixed: true })
        } else {
            this.setData({ topicTabFixed: false })
        }
    },
    upper(e) {
        console.log("到顶了");
        if (this.data.touchMoving) {
            wx.startPullDownRefresh()
        }
    },
    touchmoveHandle(e) {
        console.log("手指移动");
        if (!this.data.touchMoving) {
            this.setData({ touchMoving: true })
        }
    },
    touchendHandle(e) {
        console.log("手指离开");
        if (this.data.touchMoving) {
            this.setData({ touchMoving: false })
        }
    },

    // swiperHandle
    swiperChangeHandle(e) {
        // console.log(e)
        this.setData({ currentTopic: e.detail.current });
        if (this.data.topicContent[this.data.currentTopic].length <= 0) {
            this.update();
        }
        // console.log(this.data.currentTopic)
    },
    animationfinishHandle(e) {
        this.setData({ _tabBorderOffser: this.data.tabBorderOffser })
    },
    swiperTransitionHandle(e) {
        this.setData({ tabBorderOffser: this.data._tabBorderOffser + e.detail.dx / 5 })
    },

    onPullDownRefresh() {
        this.update();
    }
})
