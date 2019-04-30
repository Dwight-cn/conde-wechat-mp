import request from './index'

/**
 * 获取用户详情
 * @param {*} loginname 用户名
 */
export const getUserInfo = (loginname) => {
    return request({
        url: `/user/${loginname}`,
        method: 'get'
    })
}

/**
 * 获取用户所收藏的主题
 * @param {*} loginname 用户名
 */
export const getUserTopicCollect = (loginname) => {
    return request({
        url: `/topic_collect/${loginname}`,
        method: 'get'
    })
}
