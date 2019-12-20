// components/xing/x-scroll-view/x-scroll-view.js
import { throttle } from "../../utils/utils";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 下拉提示文案
    pullText: {
      type: String,
      value: '下拉刷新',
    },
    // 松开提示文案
    releaseText: {
      type: String,
      value: '松开刷新',
    },
    // 是否正在刷新
    updating: {
      type: Boolean,
      value: false,
      observer: '_onUpdateChange',
    },
    // 刷新中文案
    updatingText: {
      type: String,
      value: '正在刷新',
    },
    // 刷新完毕文案
    finishText: {
      type: String,
      value: '刷新完成',
    },
    // 是否正在加载更多
    loadingMore: {
      type: Boolean,
      value: false,
    },
    // 加载更多提示文案
    loadmoreText: {
      type: String,
      value: '正在加载...',
    },
    // 是否全部加载完毕
    loaded: {
      type: Boolean,
      value: false,
    },
    //加载完毕文案
    loadedText: {
      type: String,
      value: '已经全部加载完毕',
    },
    // 下拉刷新触发刷新距离
    upperThreshold: {
      type: Number,
      value: 50,
    },
    // 距底部多远时，触发 scrolltolower 事件
    lowerThreshold: {
      type: Number,
      value: 200,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    pullDownStatus: 0, //0：初始状态 ->1：下拉中 ->2：待松开 -> 3：刷新中 -> 4：已完成
    lastScrollEnd: 0,
    touch: {
      startY: 0,
      endY: 0
    },
    scrollTop: 0,
    scrollOffset: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onScroll: function (e) {
      this.triggerEvent('scroll', e.detail);
      this.data.scrollTop = e.detail.scrollTop
    },

    _onTouchStart(e) {
      this.data.touch.startY = e.touches[0].pageY
      this.data.touch.endY = e.touches[0].pageY
      this.setData({
        scrollOffset: 0
      })
    },

    _onTouchMove: throttle(function (e) {
      this.data.touch.endY = e.touches[0].pageY
      if (e.touches[0].pageY - this.data.touch.startY > 0 && this.data.scrollTop >= 0) {
        this.setData({
          scrollOffset: (e.touches[0].pageY - this.data.touch.startY) * (1600 - e.touches[0].pageY - this.data.touch.startY) / 1600
        })
      }
      const { startY, endY } = this.data.touch;
      const offset = endY - startY;
      const status = this.data.pullDownStatus;
      if (status === 3 || status == 4) return;
      const height = this.properties.upperThreshold;
      let targetStatus;
      if (offset > height) {
        // 待松开
        targetStatus = 2;
      } else if (offset > 0) {
        // 下拉中
        targetStatus = 1;
      } else {
        // 初始状态
        targetStatus = 0;
      }
      if (status != targetStatus) {
        this.setData({
          pullDownStatus: targetStatus,
        })
      }
    }),

    _onTouchEnd: function (e) {
      wx.nextTick(() => {
        this.data.touch.startY = 0
        this.data.touch.endY = 0,
          this.setData({
            scrollOffset: 0
          })
      })
      const status = this.data.pullDownStatus;
      if (status === 2) {
        this.setData({
          pullDownStatus: 3,
        })
        this.properties.updating = true;
        setTimeout(() => {
          this.triggerEvent('scrolltoupper');
        }, 500);
      } else if (status === 1) {
        this.setData({
          pullDownStatus: 0,
        })
      }
    },

    _onUpdateChange(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.properties.loaded = false;
        this.setData({
          loaded: false,
        })
        this.setData({
          pullDownStatus: 4,
          lastScrollEnd: 0,
        })
        setTimeout(() => {
          this.setData({
            pullDownStatus: 0,
          })
        }, 500);
      } else if (oldVal === false && newVal === true){
        this.setData({
          pullDownStatus: 3,
          lastScrollEnd: 0,
        })
      }
    },

    _onLoadmore() {
      if (!this.properties.loaded) {
        let query = wx.createSelectorQuery().in(this);
        query.select('.scroll-view').fields({
          size: true,
          scrollOffset: true,
        }, res => {
          if (Math.abs(res.scrollTop - this.data.lastScrollEnd) > res.height) {
            this.setData({
              lastScrollEnd: res.scrollTop,
            })
            this.triggerEvent('scrolltolower');
          }
        }).exec();
      }
    },


  },
})
