

import { getTopicsList } from '../../api/topic'
import { filterHTMLTag, formatTime, getDateDiff } from '../../lib/util'


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
        topicPages: [1, 17, 1, 1],
        topicContent: [[], [], [], [], []],
        topicLoading: [false, false, false, false, false],
        topicLoaded: [false, false, false, false, false],
        defaultTopicParams: {
            tab: '', // 主题分类。目前有 ask share job good
            page: 1, // 页数
            limit: 20, // 每一页的主题数量
            mdrender: true // 当为 'false' 时，不渲染。默认为 'true'，渲染出现的所有 markdown 格式文本。
        },
        moreLoading: false
    },


    onLoad() {
        this.update();
    },

    // 获取主题列表
    _getTopicsList() {
        return new Promise((resolve, reject) => {
            let { currentTopic, topicTabs, topicPages, defaultTopicParams, topicLoading } = this.data;
            if (topicLoading[currentTopic]) reject('loading...');
            let params = {
                ...defaultTopicParams,
                page: topicPages[currentTopic],
                tab: topicTabs[currentTopic]
            }

            wx.showNavigationBarLoading();
            this.setData({ [`topicLoading[${currentTopic}]`]: true })
            getTopicsList(params)
                .then(res => {
                    wx.stopPullDownRefresh();
                    wx.hideNavigationBarLoading();
                    let _res = this.topicListModel(res);
                    let loaded = false;
                    // console.log('res:', _res)
                    if (_res.length === 0) {
                        loaded = true
                    }
                    this.setData({ [`topicLoaded[${currentTopic}]`]: loaded })
                    resolve(_res);
                })
                .catch(err => {
                    reject(err);
                    this.setData({ [`topicLoading[${currentTopic}]`]: false })
                })
        })
    },
    update() {
        let { currentTopic, topicPages, topicContent } = this.data;
        this.setData({ [`topicPages[${currentTopic}]`]: 1 });
        this._getTopicsList()
            .then(res => {
                this.setData({
                    [`topicContent[${currentTopic}]`]: res,
                    [`topicLoading[${currentTopic}]`]: false
                })
            })
            .catch(err => { })
    },
    loadMore() {
        let { currentTopic, topicPages, topicContent, topicLoaded } = this.data;
        if (topicLoaded[currentTopic]) return
        this.setData({ [`topicPages[${currentTopic}]`]: topicPages[currentTopic] + 1 });
        this._getTopicsList()
            .then(res => {
                this.setData({
                    [`topicContent[${currentTopic}]`]: [...topicContent[currentTopic], ...res],
                    [`topicLoading[${currentTopic}]`]: false
                })
                // console.log(this.data.topicContent[0])
            })
            .catch(err => { })
    },

    // 简化列表数据
    topicListModel(list) {
        return list.map(item => {
            return {
                id: item.id,
                author_id: item.author_id,
                tab: item.tab,
                content: filterHTMLTag(item.content).slice(0, 50),
                title: item.title,
                last_reply_at: getDateDiff(item.last_reply_at),
                good: item.good,
                top: item.top,
                reply_count: item.reply_count,
                visit_count: item.visit_count,
                create_at: getDateDiff(item.create_at),
                author: item.author
            }
        })
    },

    tabTap(e) {
        let index = parseInt(e.currentTarget.dataset.index);
        this.setData({ currentTopic: index })
    },


    // scrollHandle
    onPageScroll(e) {
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
        // console.log("手指移动");
        if (!this.data.touchMoving) {
            this.setData({ touchMoving: true })
        }
    },
    touchendHandle(e) {
        // console.log("手指离开");
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
