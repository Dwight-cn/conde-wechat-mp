import request from './index'

/**
 * 获取用户详情
 * loginname  用户名
 */
export const getUserInfo = (loginname) => {
    return request({
        url: `/user/${loginname}`,
        method: 'get'
    })
}
